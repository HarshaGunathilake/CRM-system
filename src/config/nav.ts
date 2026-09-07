import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users, Building2, Handshake, GitBranch, Activity,
  TrendingUp, FileText, ShoppingCart, Package, Inbox, Mail, Phone,
  MessageSquare, CheckSquare, CalendarDays, Workflow, Sliders, Zap,
  BarChart3, PieChart, LineChart, UserCog, Users2, ShieldCheck, Settings, ScrollText,
} from "lucide-react";

export interface NavLeaf {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: number;
}

export interface NavSection {
  title: string;
  items: NavLeaf[];
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "CRM",
    items: [
      { title: "Leads", href: "/leads", icon: Users, badge: 14 },
      { title: "Contacts", href: "/contacts", icon: Users2 },
      { title: "Companies", href: "/companies", icon: Building2 },
      { title: "Deals", href: "/deals", icon: Handshake },
      { title: "Pipelines", href: "/pipelines", icon: GitBranch },
      { title: "Activities", href: "/activities", icon: Activity },
    ],
  },
  {
    title: "Sales",
    items: [
      { title: "Opportunities", href: "/opportunities", icon: TrendingUp },
      { title: "Quotes", href: "/quotes", icon: FileText },
      { title: "Orders", href: "/orders", icon: ShoppingCart },
      { title: "Products", href: "/products", icon: Package },
    ],
  },
  {
    title: "Communication",
    items: [
      { title: "Inbox", href: "/inbox", icon: Inbox, badge: 5 },
      { title: "Emails", href: "/emails", icon: Mail },
      { title: "Calls", href: "/calls", icon: Phone },
      { title: "Messages", href: "/messages", icon: MessageSquare },
    ],
  },
  {
    title: "Tasks",
    items: [
      { title: "My Tasks", href: "/tasks/my", icon: CheckSquare, badge: 7 },
      { title: "Team Tasks", href: "/tasks/team", icon: Users },
      { title: "Calendar", href: "/calendar", icon: CalendarDays },
    ],
  },
  {
    title: "Automation",
    items: [
      { title: "Workflows", href: "/workflows", icon: Workflow },
      { title: "Rules", href: "/rules", icon: Sliders },
      { title: "Triggers", href: "/triggers", icon: Zap },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Reports", href: "/reports", icon: BarChart3 },
      { title: "Sales Analytics", href: "/analytics/sales", icon: LineChart },
      { title: "Customer Analytics", href: "/analytics/customers", icon: PieChart },
      { title: "Activity Analytics", href: "/analytics/activity", icon: Activity },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Users", href: "/admin/users", icon: UserCog },
      { title: "Teams", href: "/admin/teams", icon: Users2 },
      { title: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
      { title: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
