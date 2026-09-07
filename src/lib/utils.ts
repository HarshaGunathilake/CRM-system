import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Manual compact-number formatting. We deliberately avoid Intl's
// notation: "compact" here — its trailing-zero behavior differs between
// Node's ICU (server render) and the browser's ICU (client render),
// which causes React hydration mismatches (e.g. "$3M" vs "$3.0M").
function compactSuffix(value: number): { divided: number; suffix: string } {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return { divided: value / 1_000_000_000, suffix: "B" };
  if (abs >= 1_000_000) return { divided: value / 1_000_000, suffix: "M" };
  if (abs >= 1_000) return { divided: value / 1_000, suffix: "K" };
  return { divided: value, suffix: "" };
}

function trimTrailingZero(n: number): string {
  const fixed = n.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

export function formatCurrency(value: number, compact = false) {
  if (compact) {
    const { divided, suffix } = compactSuffix(value);
    const num = suffix ? trimTrailingZero(divided) : Math.round(divided).toString();
    return `$${num}${suffix}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  const { divided, suffix } = compactSuffix(value);
  const num = suffix ? trimTrailingZero(divided) : Math.round(divided).toString();
  return `${num}${suffix}`;
}

export function formatPercent(value: number, withSign = true) {
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
