import "server-only";
import { db } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";

type Severity = "INFO" | "WARNING" | "CRITICAL";

export async function logAudit(entry: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entity: string;
  severity?: Severity;
  ip?: string | null;
}) {
  try {
    await db.insert(auditLogs).values({
      actorId: entry.actorId ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entity: entry.entity,
      severity: entry.severity ?? "INFO",
      ip: entry.ip ?? null,
    });
  } catch (err) {
    // Never let audit logging break the calling action.
    console.error("Failed to write audit log", err);
  }
}
