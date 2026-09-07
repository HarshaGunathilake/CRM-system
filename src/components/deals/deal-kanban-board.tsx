"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { deals as allDeals, type DealStage } from "@/lib/mock/data";
import { cn, formatCurrency, initials } from "@/lib/utils";

const STAGES: DealStage[] = ["New Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

const STAGE_HEADER: Record<DealStage, string> = {
  "New Lead": "border-t-chart-3", Qualified: "border-t-chart-1", Proposal: "border-t-chart-4",
  Negotiation: "border-t-warning", Won: "border-t-success", Lost: "border-t-destructive",
};

const PRIORITY_DOT: Record<string, string> = {
  Low: "bg-muted-foreground", Medium: "bg-chart-4", High: "bg-warning", Urgent: "bg-destructive",
};

export function DealKanbanBoard() {
  const [dragged, setDragged] = React.useState<string | null>(null);
  const [stageMap, setStageMap] = React.useState(() => {
    const map: Record<string, DealStage> = {};
    allDeals.forEach((d) => (map[d.id] = d.stage));
    return map;
  });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {STAGES.map((stage) => {
        const stageDeals = allDeals.filter((d) => stageMap[d.id] === stage);
        const total = stageDeals.reduce((a, d) => a + d.value, 0);
        return (
          <div
            key={stage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragged) setStageMap((m) => ({ ...m, [dragged]: stage }));
              setDragged(null);
            }}
            className={cn("flex min-w-[240px] flex-col gap-2 rounded-lg border-t-2 bg-muted/40 p-2", STAGE_HEADER[stage])}
          >
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-xs font-semibold">{stage}</span>
              <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">{stageDeals.length}</span>
            </div>
            <p className="px-1 text-[11px] text-muted-foreground">{formatCurrency(total, true)}</p>
            <div className="flex max-h-[560px] flex-col gap-2 overflow-y-auto scrollbar-thin pr-0.5">
              {stageDeals.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  draggable
                  onDragStart={() => setDragged(d.id)}
                  whileHover={{ y: -2 }}
                  className="cursor-grab rounded-lg border border-border bg-card p-2.5 shadow-sm active:cursor-grabbing"
                >
                  <div className="mb-1.5 flex items-start justify-between gap-1">
                    <Link href={`/deals/${d.id}`} className="min-w-0 text-xs font-medium leading-tight hover:text-primary">
                      {d.companyName}
                    </Link>
                    <MoreHorizontal className="size-3.5 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(d.value, true)}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{d.contactName}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className={cn("size-1.5 rounded-full", PRIORITY_DOT[d.priority])} />
                      <span className="text-[10px] text-muted-foreground">{d.probability}%</span>
                    </div>
                    <Avatar className="size-5"><AvatarFallback className="text-[9px]">{initials(d.owner)}</AvatarFallback></Avatar>
                  </div>
                </motion.div>
              ))}
              {stageDeals.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
