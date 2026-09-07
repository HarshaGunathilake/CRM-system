"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarDays, SlidersHorizontal, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WIDGETS, DEFAULT_LAYOUT } from "@/components/dashboard/widget-registry";
import { CustomizeDashboardDialog, type LayoutItem } from "@/components/dashboard/customize-dashboard-dialog";

const STORAGE_KEY = "dashboard:layout:v1";

export default function DashboardPage() {
  const [layout, setLayout] = React.useState<LayoutItem[]>(DEFAULT_LAYOUT);
  const [customizeOpen, setCustomizeOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setLayout(JSON.parse(stored));
    } catch {}
  }, []);

  const saveLayout = (l: LayoutItem[]) => {
    setLayout(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(l));
    } catch {}
    toast.success("Dashboard layout saved");
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, Alex</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="size-3.5" /> Feb 1 – Feb 28
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCustomizeOpen(true)}>
            <SlidersHorizontal className="size-3.5" /> Customize
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Export started", { description: "Your dashboard PDF will download shortly." })}>
            <Download className="size-3.5" /> Export
          </Button>
          <Button variant="outline" size="icon" aria-label="Refresh" onClick={() => toast.info("Dashboard refreshed")}>
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
      </motion.div>

      {layout.filter((l) => l.visible).map((l) => {
        const widget = WIDGETS.find((w) => w.id === l.id);
        return widget ? <React.Fragment key={l.id}>{widget.render()}</React.Fragment> : null;
      })}

      <CustomizeDashboardDialog
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        layout={layout}
        onLayoutChange={saveLayout}
      />
    </div>
  );
}
