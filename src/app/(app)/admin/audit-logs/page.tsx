import { AuditLogsPageClient } from "@/components/audit/audit-logs-page-client";
import { getAuditLogs } from "@/lib/actions/audit";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const auditLogs = await getAuditLogs();
  return <AuditLogsPageClient auditLogs={auditLogs} />;
}
