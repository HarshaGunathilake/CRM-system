"use server";

import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";
import type { AuditLogEntry } from "@/lib/mock/data";

type AuditRow = typeof auditLogs.$inferSelect;

function toUiAuditLog(row: AuditRow & { actorName?: string | null; actorEmail?: string | null }): AuditLogEntry {
  return {
    id: row.id,
    actor: row.actorName ?? "System",
    actorEmail: row.actorEmail ?? "system@crmapp.io",
    action: row.action,
    entityType: row.entityType,
    entity: row.entity,
    timestamp: row.createdAt,
    ip: row.ip ?? "—",
    severity: row.severity.toLowerCase() as AuditLogEntry["severity"],
  };
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  const rows = await db.query.auditLogs.findMany({
    orderBy: [desc(auditLogs.createdAt)],
    with: { actor: true },
    limit: 500,
  });
  return rows.map((r) => toUiAuditLog({ ...r, actorName: r.actor?.name, actorEmail: r.actor?.email }));
}
