"use client";

import * as React from "react";
import { Bell, AtSign, CheckSquare, Handshake, Users, Cog, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NotificationItem } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import {
  getMyNotifications, markNotificationReadAction, markAllNotificationsReadAction,
} from "@/lib/actions/notifications";

const CATEGORY_ICON: Record<NotificationItem["category"], React.ComponentType<{ className?: string }>> = {
  Mentions: AtSign,
  Tasks: CheckSquare,
  Deals: Handshake,
  Leads: Users,
  System: Cog,
  Automations: Zap,
};

function timeAgo(d: Date) {
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const POLL_INTERVAL_MS = 20_000;

export function NotificationsPanel({ initialItems }: { initialItems: NotificationItem[] }) {
  const [items, setItems] = React.useState(initialItems);
  const unread = items.filter((i) => !i.read).length;

  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await getMyNotifications();
        setItems(fresh);
      } catch {
        // Network hiccup — keep showing what we have and retry next tick.
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const markOneRead = React.useCallback(async (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    await markNotificationReadAction(id);
  }, []);

  const markAllRead = React.useCallback(async () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    await markAllNotificationsReadAction();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border p-3">
          <span className="text-sm font-semibold">Notifications</span>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>
        <Tabs defaultValue="all" className="p-2">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger value="all" className="data-[state=active]:bg-muted">All</TabsTrigger>
            <TabsTrigger value="Mentions" className="data-[state=active]:bg-muted">Mentions</TabsTrigger>
            <TabsTrigger value="Tasks" className="data-[state=active]:bg-muted">Tasks</TabsTrigger>
            <TabsTrigger value="Deals" className="data-[state=active]:bg-muted">Deals</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-2">
            <NotificationList items={items} onRead={markOneRead} />
          </TabsContent>
          <TabsContent value="Mentions" className="mt-2">
            <NotificationList items={items.filter((i) => i.category === "Mentions")} onRead={markOneRead} />
          </TabsContent>
          <TabsContent value="Tasks" className="mt-2">
            <NotificationList items={items.filter((i) => i.category === "Tasks")} onRead={markOneRead} />
          </TabsContent>
          <TabsContent value="Deals" className="mt-2">
            <NotificationList items={items.filter((i) => i.category === "Deals")} onRead={markOneRead} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

function NotificationList({
  items,
  onRead,
}: {
  items: NotificationItem[];
  onRead: (id: string) => void;
}) {
  if (items.length === 0) {
    return <div className="py-10 text-center text-sm text-muted-foreground">You&apos;re all caught up.</div>;
  }
  return (
    <ScrollArea className="h-80">
      <div className="flex flex-col">
        {items.map((n) => {
          const Icon = CATEGORY_ICON[n.category];
          return (
            <button
              key={n.id}
              onClick={() => onRead(n.id)}
              className={cn(
                "flex items-start gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-accent/60",
                !n.read && "bg-primary/[0.04]"
              )}
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{n.title}</span>
                  {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{n.description}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground/70">{timeAgo(n.timestamp)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
