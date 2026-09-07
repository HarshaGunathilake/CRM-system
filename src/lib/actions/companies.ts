"use server";

import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { companies } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import type { Company } from "@/lib/mock/data";
import type { ActionResult } from "./leads";

type CompanyRow = typeof companies.$inferSelect;

function toUiCompany(row: CompanyRow & { ownerName?: string | null; openDeals?: number }): Company {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    employees: row.employees,
    annualRevenue: row.annualRevenue,
    location: row.location,
    website: row.website,
    owner: row.ownerName ?? "Unassigned",
    openDeals: row.openDeals ?? 0,
    totalRevenue: row.totalRevenue,
    logoLetter: row.logoLetter,
  };
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const row = await db.query.companies.findFirst({
    where: eq(companies.id, id),
    with: { owner: true, deals: true },
  });
  if (!row) return null;
  return toUiCompany({ ...row, ownerName: row.owner?.name, openDeals: row.deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST").length });
}

export async function getCompanies(): Promise<Company[]> {
  const rows = await db.query.companies.findMany({
    orderBy: [desc(companies.createdAt)],
    with: { owner: true, deals: true },
  });
  return rows.map((r) =>
    toUiCompany({ ...r, ownerName: r.owner?.name, openDeals: r.deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST").length })
  );
}

const createCompanySchema = z.object({
  name: z.string().min(2),
  industry: z.string().optional(),
  website: z.string().optional(),
  employees: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export async function createCompanyAction(input: z.infer<typeof createCompanySchema>): Promise<ActionResult> {
  const parsed = createCompanySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const session = await getSession();
  const { name, industry, website, employees, location } = parsed.data;

  const [row] = await db
    .insert(companies)
    .values({
      name,
      industry: industry || "Unknown",
      website: website || `www.${name.toLowerCase().replace(/\s+/g, "")}.com`,
      employees: employees ? Number(employees) || 0 : 0,
      location: location || "Unknown",
      logoLetter: name[0]?.toUpperCase() ?? "?",
      ownerId: session?.userId,
    })
    .returning();

  await logAudit({ actorId: session?.userId, action: "Created", entityType: "Company", entity: row.name });
  revalidatePath("/companies");
  return { ok: true };
}

export async function deleteCompanyAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  const row = await db.query.companies.findFirst({ where: eq(companies.id, id) });
  if (!row) return { ok: false, error: "Company not found" };
  await db.delete(companies).where(eq(companies.id, id));
  await logAudit({ actorId: session?.userId, action: "Deleted", entityType: "Company", entity: row.name, severity: "WARNING" });
  revalidatePath("/companies");
  return { ok: true };
}
