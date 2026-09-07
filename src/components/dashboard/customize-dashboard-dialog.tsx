"use client";

import * as React from "react";
import { Reorder } from "framer-motion";
import { GripVertical, RotateCcw } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WIDGETS, DEFAULT_LAYOUT } from "@/components/dashboard/widget-registry";

export interface LayoutItem { id: string; visible: boolean }

export function CustomizeDashboardDialog({
  open,
  onOpenChange,
  layout,
  onLayoutChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  layout: LayoutItem[];
  onLayoutChange: (l: LayoutItem[]) => void;
}) {
  const [draft, setDraft] = React.useState<LayoutItem[]>(layout);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setDraft(layout);
  }, [open, layout]);

  const titleFor = (id: string) => WIDGETS.find((w) => w.id === id)?.title ?? id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize dashboard</DialogTitle>
          <DialogDescription>Drag to reorder, toggle to show or hide a section.</DialogDescription>
        </DialogHeader>
        <Reorder.Group axis="y" values={draft} onReorder={setDraft} className="flex flex-col gap-2">
          {draft.map((item) => (
            <Reorder.Item key={item.id} value={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
              <span className="flex-1 text-sm">{titleFor(item.id)}</span>
              <Switch
                checked={item.visible}
                onCheckedChange={(v) => setDraft((prev) => prev.map((x) => (x.id === item.id ? { ...x, visible: v } : x)))}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <DialogFooter className="items-center justify-between sm:justify-between">
          <Button variant="ghost" size="sm" onClick={() => setDraft(DEFAULT_LAYOUT)}>
            <RotateCcw className="size-3.5" /> Reset to default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => { onLayoutChange(draft); onOpenChange(false); }}>Save layout</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
