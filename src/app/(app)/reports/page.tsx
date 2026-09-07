"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, DollarSign, GitBranch, UserPlus, Award, Activity, Timer,
  ArrowLeft, Download, FileText, Star, ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportAreaChart, ReportBarChart, ReportLineChart } from "@/components/reports/report-chart";
import { toast } from "sonner";
import {
  revenueSeries, salesFunnel, repPerformance, dealVelocity, customerGrowth,
  activityPerformance, leadConversionSeries,
} from "@/lib/mock/data";

interface ReportDef {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const REPORTS: ReportDef[] = [
  { id: "sales-performance", name: "Sales Performance", description: "Revenue and deals won over time", icon: TrendingUp },
  { id: "lead-conversion", name: "Lead Conversion", description: "Lead-to-customer conversion rate trend", icon: UserPlus },
  { id: "revenue", name: "Revenue", description: "Revenue and pipeline value over time", icon: DollarSign },
  { id: "pipeline", name: "Pipeline", description: "Funnel conversion by stage", icon: GitBranch },
  { id: "customer-growth", name: "Customer Growth", description: "New vs. churned customers by month", icon: Users },
  { id: "rep-performance", name: "Sales Rep Performance", description: "Revenue and deals by owner", icon: Award },
  { id: "activity-performance", name: "Activity Performance", description: "Calls, emails, and meetings logged", icon: Activity },
  { id: "deal-velocity", name: "Deal Velocity", description: "Average days spent per stage", icon: Timer },
];

const SAVED_REPORTS = ["Q3 Enterprise Pipeline", "Weekly Rep Scorecard", "Churn Watchlist"];

export default function ReportsPage() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [range, setRange] = React.useState("30D");
  const active = REPORTS.find((r) => r.id === activeId);

  const exportReport = () => toast.success("Export started", { description: "You'll get a download link shortly." });

  if (active) {
    return (
      <div className="flex flex-col gap-6">
        <button onClick={() => setActiveId(null)} className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to reports
        </button>
        <PageHeader
          title={active.name}
          description={active.description}
          actions={
            <>
              <Tabs value={range} onValueChange={setRange}>
                <TabsList>
                  {["7D", "30D", "90D", "12M"].map((r) => <TabsTrigger key={r} value={r} className="text-xs">{r}</TabsTrigger>)}
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" onClick={exportReport}><Download className="size-3.5" /> Export</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">Compare <ChevronDown className="size-3.5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Previous period</DropdownMenuItem>
                  <DropdownMenuItem>Same period last year</DropdownMenuItem>
                  <DropdownMenuItem>No comparison</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          }
        />
        <Card>
          <CardHeader><CardTitle className="text-base">{active.name}</CardTitle></CardHeader>
          <CardContent className="h-[380px]">
            <ReportBody id={active.id} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Deep-dive analytics across sales, leads, and activity."
        actions={<Button variant="outline" size="sm"><FileText className="size-3.5" /> Create custom report</Button>}
      />

      {SAVED_REPORTS.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Saved reports</p>
          <div className="flex flex-wrap gap-2">
            {SAVED_REPORTS.map((r) => (
              <button key={r} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent/50">
                <Star className="size-3 fill-warning text-warning" /> {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REPORTS.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <button onClick={() => setActiveId(r.id)} className="w-full text-left">
              <Card className="flex h-full flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.description}</p>
                </div>
              </Card>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReportBody({ id }: { id: string }) {
  switch (id) {
    case "sales-performance":
      return <ReportAreaChart data={revenueSeries.map((d) => ({ label: d.date, revenue: d.revenue }))} dataKey="revenue" />;
    case "revenue":
      return <ReportAreaChart data={revenueSeries.map((d) => ({ label: d.date, revenue: d.revenue, pipeline: d.pipeline }))} dataKey="revenue" compareKey="pipeline" />;
    case "lead-conversion":
      return <ReportLineChart data={leadConversionSeries} lines={[{ key: "rate", color: "hsl(var(--chart-1))" }]} />;
    case "pipeline":
      return <ReportBarChart data={salesFunnel.map((s) => ({ label: s.stage, value: s.value }))} dataKey="value" />;
    case "customer-growth":
      return <ReportBarChart data={customerGrowth} dataKey="new" />;
    case "rep-performance":
      return <ReportBarChart data={repPerformance} dataKey="revenue" />;
    case "activity-performance":
      return <ReportLineChart data={activityPerformance} lines={[
        { key: "calls", color: "hsl(var(--chart-2))" },
        { key: "emails", color: "hsl(var(--chart-5))" },
        { key: "meetings", color: "hsl(var(--chart-1))" },
      ]} />;
    case "deal-velocity":
      return <ReportBarChart data={dealVelocity} dataKey="days" />;
    default:
      return null;
  }
}
