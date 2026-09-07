"use client";

import type { CalendarEvent } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const TYPE_COLOR: Record<CalendarEvent["type"], string> = {
  Meeting: "bg-chart-1/15 text-chart-1", Call: "bg-chart-2/15 text-chart-2",
  Task: "bg-chart-4/15 text-chart-4", "Follow-up": "bg-chart-3/15 text-chart-3",
  Deadline: "bg-destructive/15 text-destructive",
};

function startOfWeek(d: Date) {
  const date = new Date(d);
  date.setDate(date.getDate() - date.getDay());
  date.setHours(0, 0, 0, 0);
  return date;
}
function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export function WeekView({ events }: { events: CalendarEvent[] }) {
  const start = startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
      {days.map((day) => {
        const dayEvents = events.filter((e) => sameDay(e.date, day));
        const isToday = sameDay(day, new Date());
        return (
          <div key={day.toISOString()} className="flex flex-col gap-2 rounded-lg border border-border p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className={cn("flex size-6 items-center justify-center rounded-full text-xs", isToday && "bg-primary font-semibold text-primary-foreground")}>
                {day.getDate()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {dayEvents.map((e) => (
                <div key={e.id} className={cn("rounded px-1.5 py-1 text-[11px]", TYPE_COLOR[e.type])}>
                  <p className="font-medium">{e.time}</p>
                  <p className="truncate">{e.title}</p>
                </div>
              ))}
              {dayEvents.length === 0 && <p className="text-[11px] text-muted-foreground/60">No events</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
