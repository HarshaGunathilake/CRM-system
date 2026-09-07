"use client";

import * as React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { revenueSeries } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils";

const RANGES = ["7D", "30D", "90D", "12M"] as const;

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { dataKey: string; name: string; value: number; color: string }[];
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-medium text-foreground">{formatCurrency(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const [range, setRange] = React.useState<(typeof RANGES)[number]>("30D");
  const data = range === "7D" ? revenueSeries.slice(-7) : revenueSeries;

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">Revenue & Pipeline Performance</CardTitle>
          <CardDescription>Track revenue and pipeline value over time</CardDescription>
        </div>
        <CardAction>
          <Tabs value={range} onValueChange={(v) => setRange(v as (typeof RANGES)[number])}>
            <TabsList>
              {RANGES.map((r) => (
                <TabsTrigger key={r} value={r} className="text-xs">
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent className="h-[320px] pl-0 pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => formatCurrency(v, true)}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="pipeline"
              name="Pipeline"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              fill="url(#pipelineFill)"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.25}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
