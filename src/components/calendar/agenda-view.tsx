"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CalendarEvent } from "@/lib/mock/data";

const TYPE_VARIANT: Record<CalendarEvent["type"], "default" | "secondary" | "warning" | "destructive" | "muted"> = {
  Meeting: "default", Call: "secondary", Task: "muted", "Follow-up": "warning", Deadline: "destructive",
};

export function AgendaView({ events }: { events: CalendarEvent[] }) {
  const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  const grouped = sorted.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    const key = e.date.toDateString();
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([day, items], gi) => (
        <motion.div key={day} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(gi, 15) * 0.03 }}>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            {new Date(day).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <Card className="divide-y divide-border">
            {items.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-3">
                <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">{e.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.title}</p>
                  {e.withWhom && <p className="truncate text-xs text-muted-foreground">{e.withWhom}</p>}
                </div>
                <Badge variant={TYPE_VARIANT[e.type]}>{e.type}</Badge>
              </div>
            ))}
          </Card>
        </motion.div>
      ))}
      {sorted.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No upcoming events.</p>}
    </div>
  );
}
