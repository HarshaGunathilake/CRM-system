"use client";

import * as React from "react";
import { toast } from "sonner";
import { Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { WorkflowNode, AddNodeButton, FlowConnector, type NodeData } from "@/components/workflows/workflow-node";

const TRIGGERS = ["Lead created", "Deal stage changed", "Task overdue", "Email received", "Form submitted"];
const CONDITIONS = ["Lead score > 70", "Deal value > $50,000", "Company employees > 100", "Source is Referral"];
const ACTIONS = ["Assign to Sales Team", "Create follow-up task", "Send email", "Add tag", "Notify Slack channel", "Update deal stage"];

let idCounter = 0;
const nextId = () => `node_${++idCounter}_${Date.now()}`;

export function WorkflowBuilder({ initialName = "Untitled workflow" }: { initialName?: string }) {
  const [name, setName] = React.useState(initialName);
  const [when, setWhen] = React.useState<NodeData>({ id: nextId(), kind: "when", label: "Trigger — starts the workflow", value: TRIGGERS[0], options: TRIGGERS });
  const [conditions, setConditions] = React.useState<NodeData[]>([
    { id: nextId(), kind: "if", label: "Condition — must be true to continue", value: CONDITIONS[0], options: CONDITIONS },
  ]);
  const [actions, setActions] = React.useState<NodeData[]>([
    { id: nextId(), kind: "then", label: "Action — runs when conditions match", value: ACTIONS[0], options: ACTIONS },
  ]);

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 max-w-xs font-medium" />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Test run started", { description: "Using the last 10 matching records." })}>
            <Play className="size-3.5" /> Test run
          </Button>
          <Button size="sm" onClick={() => toast.success("Workflow saved", { description: name })}>
            <Save className="size-3.5" /> Save workflow
          </Button>
        </div>
      </Card>

      <div className="flex flex-col items-center gap-0 rounded-xl border border-dashed border-border bg-muted/20 p-8">
        <WorkflowNode node={when} onChange={(v) => setWhen((n) => ({ ...n, value: v }))} />

        {conditions.map((c) => (
          <React.Fragment key={c.id}>
            <FlowConnector />
            <WorkflowNode
              node={c}
              removable={conditions.length > 1}
              onChange={(v) => setConditions((prev) => prev.map((x) => (x.id === c.id ? { ...x, value: v } : x)))}
              onRemove={() => setConditions((prev) => prev.filter((x) => x.id !== c.id))}
            />
          </React.Fragment>
        ))}
        <FlowConnector />
        <AddNodeButton
          label="Add condition"
          onClick={() => setConditions((prev) => [...prev, { id: nextId(), kind: "if", label: "Condition — must be true to continue", value: CONDITIONS[0], options: CONDITIONS }])}
        />

        {actions.map((a) => (
          <React.Fragment key={a.id}>
            <FlowConnector />
            <WorkflowNode
              node={a}
              removable={actions.length > 1}
              onChange={(v) => setActions((prev) => prev.map((x) => (x.id === a.id ? { ...x, value: v } : x)))}
              onRemove={() => setActions((prev) => prev.filter((x) => x.id !== a.id))}
            />
          </React.Fragment>
        ))}
        <FlowConnector />
        <AddNodeButton
          label="Add action"
          onClick={() => setActions((prev) => [...prev, { id: nextId(), kind: "then", label: "Action — runs when conditions match", value: ACTIONS[0], options: ACTIONS }])}
        />
      </div>
    </div>
  );
}
