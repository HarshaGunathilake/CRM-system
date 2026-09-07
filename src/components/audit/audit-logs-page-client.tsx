"use client";

import * as React from "react";
import { ScrollText, ShieldAlert, Download, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/tables/data-table";
import { auditColumns } from "@/components/audit/audit-columns";
import type { AuditLogEntry } from "@/lib/mock/data";
import { toast } from "sonner";

export function AuditLogsPageClient({ auditLogs }: { auditLogs: AuditLogEntry[] }) {
  const ENTITY_TYPES = React.useMemo(() => Array.from(new Set(auditLogs.map((l) => l.entityType))).sort(), [auditLogs]);
  const [entityFilter, setEntityFilter] = React.useState<string>("all");
  const [severityFilter, setSeverityFilter] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return auditLogs.filter((l) => {
      if (entityFilter !== "all" && l.entityType !== entityFilter) return false;
      if (severityFilter !== "all" && l.severity !== severityFilter) return false;
      return true;
    });
  }, [entityFilter, severityFilter]);

  const criticalCount = auditLogs.filter((l) => l.severity === "critical").length;
  const warningCount = auditLogs.filter((l) => l.severity === "warning").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit Logs"
        description="Track every action taken across your workspace for security and compliance."
        actions={
          <Button variant="outline" onClick={() => toast.success("Export started", { description: "Your audit log export will be ready shortly." })}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ScrollText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{auditLogs.length}</p>
            <p className="text-xs text-muted-foreground">Total events (90 days)</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{warningCount}</p>
            <p className="text-xs text-muted-foreground">Warning events</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical events</p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entity types</SelectItem>
              {ENTITY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable columns={auditColumns} data={filtered} searchKey="actor" searchPlaceholder="Search by actor..." />
      </Card>
    </div>
  );
}
