"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/tables/data-table";
import { dealColumns } from "@/components/deals/deal-columns";
import { DealKanbanBoard } from "@/components/deals/deal-kanban-board";
import { DealForecast } from "@/components/deals/deal-forecast";
import { useDrawer } from "@/components/providers/drawer-provider";
import type { Deal } from "@/lib/mock/data";

export function DealsPageClient({ deals }: { deals: Deal[] }) {
  const { openDrawer } = useDrawer();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Deals"
        description={`${deals.length} deals in your pipeline`}
        actions={<Button size="sm" onClick={() => openDrawer("deal")}><Plus className="size-3.5" /> New deal</Button>}
      />

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <DataTable columns={dealColumns} data={deals} searchKey="name" searchPlaceholder="Search deals..." />
        </TabsContent>
        <TabsContent value="kanban"><DealKanbanBoard /></TabsContent>
        <TabsContent value="forecast"><DealForecast /></TabsContent>
      </Tabs>
    </div>
  );
}
