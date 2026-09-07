"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@/lib/mock/data";
import { initials } from "@/lib/utils";

const STATUS_VARIANT: Record<Contact["status"], "success" | "muted" | "secondary"> = {
  Active: "success", Inactive: "muted", Lead: "secondary",
};

export function ContactGrid({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {contacts.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i, 12) * 0.03, duration: 0.25 }}
        >
          <Link href={`/contacts/${c.id}`}>
            <Card className="flex flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <Avatar className="size-11">
                  <AvatarFallback className="bg-primary/15 text-primary">{initials(c.name)}</AvatarFallback>
                </Avatar>
                <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge>
              </div>
              <div>
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.jobTitle} · {c.companyName}</p>
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 truncate"><Mail className="size-3 shrink-0" />{c.email}</span>
                <span className="flex items-center gap-1.5 truncate"><Phone className="size-3 shrink-0" />{c.phone}</span>
                <span className="flex items-center gap-1.5 truncate"><MapPin className="size-3 shrink-0" />{c.location}</span>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
