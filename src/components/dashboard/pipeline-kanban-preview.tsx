"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { deals as allDeals, type DealStage } from "@/lib/mock/data";
import { cn, formatCurrency, initials } from "@/lib/utils";

const STAGES: DealStage[] = ["New Lead", "Qualified", "Proposal", "Negotiation", "Won"];

const PRIORITY_DOT: Record<string, string> = {
  Low: "bg-muted-foreground",
  Medium: "bg-chart-4",
  High: "bg-warning",
  Urgent: "bg-destructive",
};

export function PipelineKanbanPreview() {
  const [dragged, setDragged] = React.useState<string | null>(null);
  const [stageMap, setStageMap] = React.useState(() => {
    const map: Record<string, DealStage> = {};
    allDeals.slice(0, 24).forEach((d) => (map[d.id] = d.stage === "Lost" ? "New Lead" : d.stage));
    return map;
  });
  const deals = allDeals.slice(0, 24);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-base">Deal Pipeline</CardTitle>
        <CardDescription>Drag cards between stages to update them</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 overflow-x-auto pb-1 sm:grid-cols-2 lg:grid-cols-5">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => stageMap[d.id] === stage);
            const total = stageDeals.reduce((a, d) => a + d.value, 0);
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragged) setStageMap((m) => ({ ...m, [dragged]: stage }));
                  setDragged(null);
                }}
                className="flex min-w-[220px] flex-col gap-2 rounded-lg bg-muted/40 p-2"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold">{stage}</span>
                  <span className="text-[11px] text-muted-foreground">{formatCurrency(total, true)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {stageDeals.slice(0, 4).map((d) => (
                    <motion.div
                      key={d.id}
                      layout
                      draggable
                      onDragStart={() => setDragged(d.id)}
                      whileHover={{ y: -2 }}
                      className="cursor-grab rounded-lg border border-border bg-card p-2.5 shadow-sm active:cursor-grabbing"
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-1">
                        <p className="text-xs font-medium leading-tight">{d.companyName}</p>
                        <MoreHorizontal className="size-3.5 shrink-0 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(d.value, true)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className={cn("size-1.5 rounded-full", PRIORITY_DOT[d.priority])} />
                          <span className="text-[10px] text-muted-foreground">{d.probability}%</span>
                        </div>
                        <Avatar className="size-5">
                          <AvatarFallback className="text-[9px]">{initials(d.owner)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </motion.div>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
