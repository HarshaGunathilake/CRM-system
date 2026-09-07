"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { selectColumn } from "@/components/tables/data-table";
import type { Deal } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils";

const STAGE_VARIANT: Record<Deal["stage"], "secondary" | "default" | "warning" | "success" | "destructive"> = {
  "New Lead": "secondary", Qualified: "default", Proposal: "default",
  Negotiation: "warning", Won: "success", Lost: "destructive",
};
const PRIORITY_VARIANT: Record<Deal["priority"], "muted" | "default" | "warning" | "destructive"> = {
  Low: "muted", Medium: "default", High: "warning", Urgent: "destructive",
};

export const dealColumns: ColumnDef<Deal>[] = [
  selectColumn<Deal>(),
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deal" />,
    cell: ({ row }) => (
      <Link href={`/deals/${row.original.id}`} className="group">
        <p className="max-w-52 truncate text-sm font-medium group-hover:text-primary">{row.original.name}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.contactName}</p>
      </Link>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
    cell: ({ row }) => <span className="text-sm font-semibold">{formatCurrency(row.original.value)}</span>,
  },
  {
    accessorKey: "stage",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stage" />,
    cell: ({ row }) => <Badge variant={STAGE_VARIANT[row.original.stage]}>{row.original.stage}</Badge>,
  },
  {
    accessorKey: "probability",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Probability" />,
    cell: ({ row }) => (
      <div className="flex w-28 items-center gap-2">
        <Progress value={row.original.probability} className="h-1.5" />
        <span className="w-8 shrink-0 text-xs text-muted-foreground">{row.original.probability}%</span>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => <Badge variant={PRIORITY_VARIANT[row.original.priority]}>{row.original.priority}</Badge>,
  },
  {
    accessorKey: "expectedClose",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expected close" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.expectedClose.toLocaleDateString()}</span>,
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-3.5" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/deals/${row.original.id}`}><ArrowUpRight className="size-3.5" /> View deal</Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Mark as lost</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableHiding: false,
  },
];
