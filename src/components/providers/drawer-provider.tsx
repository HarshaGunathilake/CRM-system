"use client";

import * as React from "react";

export type DrawerType = "lead" | "contact" | "company" | "deal" | "task" | null;

interface DrawerContextValue {
  open: DrawerType;
  openDrawer: (type: Exclude<DrawerType, null>) => void;
  closeDrawer: () => void;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<DrawerType>(null);
  const value = React.useMemo(
    () => ({
      open,
      openDrawer: (type: Exclude<DrawerType, null>) => setOpen(type),
      closeDrawer: () => setOpen(null),
    }),
    [open]
  );
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within DrawerProvider");
  return ctx;
}
