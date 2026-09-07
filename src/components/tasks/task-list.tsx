"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { TaskItem } from "@/lib/mock/data";
import { cn, initials } from "@/lib/utils";

const PRIORITY_VARIANT: Record<string, "muted" | "default" | "warning" | "destructive"> = {
  Low: "muted", Medium: "default", High: "warning", Urgent: "destructive",
};

export function TaskList({ tasks }: { tasks: TaskItem[] }) {
  const [completed, setCompleted] = React.useState<Set<string>>(
    new Set(tasks.filter((t) => t.status === "Completed").map((t) => t.id))
  );
  // eslint-disable-next-line react-hooks/purity
  const now = React.useMemo(() => Date.now(), []);

  return (
    <Card className="divide-y divide-border">
      {tasks.map((t, i) => {
        const isDone = completed.has(t.id);
        const overdue = !isDone && t.dueDate.getTime() < now;
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i, 20) * 0.02 }}
            className="flex items-center gap-3 p-3.5"
          >
            <Checkbox
              checked={isDone}
              onCheckedChange={(v) =>
                setCompleted((prev) => {
                  const next = new Set(prev);
                  if (v) next.add(t.id); else next.delete(t.id);
                  return next;
                })
              }
            />
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-sm font-medium", isDone && "text-muted-foreground line-through")}>{t.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {t.related ? `${t.related} · ` : ""}
                <span className={cn(overdue && "font-medium text-destructive")}>
                  Due {t.dueDate.toLocaleDateString()}
                </span>
              </p>
            </div>
            <Badge variant={PRIORITY_VARIANT[t.priority]}>{t.priority}</Badge>
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-[10px]">{initials(t.assignee)}</AvatarFallback>
            </Avatar>
          </motion.div>
        );
      })}
      {tasks.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">No tasks here. Enjoy the clear inbox.</p>
      )}
    </Card>
  );
}
