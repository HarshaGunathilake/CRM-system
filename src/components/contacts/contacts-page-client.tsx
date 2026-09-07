"use client";

import * as React from "react";
import { Plus, Upload, LayoutGrid, List as ListIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { contactColumns } from "@/components/contacts/contact-columns";
import { ContactGrid } from "@/components/contacts/contact-grid";
import { useDrawer } from "@/components/providers/drawer-provider";
import { cn } from "@/lib/utils";
import type { Contact } from "@/lib/mock/data";

export function ContactsPageClient({ contacts }: { contacts: Contact[] }) {
  const { openDrawer } = useDrawer();
  const [view, setView] = React.useState<"table" | "grid">("table");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contacts"
        description={`${contacts.length} contacts across your workspace`}
        actions={
          <>
            <div className="flex items-center rounded-lg border border-border p-0.5">
              <button
                onClick={() => setView("table")}
                className={cn("rounded-md p-1.5 transition-colors", view === "table" ? "bg-muted text-foreground" : "text-muted-foreground")}
                aria-label="Table view"
              >
                <ListIcon className="size-4" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={cn("rounded-md p-1.5 transition-colors", view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground")}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
            <Button variant="outline" size="sm"><Upload className="size-3.5" /> Import</Button>
            <Button size="sm" onClick={() => openDrawer("contact")}><Plus className="size-3.5" /> Add contact</Button>
          </>
        }
      />

      {view === "table" ? (
        <DataTable columns={contactColumns} data={contacts} searchKey="name" searchPlaceholder="Search contacts..." />
      ) : (
        <ContactGrid contacts={contacts} />
      )}
    </div>
  );
}
