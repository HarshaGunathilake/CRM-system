"use client";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesFunnel } from "@/components/dashboard/sales-funnel";
import { RevenueDonut } from "@/components/dashboard/revenue-donut";
import { PipelineKanbanPreview } from "@/components/dashboard/pipeline-kanban-preview";
import { TopCustomersTable } from "@/components/dashboard/top-customers-table";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { kpis } from "@/lib/mock/data";

export interface WidgetDef {
  id: string;
  title: string;
  render: () => React.ReactNode;
}

export const WIDGETS: WidgetDef[] = [
  {
    id: "kpis",
    title: "KPI cards",
    render: () => (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((k, i) => (
          <KpiCard
            key={k.key}
            kpiKey={k.key}
            label={k.label}
            value={k.value}
            format={k.format as "currency" | "number" | "percent"}
            change={k.change}
            spark={k.spark}
            index={i}
          />
        ))}
      </div>
    ),
  },
  {
    id: "revenue-funnel",
    title: "Revenue chart & sales funnel",
    render: () => (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <SalesFunnel />
      </div>
    ),
  },
  {
    id: "donut-customers",
    title: "Revenue by source & top customers",
    render: () => (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueDonut />
        <TopCustomersTable />
      </div>
    ),
  },
  {
    id: "pipeline",
    title: "Deal pipeline",
    render: () => <PipelineKanbanPreview />,
  },
  {
    id: "activity",
    title: "Recent activity",
    render: () => (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityFeed />
      </div>
    ),
  },
];

export const DEFAULT_LAYOUT = WIDGETS.map((w) => ({ id: w.id, visible: true }));
