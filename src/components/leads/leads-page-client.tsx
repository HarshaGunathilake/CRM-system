"use client";

import { Plus, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { leadColumns } from "@/components/leads/lead-columns";
import { useDrawer } from "@/components/providers/drawer-provider";
import { Card } from "@/components/ui/card";
import type { Lead } from "@/lib/mock/data";

export function LeadsPageClient({ leads }: { leads: Lead[] }) {
  const { openDrawer } = useDrawer();
  const byStatus = (s: string) => leads.filter((l) => l.status === s).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Leads"
        description="Track and qualify incoming leads before they become deals."
        actions={
          <>
            <Button variant="outline" size="sm"><Upload className="size-3.5" /> Import</Button>
            <Button size="sm" onClick={() => openDrawer("lead")}><Plus className="size-3.5" /> New lead</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Converted", "Lost"].map((s) => (
          <Card key={s} className="p-3">
            <p className="text-xs text-muted-foreground">{s}</p>
            <p className="mt-1 text-lg font-semibold">{byStatus(s)}</p>
          </Card>
        ))}
      </div>

      <DataTable columns={leadColumns} data={leads} searchKey="name" searchPlaceholder="Search leads..." />
    </div>
  );
}
