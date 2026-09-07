"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Inbox as InboxIcon, Send, FileEdit, Star, Archive, Search, Paperclip,
  Reply, Forward, MoreHorizontal, PenSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComposeDialog } from "@/components/inbox/compose-dialog";
import { emails as allEmails, type MailFolder, type EmailMessage } from "@/lib/mock/data";
import { cn, initials } from "@/lib/utils";

const FOLDERS: { name: MailFolder; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "Inbox", icon: InboxIcon },
  { name: "Sent", icon: Send },
  { name: "Drafts", icon: FileEdit },
  { name: "Starred", icon: Star },
  { name: "Archived", icon: Archive },
];

function timeAgo(d: Date) {
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function InboxPage() {
  const [emails, setEmails] = React.useState<EmailMessage[]>(allEmails);
  const [folder, setFolder] = React.useState<MailFolder>("Inbox");
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [composeOpen, setComposeOpen] = React.useState(false);

  const filtered = emails
    .filter((e) => (folder === "Starred" ? e.starred : e.folder === folder))
    .filter((e) => e.subject.toLowerCase().includes(query.toLowerCase()) || e.from.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const selected = emails.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  const toggleStar = (id: string) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));
  const markRead = (id: string) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  const archive = (id: string) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, folder: "Archived" } : e)));

  return (
    <div className="flex h-[calc(100svh-8.5rem)] gap-0 overflow-hidden rounded-xl border border-border bg-card card-elevated">
      {/* Folders */}
      <div className="flex w-48 shrink-0 flex-col gap-1 border-r border-border p-3">
        <Button size="sm" className="mb-2 w-full justify-start" onClick={() => setComposeOpen(true)}>
          <PenSquare className="size-3.5" /> Compose
        </Button>
        {FOLDERS.map((f) => {
          const count = emails.filter((e) => (f.name === "Starred" ? e.starred : e.folder === f.name) && !e.read).length;
          const Icon = f.icon;
          return (
            <button
              key={f.name}
              onClick={() => { setFolder(f.name); setSelectedId(null); }}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                folder === f.name ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="size-4" />
              <span className="flex-1 text-left">{f.name}</span>
              {count > 0 && <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Email list */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border">
        <div className="p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mail..." className="h-8 pl-8 text-sm" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => { setSelectedId(e.id); markRead(e.id); }}
                className={cn(
                  "flex flex-col gap-1 border-b border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-accent/40",
                  selected?.id === e.id && "bg-accent/60",
                  !e.read && "bg-primary/[0.03]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("truncate text-sm", !e.read ? "font-semibold" : "font-medium")}>{e.from}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(e.timestamp)}</span>
                </div>
                <p className={cn("truncate text-xs", !e.read ? "font-medium text-foreground" : "text-muted-foreground")}>{e.subject}</p>
                <p className="truncate text-xs text-muted-foreground/80">{e.preview}</p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">No emails in this folder.</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Preview */}
      <div className="flex flex-1 flex-col">
        {selected ? (
          <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-9"><AvatarFallback>{initials(selected.from)}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-semibold">{selected.subject}</p>
                  <p className="text-xs text-muted-foreground">{selected.from} &lt;{selected.fromEmail}&gt;</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => toggleStar(selected.id)}>
                  <Star className={cn("size-4", selected.starred && "fill-warning text-warning")} />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => archive(selected.id)}><Archive className="size-4" /></Button>
                <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-5">
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground/90">
                {selected.body.map((p, i) => <p key={i}>{p}</p>)}
                {selected.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.attachments.map((a) => (
                      <span key={a} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs">
                        <Paperclip className="size-3.5" /> {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            <Separator />
            <div className="flex items-center gap-2 p-3">
              <Button variant="outline" size="sm"><Reply className="size-3.5" /> Reply</Button>
              <Button variant="outline" size="sm"><Forward className="size-3.5" /> Forward</Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select an email to read
          </div>
        )}
      </div>

      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
    </div>
  );
}
