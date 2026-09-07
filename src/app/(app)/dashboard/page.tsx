"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarDays, SlidersHorizontal, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesFunnel } from "@/components/dashboard/sales-funnel";
import { RevenueDonut } from "@/components/dashboard/revenue-donut";
import { PipelineKanbanPreview } from "@/components/dashboard/pipeline-kanban-preview";
import { TopCustomersTable } from "@/components/dashboard/top-customers-table";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { kpis } from "@/lib/mock/data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, Alex</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="size-3.5" /> Feb 1 – Feb 28
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-3.5" /> Customize
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-3.5" /> Export
          </Button>
          <Button variant="outline" size="icon" aria-label="Refresh">
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
      </motion.div>

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <SalesFunnel />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueDonut />
        <TopCustomersTable />
      </div>

      <PipelineKanbanPreview />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActivityFeed />
      </div>
    </div>
  );
}
