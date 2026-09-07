"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { DrawerProvider } from "@/components/providers/drawer-provider";
import { CreateLeadDrawer } from "@/components/drawers/create-lead-drawer";
import { CreateContactDrawer } from "@/components/drawers/create-contact-drawer";
import { CreateCompanyDrawer } from "@/components/drawers/create-company-drawer";
import { CreateDealDrawer } from "@/components/drawers/create-deal-drawer";
import { CreateTaskDrawer } from "@/components/drawers/create-task-drawer";
import type { NotificationItem } from "@/lib/mock/data";

export interface SessionUser {
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}

export function AppShell({
  children,
  user,
  initialNotifications,
}: {
  children: React.ReactNode;
  user: SessionUser;
  initialNotifications: NotificationItem[];
}) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  return (
    <DrawerProvider>
      <SidebarProvider>
        <div className="flex h-svh w-full overflow-hidden bg-background">
          <Sidebar />
          <MobileSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar onSearchClick={() => setPaletteOpen(true)} user={user} initialNotifications={initialNotifications} />
            <main className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6">{children}</div>
            </main>
          </div>
        </div>
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
        <CreateLeadDrawer />
        <CreateContactDrawer />
        <CreateCompanyDrawer />
        <CreateDealDrawer />
        <CreateTaskDrawer />
      </SidebarProvider>
    </DrawerProvider>
  );
}
