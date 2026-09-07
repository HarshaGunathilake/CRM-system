"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TaskItem } from "@/lib/mock/data";
import { initials } from "@/lib/utils";

const STATUSES: TaskItem["status"][] = ["Todo", "In Progress", "Waiting", "Completed"];
const PRIORITY_VARIANT: Record<string, "muted" | "default" | "warning" | "destructive"> = {
  Low: "muted", Medium: "default", High: "warning", Urgent: "destructive",
};

export function TaskKanban({ tasks }: { tasks: TaskItem[] }) {
  const [dragged, setDragged] = React.useState<string | null>(null);
  const [statusMap, setStatusMap] = React.useState(() => {
    const map: Record<string, TaskItem["status"]> = {};
    tasks.forEach((t) => (map[t.id] = t.status));
    return map;
  });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STATUSES.map((status) => {
        const items = tasks.filter((t) => statusMap[t.id] === status);
        return (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragged) setStatusMap((m) => ({ ...m, [dragged]: status }));
              setDragged(null);
            }}
            className="flex min-w-[220px] flex-col gap-2 rounded-lg bg-muted/40 p-2"
          >
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-xs font-semibold">{status}</span>
              <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">{items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  draggable
                  onDragStart={() => setDragged(t.id)}
                  whileHover={{ y: -2 }}
                  className="cursor-grab rounded-lg border border-border bg-card p-2.5 shadow-sm active:cursor-grabbing"
                >
                  <p className="text-xs font-medium leading-tight">{t.title}</p>
                  {t.related && <p className="mt-1 truncate text-[10px] text-muted-foreground">{t.related}</p>}
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant={PRIORITY_VARIANT[t.priority]} className="text-[10px]">{t.priority}</Badge>
                    <Avatar className="size-5"><AvatarFallback className="text-[9px]">{initials(t.assignee)}</AvatarFallback></Avatar>
                  </div>
                </motion.div>
              ))}
              {items.length === 0 && (
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
