"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { navSections } from "@/config/nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";

export function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </span>
            Nimbus CRM
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 overflow-y-auto p-3">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
                        active ? "bg-accent font-medium text-accent-foreground" : "text-foreground/80 hover:bg-accent/60"
                      )}
                    >
                      {Icon && <Icon className="size-4" />}
                      <span className="flex-1">{item.title}</span>
                      {item.badge ? <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{item.badge}</Badge> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
