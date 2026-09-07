"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

type FieldType = "Text" | "Number" | "Date" | "Dropdown" | "Checkbox" | "Currency";

interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
}

const MODULES = ["Leads", "Contacts", "Companies", "Deals"] as const;

const SEED: Record<(typeof MODULES)[number], CustomField[]> = {
  Leads: [
    { id: "f1", name: "Referral partner", type: "Text", required: false },
    { id: "f2", name: "Budget confirmed", type: "Checkbox", required: false },
  ],
  Contacts: [
    { id: "f3", name: "Preferred contact method", type: "Dropdown", required: false },
    { id: "f4", name: "LinkedIn URL", type: "Text", required: false },
  ],
  Companies: [
    { id: "f5", name: "Fiscal year end", type: "Date", required: false },
    { id: "f6", name: "Annual contract value", type: "Currency", required: true },
  ],
  Deals: [
    { id: "f7", name: "Contract length (months)", type: "Number", required: true },
    { id: "f8", name: "Renewal type", type: "Dropdown", required: false },
  ],
};

export function CustomFieldsPanel() {
  const [module, setModule] = React.useState<(typeof MODULES)[number]>("Leads");
  const [fieldsByModule, setFieldsByModule] = React.useState(SEED);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newType, setNewType] = React.useState<FieldType>("Text");

  const fields = fieldsByModule[module];
  const setFields = (updater: (f: CustomField[]) => CustomField[]) =>
    setFieldsByModule((prev) => ({ ...prev, [module]: updater(prev[module]) }));

  const addField = () => {
    if (!newName.trim()) {
      toast.error("Give the field a name");
      return;
    }
    setFields((f) => [...f, { id: `f${Date.now()}`, name: newName, type: newType, required: false }]);
    toast.success("Custom field added", { description: `${newName} on ${module}` });
    setNewName("");
    setNewType("Text");
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={module} onValueChange={(v) => setModule(v as (typeof MODULES)[number])}>
          <TabsList>
            {MODULES.map((m) => <TabsTrigger key={m} value={m}>{m}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="size-3.5" /> Add field</Button>
      </div>

      <Card className="p-2">
        <Reorder.Group axis="y" values={fields} onReorder={(v) => setFields(() => v)} className="flex flex-col gap-1">
          {fields.map((field) => (
            <Reorder.Item key={field.id} value={field} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-accent/40">
              <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
              <span className="flex-1 text-sm font-medium">{field.name}</span>
              <Badge variant="outline">{field.type}</Badge>
              {field.required && <Badge variant="warning">Required</Badge>}
              <Button variant="ghost" size="icon-sm" onClick={() => setFields((f) => f.filter((x) => x.id !== field.id))}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </Reorder.Item>
          ))}
          {fields.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No custom fields for {module} yet.</p>
          )}
        </Reorder.Group>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add custom field to {module}</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="field-name">Field name</Label>
              <Input id="field-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Preferred language" />
            </div>
            <div className="grid gap-1.5">
              <Label>Field type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as FieldType)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Text", "Number", "Date", "Dropdown", "Checkbox", "Currency"] as FieldType[]).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={addField}>Add field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
