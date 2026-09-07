"use client";

import * as React from "react";
import { Search, Download, SlidersHorizontal, MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { topCustomers } from "@/lib/mock/data";
import { formatCurrency, initials } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive"> = {
  Active: "success",
  "At Risk": "warning",
  Churned: "destructive",
};

export function TopCustomersTable() {
  const [query, setQuery] = React.useState("");
  const filtered = topCustomers.filter(
    (c) =>
      c.customer.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Top Customers</CardTitle>
          <CardDescription>Your highest-value accounts this period</CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-8 w-40 pl-8 text-xs"
            />
          </div>
          <Button variant="outline" size="icon-sm">
            <SlidersHorizontal className="size-3.5" />
          </Button>
          <Button variant="outline" size="icon-sm">
            <Download className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, 8).map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">{initials(c.customer)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{c.customer}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.company}</TableCell>
                <TableCell className="text-sm font-medium">{formatCurrency(c.revenue)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.deals}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[c.status] ?? "muted"}>{c.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
