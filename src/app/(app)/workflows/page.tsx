"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Zap, Play, Pause, ArrowLeft, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkflowBuilder } from "@/components/workflows/workflow-builder";

interface SavedWorkflow {
  id: string;
  name: string;
  trigger: string;
  actionsCount: number;
  active: boolean;
  runsThisMonth: number;
}

const SEED_WORKFLOWS: SavedWorkflow[] = [
  { id: "wf1", name: "New Lead → Auto Assign", trigger: "Lead created", actionsCount: 3, active: true, runsThisMonth: 142 },
  { id: "wf2", name: "High-Value Deal Alert", trigger: "Deal stage changed", actionsCount: 2, active: true, runsThisMonth: 38 },
  { id: "wf3", name: "Overdue Task Reminder", trigger: "Task overdue", actionsCount: 1, active: false, runsThisMonth: 0 },
  { id: "wf4", name: "Trade Show Follow-up", trigger: "Lead created", actionsCount: 4, active: true, runsThisMonth: 21 },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = React.useState(SEED_WORKFLOWS);
  const [view, setView] = React.useState<{ mode: "list" } | { mode: "builder"; name?: string }>({ mode: "list" });

  if (view.mode === "builder") {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => setView({ mode: "list" })}
          className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to workflows
        </button>
        <WorkflowBuilder initialName={view.name ?? "Untitled workflow"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Workflows"
        description="Automate repetitive work with trigger-based rules."
        actions={<Button size="sm" onClick={() => setView({ mode: "builder" })}><Plus className="size-3.5" /> New workflow</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workflows.map((wf, i) => (
          <motion.div key={wf.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="size-4" />
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-3.5" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setView({ mode: "builder", name: wf.name })}>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setWorkflows((prev) => prev.filter((w) => w.id !== wf.id))}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <button onClick={() => setView({ mode: "builder", name: wf.name })} className="text-left text-sm font-semibold hover:text-primary">
                  {wf.name}
                </button>
                <p className="text-xs text-muted-foreground">WHEN {wf.trigger} · {wf.actionsCount} action{wf.actionsCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={wf.active ? "success" : "muted"}>
                  {wf.active ? <Play className="size-3" /> : <Pause className="size-3" />}
                  {wf.active ? "Active" : "Paused"}
                </Badge>
                <span className="text-xs text-muted-foreground">{wf.runsThisMonth} runs this month</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Enabled</span>
                <Switch
                  checked={wf.active}
                  onCheckedChange={(v) => setWorkflows((prev) => prev.map((w) => (w.id === wf.id ? { ...w, active: v } : w)))}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
