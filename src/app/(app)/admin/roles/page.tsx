"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, ShieldCheck, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "super-admin", name: "Super Admin", description: "Full access to everything, including billing", users: 2 },
  { id: "admin", name: "Admin", description: "Manage users, settings, and all CRM data", users: 4 },
  { id: "sales-manager", name: "Sales Manager", description: "Manage team pipeline, reports, and quotas", users: 6 },
  { id: "sales-rep", name: "Sales Representative", description: "Manage own leads, contacts, and deals", users: 18 },
  { id: "support-agent", name: "Support Agent", description: "View accounts, log activities and tickets", users: 9 },
  { id: "viewer", name: "Viewer", description: "Read-only access to dashboards and reports", users: 5 },
];

const MODULES = ["Leads", "Contacts", "Companies", "Deals", "Reports", "Automation", "Settings"];
const PERMS = ["View", "Create", "Edit", "Delete"] as const;

type PermKey = `${string}:${(typeof PERMS)[number]}`;

function defaultMatrix(roleId: string): Record<PermKey, boolean> {
  const matrix: Record<string, boolean> = {};
  const level = roleId === "super-admin" || roleId === "admin" ? 4 : roleId === "sales-manager" ? 3 : roleId === "sales-rep" ? 2 : roleId === "support-agent" ? 1 : 0;
  MODULES.forEach((m) => {
    PERMS.forEach((p, i) => {
      matrix[`${m}:${p}`] = i < level || (roleId === "viewer" && p === "View");
    });
  });
  return matrix as Record<PermKey, boolean>;
}

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = React.useState(ROLES[2].id);
  const [matrices, setMatrices] = React.useState<Record<string, Record<PermKey, boolean>>>(() =>
    Object.fromEntries(ROLES.map((r) => [r.id, defaultMatrix(r.id)]))
  );

  const role = ROLES.find((r) => r.id === selectedRole)!;
  const matrix = matrices[selectedRole];

  const toggle = (key: PermKey) =>
    setMatrices((prev) => ({ ...prev, [selectedRole]: { ...prev[selectedRole], [key]: !prev[selectedRole][key] } }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Roles & Permissions"
        description="Define what each role can see and do across the workspace."
        actions={<Button size="sm"><Plus className="size-3.5" /> New role</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-2">
          {ROLES.map((r) => (
            <button key={r.id} onClick={() => setSelectedRole(r.id)}>
              <Card className={cn("flex items-center gap-3 p-3 text-left transition-all", selectedRole === r.id && "border-primary ring-1 ring-primary")}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.description}</p>
                </div>
                <Badge variant="muted" className="shrink-0">{r.users}</Badge>
              </Card>
            </button>
          ))}
        </div>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">{role.name} permissions</h3>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </div>
            <Button size="sm" onClick={() => toast.success("Permissions saved", { description: role.name })}>
              <Save className="size-3.5" /> Save changes
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 font-medium">Module</th>
                  {PERMS.map((p) => <th key={p} className="py-2 text-center font-medium">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((m) => (
                  <tr key={m} className="border-b border-border/60">
                    <td className="py-2.5 font-medium">{m}</td>
                    {PERMS.map((p) => {
                      const key = `${m}:${p}` as PermKey;
                      return (
                        <td key={p} className="py-2.5 text-center">
                          <Checkbox checked={matrix[key]} onCheckedChange={() => toggle(key)} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
