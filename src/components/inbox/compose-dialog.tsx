"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ComposeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [to, setTo] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  const send = () => {
    if (!to.trim() || !subject.trim()) {
      toast.error("Add a recipient and subject before sending");
      return;
    }
    toast.success("Email sent", { description: `To ${to}` });
    setTo(""); setSubject(""); setBody("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>New message</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="mail-to">To</Label>
            <Input id="mail-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@company.com" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mail-subject">Subject</Label>
            <Input id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mail-body">Message</Label>
            <Textarea id="mail-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message..." className="min-h-32" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Discard</Button>
          <Button onClick={send}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
