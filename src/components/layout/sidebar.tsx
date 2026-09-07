"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsLeft, ChevronDown, Zap, Check } from "lucide-react";
import { navSections } from "@/config/nav";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const WORKSPACES = ["Nimbus CRM", "Acme Internal", "Sandbox"];

function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const [active, setActive] = React.useState(WORKSPACES[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-sm font-semibold text-sidebar-foreground">
                {active}
              </span>
              <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {WORKSPACES.map((ws) => (
          <DropdownMenuItem key={ws} onClick={() => setActive(ws)} className="justify-between">
            {ws}
            {ws === active && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>+ Create workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavLink({
  href,
  icon: Icon,
  title,
  badge,
  collapsed,
  active,
}: {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: number;
  collapsed: boolean;
  active: boolean;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      {Icon && <Icon className={cn("size-4 shrink-0", active && "text-primary")} />}
      {!collapsed && <span className="flex-1 truncate">{title}</span>}
      {!collapsed && badge ? (
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
          {badge}
        </Badge>
      ) : null}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        {title}
        {badge ? <Badge variant="secondary" className="h-4 px-1 text-[10px]">{badge}</Badge> : null}
      </TooltipContent>
    </Tooltip>
  );
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="relative hidden h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
    >
      <div className="flex h-14 items-center px-3">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2 py-3 scrollbar-thin">
        <nav className="flex flex-col gap-4">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {section.title}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    badge={item.badge}
                    collapsed={collapsed}
                    active={pathname === item.href || pathname.startsWith(item.href + "/")}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="flex items-center gap-2 p-2">
        <button
          onClick={toggle}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
        </button>
        {!collapsed && (
          <span className="text-xs text-sidebar-foreground/40">⌘B to toggle</span>
        )}
      </div>
    </motion.aside>
  );
}

function Separator() {
  return <div className="h-px w-full bg-sidebar-border" />;
}
