"use client";

import { motion } from "framer-motion";
import {
  Handshake, CheckSquare, Receipt, UserPlus, Phone, Mail, CalendarClock, StickyNote,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { activityFeed, type ActivityItem } from "@/lib/mock/data";

const ICON: Record<ActivityItem["type"], React.ComponentType<{ className?: string }>> = {
  deal: Handshake,
  task: CheckSquare,
  invoice: Receipt,
  lead: UserPlus,
  call: Phone,
  email: Mail,
  meeting: CalendarClock,
  note: StickyNote,
};

const COLOR: Record<ActivityItem["type"], string> = {
  deal: "text-primary bg-primary/10",
  task: "text-success bg-success/10",
  invoice: "text-chart-4 bg-chart-4/10",
  lead: "text-chart-3 bg-chart-3/10",
  call: "text-chart-2 bg-chart-2/10",
  email: "text-chart-5 bg-chart-5/10",
  meeting: "text-primary bg-primary/10",
  note: "text-muted-foreground bg-muted",
};

function timeAgo(d: Date) {
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Live feed across your workspace</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {activityFeed.map((a, i) => {
          const Icon = ICON[a.type];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="relative flex gap-3 pb-5 last:pb-0"
            >
              {i < activityFeed.length - 1 && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-border" />
              )}
              <span className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${COLOR[a.type]}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm leading-snug">
                  <span className="font-medium text-foreground">{a.actor}</span>{" "}
                  <span className="text-muted-foreground">{a.message}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{timeAgo(a.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
