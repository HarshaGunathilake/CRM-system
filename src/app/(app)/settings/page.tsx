"use client";

import * as React from "react";
import {
  User, Building2, Users, Shield, GitBranch, ListTree, Tag, Mail, Bell, Workflow,
  Plug, Lock, CreditCard, Palette,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { CustomFieldsPanel } from "@/components/settings/custom-fields-panel";
import { AppearancePanel } from "@/components/settings/appearance-panel";
import { cn } from "@/lib/utils";

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SettingsSection[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "teams", label: "Teams", icon: Users },
  { id: "roles", label: "Roles", icon: Shield },
  { id: "permissions", label: "Permissions", icon: Lock },
  { id: "pipelines", label: "Pipelines", icon: GitBranch },
  { id: "custom-fields", label: "Custom Fields", icon: ListTree },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "email", label: "Email", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "automation", label: "Automation", icon: Workflow },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "security", label: "Security", icon: Lock },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const [active, setActive] = React.useState("custom-fields");
  const section = SECTIONS.find((s) => s.id === active)!;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Manage your workspace configuration." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active === s.id ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <s.icon className="size-4" /> {s.label}
            </button>
          ))}
        </nav>

        <Card className="p-5">
          {section.id === "custom-fields" && <CustomFieldsPanel />}
          {section.id === "appearance" && <AppearancePanel />}
          {section.id !== "custom-fields" && section.id !== "appearance" && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <section.icon className="size-5" />
              </span>
              <h3 className="text-sm font-semibold">{section.label}</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                {section.label} settings are on the Nimbus CRM roadmap and will land in a future build phase.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
