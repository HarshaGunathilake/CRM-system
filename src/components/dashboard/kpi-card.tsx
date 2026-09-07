"use client";

import * as React from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Handshake, TrendingUp, Percent, Users, Gem } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  revenue: DollarSign,
  deals: Handshake,
  pipeline: TrendingUp,
  conversion: Percent,
  customers: Users,
  clv: Gem,
};

function CountUp({ value, format }: { value: number; format: "currency" | "number" | "percent" }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    const controls = animate(mv, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (format === "currency") setDisplay(formatCurrency(v, true));
        else if (format === "percent") setDisplay(`${v.toFixed(1)}%`);
        else setDisplay(Math.round(v).toLocaleString());
      },
    });
    return () => controls.stop();
  }, [value, format, mv]);

  return <span>{display}</span>;
}

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  const w = 88;
  const h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke={positive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}

export function KpiCard({
  kpiKey,
  label,
  value,
  format,
  change,
  spark,
  index,
}: {
  kpiKey: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  change: number;
  spark: number[];
  index: number;
}) {
  const Icon = ICONS[kpiKey] ?? TrendingUp;
  const positive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="group cursor-default p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Icon className="size-4" />
              </span>
              <Sparkline points={spark} positive={positive} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                <CountUp value={value} format={format} />
              </p>
              <div
                className={cn(
                  "mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium",
                  positive ? "text-success" : "text-destructive"
                )}
              >
                {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {formatPercent(change)}
                <span className="ml-1 font-normal text-muted-foreground">vs last period</span>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>Compared to the previous 30-day period</TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
