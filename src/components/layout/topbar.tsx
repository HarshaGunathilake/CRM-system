"use client";

import * as React from "react";
import { Menu, Search, Plus, HelpCircle, Command as CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationsPanel } from "@/components/layout/notifications-panel";
import { UserMenu } from "@/components/layout/user-menu";
import type { SessionUser } from "@/components/layout/app-shell";
import type { NotificationItem } from "@/lib/mock/data";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { useDrawer } from "@/components/providers/drawer-provider";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({
  onSearchClick,
  user,
  initialNotifications,
}: {
  onSearchClick: () => void;
  user: SessionUser;
  initialNotifications: NotificationItem[];
}) {
  const { toggle, setMobileOpen } = useSidebar();
  const { openDrawer } = useDrawer();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        onClick={toggle}
        aria-label="Toggle sidebar"
      >
        <Menu className="size-4" />
      </Button>

      <Breadcrumb />

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onSearchClick}
          className="hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex"
        >
          <Search className="size-3.5" />
          <span>Search...</span>
          <kbd className="ml-4 flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium">
            <CommandIcon className="size-2.5" />K
          </kbd>
        </button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={onSearchClick} aria-label="Search">
          <Search className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="hidden sm:inline-flex">
              <Plus className="size-4" /> Quick create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Create new</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openDrawer("lead")}>Lead</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDrawer("contact")}>Contact</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDrawer("company")}>Company</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDrawer("deal")}>Deal</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDrawer("task")}>Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Quick create">
          <Plus className="size-4" />
        </Button>

        <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Help">
          <HelpCircle className="size-4" />
        </Button>
        <ThemeToggle />
        <NotificationsPanel initialItems={initialNotifications} />
        <div className="mx-1 h-6 w-px bg-border" />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
