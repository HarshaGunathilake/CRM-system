"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import type { AuditLogEntry } from "@/lib/mock/data";
import { initials } from "@/lib/utils";
import { format } from "date-fns";

const SEVERITY_VARIANT: Record<AuditLogEntry["severity"], "default" | "warning" | "destructive"> = {
  info: "default",
  warning: "warning",
  critical: "destructive",
};

export const auditColumns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "actor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actor" />,
    cell: ({ row }) => {
      const log = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px]">{log.actor === "System" ? "SY" : initials(log.actor)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{log.actor}</p>
            <p className="truncate text-xs text-muted-foreground">{log.actorEmail}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.action}</span>,
  },
  {
    accessorKey: "entityType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Entity Type" />,
    cell: ({ row }) => <Badge variant="secondary">{row.original.entityType}</Badge>,
  },
  {
    accessorKey: "entity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Entity" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.entity}</span>,
  },
  {
    accessorKey: "severity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Severity" />,
    cell: ({ row }) => {
      const s = row.original.severity;
      return <Badge variant={SEVERITY_VARIANT[s]} className="capitalize">{s}</Badge>;
    },
  },
  {
    accessorKey: "ip",
    header: ({ column }) => <DataTableColumnHeader column={column} title="IP Address" />,
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.ip}</span>,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Timestamp" />,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(row.original.timestamp, "MMM d, yyyy 'at' h:mm a")}
      </span>
    ),
  },
];
