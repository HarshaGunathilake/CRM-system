"use server";

import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import type { Lead, LeadStatus } from "@/lib/mock/data";

const STATUS_TO_DB: Record<string, LeadRow["status"]> = {
  New: "NEW", Contacted: "CONTACTED", Qualified: "QUALIFIED", Proposal: "PROPOSAL",
  Negotiation: "NEGOTIATION", Converted: "CONVERTED", Lost: "LOST",
};
const STATUS_FROM_DB: Record<string, LeadStatus> = {
  NEW: "New", CONTACTED: "Contacted", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CONVERTED: "Converted", LOST: "Lost",
};

type LeadRow = typeof leads.$inferSelect;

function toUiLead(row: LeadRow & { ownerName?: string | null }): Lead {
  return {
    id: row.id,
    name: row.name,
    companyName: row.companyName,
    jobTitle: row.jobTitle,
    email: row.email,
    phone: row.phone,
    status: STATUS_FROM_DB[row.status] ?? "New",
    source: row.source,
    score: row.score,
    owner: row.ownerName ?? "Unassigned",
    createdAt: row.createdAt,
    lastActivity: row.lastActivity,
    nextActivity: row.nextActivity,
    tags: row.tags,
    estValue: row.estValue,
  };
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const row = await db.query.leads.findFirst({ where: eq(leads.id, id), with: { owner: true } });
  if (!row) return null;
  return toUiLead({ ...row, ownerName: row.owner?.name });
}

export async function getLeads(): Promise<Lead[]> {
  const rows = await db.query.leads.findMany({
    orderBy: [desc(leads.createdAt)],
    with: { owner: true },
  });
  return rows.map((r) => toUiLead({ ...r, ownerName: r.owner?.name }));
}

const createLeadSchema = z.object({
  name: z.string().min(2),
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().min(1),
  status: z.string().min(1),
  estValue: z.string().optional(),
  notes: z.string().optional(),
});

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createLeadAction(input: z.infer<typeof createLeadSchema>): Promise<ActionResult> {
  const parsed = createLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const session = await getSession();
  const { name, companyName, email, phone, source, status, estValue } = parsed.data;

  const [row] = await db
    .insert(leads)
    .values({
      name,
      companyName,
      jobTitle: "Unknown",
      email,
      phone: phone || "",
      source,
      status: STATUS_TO_DB[status] ?? "NEW",
      estValue: estValue ? Number(estValue) || 0 : 0,
      ownerId: session?.userId,
    })
    .returning();

  await logAudit({
    actorId: session?.userId,
    action: "Created",
    entityType: "Lead",
    entity: `${row.name} — ${row.companyName}`,
  });

  revalidatePath("/leads");
  return { ok: true };
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  const row = await db.query.leads.findFirst({ where: eq(leads.id, id) });
  if (!row) return { ok: false, error: "Lead not found" };
  await db.delete(leads).where(eq(leads.id, id));
  await logAudit({
    actorId: session?.userId,
    action: "Deleted",
    entityType: "Lead",
    entity: `${row.name} — ${row.companyName}`,
    severity: "WARNING",
  });
  revalidatePath("/leads");
  return { ok: true };
}
