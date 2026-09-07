"use server";

import { z } from "zod";
import { desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { contacts, companies } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import type { Contact } from "@/lib/mock/data";
import type { ActionResult } from "./leads";

type ContactRow = typeof contacts.$inferSelect;

const STATUS_FROM_DB: Record<string, Contact["status"]> = {
  ACTIVE: "Active", INACTIVE: "Inactive", LEAD: "Lead",
};

function toUiContact(row: ContactRow & { ownerName?: string | null; companyName?: string | null }): Contact {
  return {
    id: row.id,
    name: row.name,
    avatarSeed: row.name.length,
    jobTitle: row.jobTitle,
    companyId: row.companyId ?? "",
    companyName: row.companyName ?? "Unknown",
    email: row.email,
    phone: row.phone,
    location: row.location,
    owner: row.ownerName ?? "Unassigned",
    status: STATUS_FROM_DB[row.status] ?? "Active",
    lastActivity: row.lastActivity,
    tags: row.tags,
  };
}

export async function getContactById(id: string): Promise<Contact | null> {
  const row = await db.query.contacts.findFirst({
    where: eq(contacts.id, id),
    with: { owner: true, company: true },
  });
  if (!row) return null;
  return toUiContact({ ...row, ownerName: row.owner?.name, companyName: row.company?.name });
}

export async function getContacts(): Promise<Contact[]> {
  const rows = await db.query.contacts.findMany({
    orderBy: [desc(contacts.createdAt)],
    with: { owner: true, company: true },
  });
  return rows.map((r) => toUiContact({ ...r, ownerName: r.owner?.name, companyName: r.company?.name }));
}

const createContactSchema = z.object({
  name: z.string().min(2),
  jobTitle: z.string().optional(),
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export async function createContactAction(input: z.infer<typeof createContactSchema>): Promise<ActionResult> {
  const parsed = createContactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const session = await getSession();
  const { name, jobTitle, companyName, email, phone, location } = parsed.data;

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

  const [row] = await db
    .insert(contacts)
    .values({
      name,
      jobTitle: jobTitle || "Unknown",
      email,
      phone: phone || "",
      location: location || "Unknown",
      companyId: company.id,
      ownerId: session?.userId,
    })
    .returning();

  await logAudit({ actorId: session?.userId, action: "Created", entityType: "Contact", entity: row.name });
  revalidatePath("/contacts");
  return { ok: true };
}

export async function deleteContactAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  const row = await db.query.contacts.findFirst({ where: eq(contacts.id, id) });
  if (!row) return { ok: false, error: "Contact not found" };
  await db.delete(contacts).where(eq(contacts.id, id));
  await logAudit({ actorId: session?.userId, action: "Deleted", entityType: "Contact", entity: row.name, severity: "WARNING" });
  revalidatePath("/contacts");
  return { ok: true };
}
