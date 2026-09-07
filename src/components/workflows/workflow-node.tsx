"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface NodeData {
  id: string;
  kind: "when" | "if" | "then";
  label: string;
  value: string;
  options: string[];
}

const KIND_STYLE: Record<NodeData["kind"], { badge: string; ring: string }> = {
  when: { badge: "bg-primary/15 text-primary", ring: "border-primary/30" },
  if: { badge: "bg-warning/15 text-warning", ring: "border-warning/30" },
  then: { badge: "bg-success/15 text-success", ring: "border-success/30" },
};

const KIND_LABEL: Record<NodeData["kind"], string> = { when: "WHEN", if: "IF", then: "THEN" };

export function WorkflowNode({
  node,
  onChange,
  onRemove,
  removable,
}: {
  node: NodeData;
  onChange: (value: string) => void;
  onRemove?: () => void;
  removable?: boolean;
}) {
  const style = KIND_STYLE[node.kind];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("w-full max-w-md rounded-xl border bg-card p-4 shadow-sm", style.ring)}
    >
      <div className="mb-2 flex items-center justify-between">
        <Badge className={style.badge}>{KIND_LABEL[node.kind]}</Badge>
        {removable && (
          <Button variant="ghost" size="icon-sm" onClick={onRemove}>
            <Trash2 className="size-3.5 text-muted-foreground" />
          </Button>
        )}
      </div>
      <p className="mb-2 text-xs text-muted-foreground">{node.label}</p>
      <Select value={node.value} onValueChange={onChange}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {node.options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}

export function AddNodeButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="mx-auto">
      <Plus className="size-3.5" /> {label}
    </Button>
  );
}

export function FlowConnector() {
  return <div className="mx-auto h-6 w-px bg-border" />;
}
