"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

export function DetailHeader({
  backHref,
  backLabel,
  name,
  subtitle,
  status,
  statusVariant = "muted",
  actions,
}: {
  backHref: string;
  backLabel: string;
  name: string;
  subtitle?: string;
  status?: string;
  statusVariant?: "success" | "warning" | "destructive" | "muted" | "default" | "secondary";
  actions?: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Link href={backHref} className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> {backLabel}
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-14 text-base">
            <AvatarFallback className="bg-primary/15 text-primary">{initials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{name}</h1>
              {status && <Badge variant={statusVariant}>{status}</Badge>}
            </div>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </motion.div>
  );
}
