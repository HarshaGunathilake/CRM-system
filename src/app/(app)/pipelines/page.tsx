"use client";

import * as React from "react";
import { motion, Reorder } from "framer-motion";
import { Plus, GripVertical, Pencil, Trash2, Check, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Stage {
  id: string;
  name: string;
  probability: number;
  color: string;
}

const COLORS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "success", "warning", "destructive"];

const PIPELINES: Record<string, Stage[]> = {
  "Enterprise Sales": [
    { id: "s1", name: "New Lead", probability: 10, color: "chart-3" },
    { id: "s2", name: "Qualified", probability: 30, color: "chart-1" },
    { id: "s3", name: "Proposal", probability: 55, color: "chart-4" },
    { id: "s4", name: "Negotiation", probability: 75, color: "warning" },
    { id: "s5", name: "Won", probability: 100, color: "success" },
    { id: "s6", name: "Lost", probability: 0, color: "destructive" },
  ],
  "SMB Sales": [
    { id: "s1", name: "Inbound", probability: 15, color: "chart-3" },
    { id: "s2", name: "Demo", probability: 40, color: "chart-1" },
    { id: "s3", name: "Trial", probability: 65, color: "chart-4" },
    { id: "s4", name: "Won", probability: 100, color: "success" },
    { id: "s5", name: "Lost", probability: 0, color: "destructive" },
  ],
  Partnerships: [
    { id: "s1", name: "Introduced", probability: 20, color: "chart-3" },
    { id: "s2", name: "Evaluating", probability: 50, color: "chart-4" },
    { id: "s3", name: "Signed", probability: 100, color: "success" },
  ],
};

export default function PipelinesPage() {
  const [active, setActive] = React.useState("Enterprise Sales");
  const [pipelines, setPipelines] = React.useState(PIPELINES);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftName, setDraftName] = React.useState("");

  const stages = pipelines[active];
  const setStages = (updater: (s: Stage[]) => Stage[]) =>
    setPipelines((prev) => ({ ...prev, [active]: updater(prev[active]) }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pipelines"
        description="Configure your sales pipelines and stage probabilities."
        actions={<Button size="sm"><Plus className="size-3.5" /> New pipeline</Button>}
      />

      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {Object.keys(pipelines).map((p) => (
            <TabsTrigger key={p} value={p}>{p}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stages</CardTitle>
          <CardDescription>Drag to reorder · click a stage to rename it</CardDescription>
        </CardHeader>
        <CardContent>
          <Reorder.Group axis="y" values={stages} onReorder={(v) => setStages(() => v)} className="flex flex-col gap-2">
            {stages.map((stage) => (
              <Reorder.Item key={stage.id} value={stage} as="div">
                <motion.div
                  layout
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
                  <span className={`size-2.5 shrink-0 rounded-full bg-${stage.color}`} style={{ background: `hsl(var(--${stage.color}))` }} />

                  {editingId === stage.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        autoFocus
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="h-8"
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => {
                          setStages((s) => s.map((x) => (x.id === stage.id ? { ...x, name: draftName } : x)));
                          setEditingId(null);
                        }}
                      >
                        <Check className="size-3.5" />
                      </Button>
                      <Button size="icon-sm" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="flex-1 text-sm font-medium">{stage.name}</span>
                  )}

                  <Badge variant="outline" className="shrink-0">{stage.probability}% probability</Badge>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => { setEditingId(stage.id); setDraftName(stage.name); }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => setStages((s) => s.filter((x) => x.id !== stage.id))}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() =>
              setStages((s) => [
                ...s,
                { id: `s${Date.now()}`, name: "New Stage", probability: 50, color: COLORS[s.length % COLORS.length] },
              ])
            }
          >
            <Plus className="size-3.5" /> Add stage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
