"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Handshake, CheckSquare, Receipt, UserPlus, Phone, Mail, CalendarClock, StickyNote, Filter,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { activityFeed, type ActivityItem } from "@/lib/mock/data";

const ICON: Record<ActivityItem["type"], React.ComponentType<{ className?: string }>> = {
  deal: Handshake, task: CheckSquare, invoice: Receipt, lead: UserPlus,
  call: Phone, email: Mail, meeting: CalendarClock, note: StickyNote,
};
const COLOR: Record<ActivityItem["type"], string> = {
  deal: "text-primary bg-primary/10", task: "text-success bg-success/10",
  invoice: "text-chart-4 bg-chart-4/10", lead: "text-chart-3 bg-chart-3/10",
  call: "text-chart-2 bg-chart-2/10", email: "text-chart-5 bg-chart-5/10",
  meeting: "text-primary bg-primary/10", note: "text-muted-foreground bg-muted",
};
const ALL_TYPES = Object.keys(ICON) as ActivityItem["type"][];

// Extend the base feed with more synthetic entries so the page feels populated.
const extendedFeed: ActivityItem[] = [
  ...activityFeed,
  ...activityFeed.map((a, i) => ({ ...a, id: `${a.id}_x${i}`, timestamp: new Date(a.timestamp.getTime() - (i + 1) * 3600_000) })),
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

function timeAgo(d: Date) {
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActivitiesPage() {
  const [visible, setVisible] = React.useState<Set<ActivityItem["type"]>>(new Set(ALL_TYPES));
  const filtered = extendedFeed.filter((a) => visible.has(a.type));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Activities"
        description="A unified timeline of everything happening across your CRM."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Filter className="size-3.5" /> Filter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Activity types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_TYPES.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  className="capitalize"
                  checked={visible.has(t)}
                  onCheckedChange={(v) =>
                    setVisible((prev) => {
                      const next = new Set(prev);
                      if (v) next.add(t); else next.delete(t);
                      return next;
                    })
                  }
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <Card className="p-5">
        <div className="flex flex-col">
          {filtered.map((a, i) => {
            const Icon = ICON[a.type];
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i, 20) * 0.03, duration: 0.25 }}
                className="relative flex gap-3 pb-6 last:pb-0"
              >
                {i < filtered.length - 1 && (
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
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No activities match the selected filters.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
