"use client";

import { Badge } from "@/components/ui/badge";
import type { CalendarEvent } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const TYPE_VARIANT: Record<CalendarEvent["type"], "default" | "secondary" | "warning" | "destructive" | "muted"> = {
  Meeting: "default", Call: "secondary", Task: "muted", "Follow-up": "warning", Deadline: "destructive",
};

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8am - 6pm

export function DayView({ events, date = new Date() }: { events: CalendarEvent[]; date?: Date }) {
  const dayEvents = events.filter((e) => e.date.toDateString() === date.toDateString());

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {HOURS.map((h) => {
        const hourEvents = dayEvents.filter((e) => Number(e.time.split(":")[0]) === h);
        return (
          <div key={h} className="flex min-h-14 gap-3 p-2">
            <span className="w-14 shrink-0 pt-1 text-xs text-muted-foreground">
              {h % 12 === 0 ? 12 : h % 12}:00 {h < 12 ? "AM" : "PM"}
            </span>
            <div className={cn("flex flex-1 flex-wrap gap-1.5", hourEvents.length === 0 && "border-l border-dashed border-border/60 pl-3")}>
              {hourEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
                  <span className="text-xs font-medium">{e.title}</span>
                  {e.withWhom && <span className="text-[11px] text-muted-foreground">· {e.withWhom}</span>}
                  <Badge variant={TYPE_VARIANT[e.type]} className="text-[10px]">{e.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
