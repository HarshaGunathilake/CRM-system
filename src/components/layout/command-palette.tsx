"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Users, Building2, Handshake, CheckSquare, Package, FileText, Settings,
  LayoutDashboard, Plus, Clock, ArrowRight,
} from "lucide-react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator,
} from "@/components/ui/command";
import { contacts, companies, leads, deals } from "@/lib/mock/data";

const RECENT_SEARCHES = ["Acme Corporation", "Sarah Chen", "Q3 renewal deals"];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search contacts, deals, companies, tasks..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Recent searches">
          {RECENT_SEARCHES.map((s) => (
            <CommandItem key={s} onSelect={() => onOpenChange(false)}>
              <Clock />
              {s}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Suggested actions">
          <CommandItem onSelect={() => go("/leads")}>
            <Plus />
            Create new lead
            <CommandShortcut>L</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/deals")}>
            <Plus />
            Create new deal
            <CommandShortcut>D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/contacts")}>
            <Plus />
            Add contact
            <CommandShortcut>C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/leads")}>
            <Users /> Leads
          </CommandItem>
          <CommandItem onSelect={() => go("/deals")}>
            <Handshake /> Deals
          </CommandItem>
          <CommandItem onSelect={() => go("/products")}>
            <Package /> Products
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <Settings /> Settings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Contacts">
          {contacts.slice(0, 4).map((c) => (
            <CommandItem key={c.id} onSelect={() => go(`/contacts/${c.id}`)}>
              <Users />
              {c.name}
              <span className="ml-2 truncate text-xs text-muted-foreground">{c.companyName}</span>
              <ArrowRight className="ml-auto size-3.5 opacity-0 group-data-[selected=true]:opacity-100" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Companies">
          {companies.slice(0, 3).map((c) => (
            <CommandItem key={c.id} onSelect={() => go(`/companies/${c.id}`)}>
              <Building2 />
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Leads">
          {leads.slice(0, 3).map((l) => (
            <CommandItem key={l.id} onSelect={() => go(`/leads/${l.id}`)}>
              <FileText />
              {l.name}
              <span className="ml-2 truncate text-xs text-muted-foreground">{l.companyName}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Deals">
          {deals.slice(0, 3).map((d) => (
            <CommandItem key={d.id} onSelect={() => go(`/deals/${d.id}`)}>
              <Handshake />
              {d.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Tasks">
          <CommandItem onSelect={() => go("/tasks/my")}>
            <CheckSquare /> My Tasks
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
