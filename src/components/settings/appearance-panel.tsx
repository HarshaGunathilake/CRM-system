"use client";

import { useTheme } from "next-themes";
import { Check, Moon, Sun, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold">Theme</h3>
        <p className="text-xs text-muted-foreground">Choose how Nimbus CRM looks on this device.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => (
          <button key={opt.value} onClick={() => setTheme(opt.value)}>
            <Card className={cn("flex flex-col items-center gap-2 p-5 transition-all", theme === opt.value && "border-primary ring-1 ring-primary")}>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <opt.icon className="size-4" />
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {opt.label}
                {theme === opt.value && <Check className="size-3.5 text-primary" />}
              </span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
