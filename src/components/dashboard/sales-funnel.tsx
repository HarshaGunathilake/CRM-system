"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { salesFunnel } from "@/lib/mock/data";

export function SalesFunnel() {
  const max = salesFunnel[0].value;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sales Funnel</CardTitle>
        <CardDescription>Lead-to-close conversion by stage</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {salesFunnel.map((s, i) => {
          const widthPct = 30 + (s.value / max) * 70;
          return (
            <div key={s.stage}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{s.stage}</span>
                <span className="text-muted-foreground">
                  {s.value.toLocaleString()} · {s.rate.toFixed(1)}%
                </span>
              </div>
              <div className="h-7 w-full overflow-hidden rounded-md bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  className="h-full rounded-md"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--chart-1)) 0%, hsl(var(--chart-1) / 0.55) 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
