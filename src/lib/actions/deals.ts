"use server";

import { z } from "zod";
import { desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { deals, companies, notifications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import type { Deal, DealStage, Priority } from "@/lib/mock/data";
import type { ActionResult } from "./leads";

type DealRow = typeof deals.$inferSelect;

const STAGE_TO_DB: Record<string, DealRow["stage"]> = {
  "New Lead": "NEW_LEAD", Qualified: "QUALIFIED", Proposal: "PROPOSAL",
  Negotiation: "NEGOTIATION", Won: "WON", Lost: "LOST",
};
const STAGE_FROM_DB: Record<string, DealStage> = {
  NEW_LEAD: "New Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", WON: "Won", LOST: "Lost",
};
const PRIORITY_TO_DB: Record<string, DealRow["priority"]> = {
  Low: "LOW", Medium: "MEDIUM", High: "HIGH", Urgent: "URGENT",
};
const PRIORITY_FROM_DB: Record<string, Priority> = {
  LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent",
};

function toUiDeal(row: DealRow & { ownerName?: string | null; companyName?: string | null; companyIdVal?: string | null }): Deal {
  return {
    id: row.id,
    name: row.name,
    companyId: row.companyIdVal ?? "",
    companyName: row.companyName ?? "Unknown",
    contactName: row.contactName,
    value: row.value,
    stage: STAGE_FROM_DB[row.stage] ?? "New Lead",
    probability: row.probability,
    owner: row.ownerName ?? "Unassigned",
    expectedClose: row.expectedClose,
    priority: PRIORITY_FROM_DB[row.priority] ?? "Medium",
    createdAt: row.createdAt,
  };
}

export async function getDealById(id: string): Promise<Deal | null> {
  const row = await db.query.deals.findFirst({ where: eq(deals.id, id), with: { owner: true, company: true } });
  if (!row) return null;
  return toUiDeal({ ...row, ownerName: row.owner?.name, companyName: row.company?.name, companyIdVal: row.companyId });
}

export async function getDeals(): Promise<Deal[]> {
  const rows = await db.query.deals.findMany({
    orderBy: [desc(deals.createdAt)],
    with: { owner: true, company: true },
  });
  return rows.map((r) =>
    toUiDeal({ ...r, ownerName: r.owner?.name, companyName: r.company?.name, companyIdVal: r.companyId })
  );
}

const createDealSchema = z.object({
  name: z.string().min(2),
  companyName: z.string().min(2),
  value: z.string().min(1),
  stage: z.string().min(1),
  priority: z.string().min(1),
  expectedClose: z.string().min(1),
});

export async function createDealAction(input: z.infer<typeof createDealSchema>): Promise<ActionResult> {
  const parsed = createDealSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const session = await getSession();
  const { name, companyName, value, stage, priority, expectedClose } = parsed.data;

  let company = await db.query.companies.findFirst({ where: ilike(companies.name, companyName) });
  if (!company) {
    [company] = await db
      .insert(companies)
      .values({
        name: companyName,
        industry: "Unknown",
        location: "Unknown",
        website: `www.${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
        logoLetter: companyName[0]?.toUpperCase() ?? "?",
        ownerId: session?.userId,
      })
      .returning();
  }

  const stageDb = STAGE_TO_DB[stage] ?? "NEW_LEAD";
  const probability = { NEW_LEAD: 10, QUALIFIED: 30, PROPOSAL: 55, NEGOTIATION: 75, WON: 100, LOST: 0 }[stageDb];

  const [row] = await db
    .insert(deals)
    .values({
      name,
      contactName: session?.name ?? "Unknown",
      value: Number(value) || 0,
      stage: stageDb,
      probability,
      priority: PRIORITY_TO_DB[priority] ?? "MEDIUM",
      expectedClose: new Date(expectedClose),
      companyId: company.id,
      ownerId: session?.userId,
    })
    .returning();

  await logAudit({ actorId: session?.userId, action: "Created", entityType: "Deal", entity: row.name });
  revalidatePath("/deals");
  return { ok: true };
}

export async function updateDealStageAction(id: string, stage: DealStage): Promise<ActionResult> {
  const session = await getSession();
  const stageDb = STAGE_TO_DB[stage] ?? "NEW_LEAD";
  const probability = { NEW_LEAD: 10, QUALIFIED: 30, PROPOSAL: 55, NEGOTIATION: 75, WON: 100, LOST: 0 }[stageDb];
  const [row] = await db.update(deals).set({ stage: stageDb, probability, updatedAt: new Date() }).where(eq(deals.id, id)).returning();
  if (!row) return { ok: false, error: "Deal not found" };
  await logAudit({
    actorId: session?.userId,
    action: stage === "Won" ? "Closed won" : stage === "Lost" ? "Closed lost" : "Moved stage",
    entityType: "Deal",
    entity: row.name,
    severity: stage === "Lost" ? "WARNING" : "INFO",
  });
  if (row.ownerId && (stage === "Won" || stage === "Lost")) {
    await db.insert(notifications).values({
      category: "DEALS",
      title: stage === "Won" ? "Deal won \u{1F389}" : "Deal lost",
      description: `${row.name} was marked as ${stage.toLowerCase()}`,
      userId: row.ownerId,
    });
  }
  revalidatePath("/deals");
  return { ok: true };
}

export async function deleteDealAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  const row = await db.query.deals.findFirst({ where: eq(deals.id, id) });
  if (!row) return { ok: false, error: "Deal not found" };
  await db.delete(deals).where(eq(deals.id, id));
  await logAudit({ actorId: session?.userId, action: "Deleted", entityType: "Deal", entity: row.name, severity: "WARNING" });
  revalidatePath("/deals");
  return { ok: true };
}
