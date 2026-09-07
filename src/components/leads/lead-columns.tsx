"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { selectColumn } from "@/components/tables/data-table";
import type { Lead } from "@/lib/mock/data";
import { formatCurrency, initials } from "@/lib/utils";

const STATUS_VARIANT: Record<Lead["status"], "default" | "secondary" | "success" | "warning" | "destructive" | "muted"> = {
  New: "secondary",
  Contacted: "default",
  Qualified: "default",
  Proposal: "warning",
  Negotiation: "warning",
  Converted: "success",
  Lost: "destructive",
};

export const leadColumns: ColumnDef<Lead>[] = [
  selectColumn<Lead>(),
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lead" />,
    cell: ({ row }) => (
      <Link href={`/leads/${row.original.id}`} className="group flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarFallback className="text-[10px]">{initials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium group-hover:text-primary">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.companyName}</p>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
  },
  {
    accessorKey: "score",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
    cell: ({ row }) => {
      const score = row.original.score;
      const color = score >= 70 ? "text-success" : score >= 40 ? "text-warning" : "text-destructive";
      return <span className={`text-sm font-semibold ${color}`}>{score}</span>;
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.source}</span>,
  },
  {
    accessorKey: "estValue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Est. value" />,
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.estValue)}</span>,
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.owner}</span>,
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
            <Link href={`/leads/${row.original.id}`}><ArrowUpRight className="size-3.5" /> View lead</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Convert to deal</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Mark as lost</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableHiding: false,
  },
];
