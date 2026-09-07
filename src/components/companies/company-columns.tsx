"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { selectColumn } from "@/components/tables/data-table";
import type { Company } from "@/lib/mock/data";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

export const companyColumns: ColumnDef<Company>[] = [
  selectColumn<Company>(),
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
    cell: ({ row }) => (
      <Link href={`/companies/${row.original.id}`} className="group flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Building2 className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium group-hover:text-primary">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.website}</p>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "industry",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Industry" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.industry}</span>,
  },
  {
    accessorKey: "employees",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employees" />,
    cell: ({ row }) => <span className="text-sm">{formatCompactNumber(row.original.employees)}</span>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "openDeals",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Open deals" />,
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total revenue" />,
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.totalRevenue)}</span>,
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
            <Link href={`/companies/${row.original.id}`}><ArrowUpRight className="size-3.5" /> View company</Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableHiding: false,
  },
];
