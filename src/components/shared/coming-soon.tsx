"use client";

import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ComingSoon({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-[70vh] items-center justify-center"
    >
      <Card className="flex max-w-md flex-col items-center gap-3 p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Construction className="size-6" />
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          This module is part of the Nimbus CRM roadmap and is coming in a future build phase.
        </p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => history.back()}>
          Go back
        </Button>
      </Card>
    </motion.div>
  );
}
