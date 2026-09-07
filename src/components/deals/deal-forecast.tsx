"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { deals } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils";

const OWNERS = Array.from(new Set(deals.map((d) => d.owner)));

export function DealForecast() {
  const open = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const totalValue = open.reduce((a, d) => a + d.value, 0);
  const weighted = open.reduce((a, d) => a + (d.value * d.probability) / 100, 0);
  const won = deals.filter((d) => d.stage === "Won").reduce((a, d) => a + d.value, 0);

  const byOwner = OWNERS.map((owner) => {
    const ownerDeals = open.filter((d) => d.owner === owner);
    return {
      owner: owner.split(" ")[0],
      weighted: Math.round(ownerDeals.reduce((a, d) => a + (d.value * d.probability) / 100, 0)),
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Open pipeline value</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalValue, true)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Weighted forecast</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{formatCurrency(weighted, true)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Closed won (period)</p>
          <p className="mt-1 text-2xl font-semibold text-success">{formatCurrency(won, true)}</p>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weighted forecast by owner</CardTitle>
          <CardDescription>Pipeline value adjusted for stage probability</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byOwner} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="owner" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => formatCurrency(v, true)} width={56} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                formatter={(v) => formatCurrency(Number(v))}
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="weighted" radius={[6, 6, 0, 0]}>
                {byOwner.map((_, i) => (
                  <Cell key={i} fill="hsl(var(--chart-1))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
