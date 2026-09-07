"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CalendarEvent } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const TYPE_COLOR: Record<CalendarEvent["type"], string> = {
  Meeting: "bg-chart-1/15 text-chart-1",
  Call: "bg-chart-2/15 text-chart-2",
  Task: "bg-chart-4/15 text-chart-4",
  "Follow-up": "bg-chart-3/15 text-chart-3",
  Deadline: "bg-destructive/15 text-destructive",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function MonthView({
  events,
  onDayClick,
}: {
  events: CalendarEvent[];
  onDayClick?: (date: Date) => void;
}) {
  const [cursor, setCursor] = React.useState(() => new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setCursor(new Date())}>Today</Button>
          <Button variant="outline" size="icon-sm" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-muted/60 py-1.5 text-center text-[11px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          const dayEvents = date ? events.filter((e) => sameDay(e.date, date)) : [];
          const isToday = date && sameDay(date, today);
          return (
            <motion.button
              key={i}
              onClick={() => date && onDayClick?.(date)}
              whileHover={date ? { scale: 1.01 } : undefined}
              className={cn(
                "flex min-h-[92px] flex-col items-start gap-1 bg-card p-1.5 text-left align-top transition-colors",
                !date && "bg-muted/20",
                date && "hover:bg-accent/40"
              )}
            >
              {date && (
                <>
                  <span className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[11px]",
                    isToday ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground"
                  )}>
                    {date.getDate()}
                  </span>
                  <div className="flex w-full flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <span key={e.id} className={cn("truncate rounded px-1 py-0.5 text-[10px] font-medium", TYPE_COLOR[e.type])}>
                        {e.time} {e.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <Badge variant="muted" className="w-fit text-[9px]">+{dayEvents.length - 2} more</Badge>
                    )}
                  </div>
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
