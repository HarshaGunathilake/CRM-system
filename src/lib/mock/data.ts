// Realistic mock data generators for the CRM. Deterministic (seeded) so
// server and client render the same values (avoids hydration mismatches).

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Converted"
  | "Lost";

export type DealStage =
  | "New Lead"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost";

export type Priority = "Low" | "Medium" | "High" | "Urgent";

// ---- seeded RNG (mulberry32) for stable mock output ----
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260907);
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
}
function int(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const FIRST_NAMES = [
  "James", "Sarah", "Michael", "Emily", "David", "Jessica", "Daniel", "Ashley",
  "Christopher", "Amanda", "Matthew", "Olivia", "Andrew", "Sophia", "Joshua",
  "Isabella", "Ryan", "Natalie", "Brandon", "Grace", "Justin", "Chloe",
  "Kevin", "Hannah", "Nathan", "Victoria", "Tyler", "Zoe", "Aaron", "Lauren",
  "Ethan", "Megan", "Jordan", "Rachel", "Marcus", "Priya", "Wei", "Fatima",
  "Carlos", "Elena", "Liam", "Noah", "Ava", "Mia", "Lucas", "Amelia",
];
const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Moore",
  "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris",
  "Clark", "Lewis", "Walker", "Young", "Allen", "King", "Wright", "Scott",
  "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Baker", "Nelson",
  "Carter", "Mitchell", "Perry", "Roberts", "Turner", "Phillips", "Campbell",
];
const COMPANY_PREFIX = [
  "Acme", "Summit", "Beta", "Global", "Apex", "Vertex", "Horizon", "Nimbus",
  "Cascade", "Granite", "Meridian", "Pioneer", "Sterling", "Catalyst",
  "Quantum", "Ridgeline", "Northwind", "Bluepeak", "Ironclad", "Lumina",
  "Redwood", "Silverline", "Anchor", "Brightpath", "Crestview", "Delta",
  "Fenwick", "Harborview", "Ivory", "Junction", "Keystone", "Lakeshore",
];
const COMPANY_SUFFIX = [
  "Corporation", "Industries", "Manufacturing", "Solutions", "Technologies",
  "Group", "Systems", "Holdings", "Partners", "Logistics", "Networks",
  "Enterprises", "Dynamics", "Labs", "Studio", "Works",
];
const INDUSTRIES = [
  "Manufacturing", "Software", "Healthcare", "Financial Services", "Retail",
  "Logistics", "Construction", "Energy", "Telecommunications", "Education",
  "Hospitality", "Real Estate", "Automotive", "Media", "Agriculture",
];
const CITIES = [
  "Austin, TX", "Denver, CO", "Chicago, IL", "Seattle, WA", "Atlanta, GA",
  "Boston, MA", "Portland, OR", "Phoenix, AZ", "Charlotte, NC", "Dallas, TX",
  "San Diego, CA", "Nashville, TN", "Minneapolis, MN", "Columbus, OH",
  "Raleigh, NC", "Salt Lake City, UT", "Kansas City, MO", "Tampa, FL",
];
const JOB_TITLES = [
  "VP of Operations", "Procurement Manager", "CFO", "IT Director",
  "Head of Sales", "COO", "Supply Chain Manager", "CEO", "VP of Engineering",
  "Marketing Director", "Purchasing Lead", "General Manager", "CTO",
  "Director of Finance", "Plant Manager",
];
const OWNERS = [
  "Alex Morgan", "Priya Nair", "Jordan Lee", "Sam Whitfield", "Maria Chen",
  "Derek Osei", "Emma Rousseau", "Noah Bennett",
];
const LEAD_SOURCES = ["Website", "Referral", "Trade Show", "Cold Call", "LinkedIn", "Webinar", "Partner"];
const TAGS_POOL = ["Enterprise", "SMB", "Hot", "Renewal", "Upsell", "Churn Risk", "Strategic", "Pilot"];
const PRODUCTS = [
  { name: "Industrial Drill Press", price: 4200 },
  { name: "Hydraulic Pump Assembly", price: 3150 },
  { name: "Control Panel Unit", price: 2680 },
  { name: "Air Compressor 50L", price: 1890 },
  { name: "Safety Valve Kit", price: 640 },
  { name: "Conveyor Motor", price: 3420 },
  { name: "CRM Enterprise License", price: 24000 },
  { name: "Analytics Add-on", price: 6800 },
  { name: "Automation Workflow Pack", price: 9200 },
  { name: "Onboarding & Training", price: 4500 },
];

function makeCompanyName() {
  return `${pick(COMPANY_PREFIX)} ${pick(COMPANY_SUFFIX)}`;
}
function makePersonName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}
function emailFor(name: string, domain: string) {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@${domain}`;
}
function domainFor(company: string) {
  return company.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com";
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  annualRevenue: number;
  location: string;
  website: string;
  owner: string;
  openDeals: number;
  totalRevenue: number;
  logoLetter: string;
}

export const companies: Company[] = Array.from({ length: 56 }).map((_, i) => {
  const name = makeCompanyName();
  return {
    id: `co_${i + 1}`,
    name,
    industry: pick(INDUSTRIES),
    employees: int(8, 4200),
    annualRevenue: int(500_000, 85_000_000),
    location: pick(CITIES),
    website: `www.${domainFor(name)}`,
    owner: pick(OWNERS),
    openDeals: int(0, 6),
    totalRevenue: int(0, 620_000),
    logoLetter: name[0],
  };
});

export interface Contact {
  id: string;
  name: string;
  avatarSeed: number;
  jobTitle: string;
  companyId: string;
  companyName: string;
  email: string;
  phone: string;
  location: string;
  owner: string;
  status: "Active" | "Inactive" | "Lead";
  lastActivity: Date;
  tags: string[];
}

export const contacts: Contact[] = Array.from({ length: 128 }).map((_, i) => {
  const name = makePersonName();
  const company = pick(companies);
  return {
    id: `ct_${i + 1}`,
    name,
    avatarSeed: i,
    jobTitle: pick(JOB_TITLES),
    companyId: company.id,
    companyName: company.name,
    email: emailFor(name, domainFor(company.name)),
    phone: `+1 (${int(200, 989)}) ${int(200, 989)}-${int(1000, 9999)}`,
    location: pick(CITIES),
    owner: pick(OWNERS),
    status: pick(["Active", "Active", "Active", "Inactive", "Lead"] as const),
    lastActivity: daysAgo(int(0, 45)),
    tags: pickN(TAGS_POOL, int(0, 2)),
  };
});

export interface Lead {
  id: string;
  name: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  score: number;
  owner: string;
  createdAt: Date;
  lastActivity: Date;
  nextActivity: Date | null;
  tags: string[];
  estValue: number;
}

const LEAD_STATUSES: LeadStatus[] = [
  "New", "Contacted", "Qualified", "Proposal", "Negotiation", "Converted", "Lost",
];

export const leads: Lead[] = Array.from({ length: 112 }).map((_, i) => {
  const name = makePersonName();
  const companyName = makeCompanyName();
  const status = pick(LEAD_STATUSES);
  return {
    id: `ld_${i + 1}`,
    name,
    companyName,
    jobTitle: pick(JOB_TITLES),
    email: emailFor(name, domainFor(companyName)),
    phone: `+1 (${int(200, 989)}) ${int(200, 989)}-${int(1000, 9999)}`,
    status,
    source: pick(LEAD_SOURCES),
    score: int(12, 98),
    owner: pick(OWNERS),
    createdAt: daysAgo(int(1, 120)),
    lastActivity: daysAgo(int(0, 20)),
    nextActivity: rand() > 0.3 ? daysAgo(-int(1, 14)) : null,
    tags: pickN(TAGS_POOL, int(0, 2)),
    estValue: int(4_000, 180_000),
  };
});

export interface Deal {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  contactName: string;
  value: number;
  stage: DealStage;
  probability: number;
  owner: string;
  expectedClose: Date;
  priority: Priority;
  createdAt: Date;
}

const DEAL_STAGES: { stage: DealStage; probability: number }[] = [
  { stage: "New Lead", probability: 10 },
  { stage: "Qualified", probability: 30 },
  { stage: "Proposal", probability: 55 },
  { stage: "Negotiation", probability: 75 },
  { stage: "Won", probability: 100 },
  { stage: "Lost", probability: 0 },
];

export const deals: Deal[] = Array.from({ length: 64 }).map((_, i) => {
  const company = pick(companies);
  const stageDef = pick(DEAL_STAGES);
  const product = pick(PRODUCTS);
  return {
    id: `dl_${i + 1}`,
    name: `${company.name} – ${product.name}`,
    companyId: company.id,
    companyName: company.name,
    contactName: makePersonName(),
    value: int(8_000, 420_000),
    stage: stageDef.stage,
    probability: stageDef.probability + int(-5, 5),
    owner: pick(OWNERS),
    expectedClose: daysAgo(-int(1, 90)),
    priority: pick(["Low", "Medium", "High", "Urgent"] as const),
    createdAt: daysAgo(int(2, 150)),
  };
});

export interface ActivityItem {
  id: string;
  type: "deal" | "task" | "invoice" | "lead" | "note" | "call" | "email" | "meeting";
  message: string;
  actor: string;
  timestamp: Date;
}

function relativeMinutesAgo(min: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - min);
  return d;
}

export const activityFeed: ActivityItem[] = [
  { id: "ac_1", type: "deal", message: "created a new deal with Acme Corporation", actor: "John Smith", timestamp: relativeMinutesAgo(2) },
  { id: "ac_2", type: "deal", message: "moved Beta Manufacturing to Negotiation", actor: "Sarah Chen", timestamp: relativeMinutesAgo(12) },
  { id: "ac_3", type: "task", message: "completed a follow-up task", actor: "Sarah Chen", timestamp: relativeMinutesAgo(24) },
  { id: "ac_4", type: "invoice", message: "Invoice #INV-3021 was paid", actor: "System", timestamp: relativeMinutesAgo(58) },
  { id: "ac_5", type: "lead", message: "imported 14 new leads from Trade Show list", actor: "Priya Nair", timestamp: relativeMinutesAgo(96) },
  { id: "ac_6", type: "call", message: "logged a call with Summit Industries", actor: "Jordan Lee", timestamp: relativeMinutesAgo(140) },
  { id: "ac_7", type: "email", message: "sent a proposal to Global Industries", actor: "Maria Chen", timestamp: relativeMinutesAgo(210) },
  { id: "ac_8", type: "meeting", message: "scheduled a demo with Vertex Systems", actor: "Derek Osei", timestamp: relativeMinutesAgo(260) },
  { id: "ac_9", type: "note", message: "added a note to Redwood Logistics", actor: "Emma Rousseau", timestamp: relativeMinutesAgo(310) },
  { id: "ac_10", type: "deal", message: "won the deal with Ironclad Holdings", actor: "Noah Bennett", timestamp: relativeMinutesAgo(400) },
];

export interface NotificationItem {
  id: string;
  category: "Mentions" | "Tasks" | "Deals" | "Leads" | "System" | "Automations";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

export const notifications: NotificationItem[] = [
  { id: "nt_1", category: "Mentions", title: "Priya mentioned you", description: "in a comment on the Acme Corp deal", timestamp: relativeMinutesAgo(6), read: false },
  { id: "nt_2", category: "Deals", title: "Deal stage changed", description: "Beta Manufacturing moved to Negotiation", timestamp: relativeMinutesAgo(20), read: false },
  { id: "nt_3", category: "Tasks", title: "Task due soon", description: "Follow up with Summit Industries by 5:00 PM", timestamp: relativeMinutesAgo(45), read: false },
  { id: "nt_4", category: "Leads", title: "New high-score lead", description: "Vertex Systems scored 92 – assign an owner", timestamp: relativeMinutesAgo(80), read: true },
  { id: "nt_5", category: "System", title: "Weekly report ready", description: "Your sales performance report for last week is ready", timestamp: relativeMinutesAgo(180), read: true },
  { id: "nt_6", category: "Automations", title: "Workflow completed", description: "\"New Lead → Auto Assign\" ran successfully 12 times", timestamp: relativeMinutesAgo(320), read: true },
  { id: "nt_7", category: "Deals", title: "Deal won \u{1F389}", description: "Ironclad Holdings closed for $186,400", timestamp: relativeMinutesAgo(400), read: true },
];

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: Date;
  priority: Priority;
  status: "Todo" | "In Progress" | "Waiting" | "Completed";
  related?: string;
}

export const tasks: TaskItem[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `tk_${i + 1}`,
  title: pick([
    "Follow up on proposal", "Prepare contract draft", "Schedule renewal call",
    "Send onboarding materials", "Review pricing request", "Confirm PO details",
    "Send meeting recap", "Update forecast notes", "Qualify inbound lead",
    "Coordinate demo logistics",
  ]),
  assignee: pick(OWNERS),
  dueDate: daysAgo(-int(-3, 10)),
  priority: pick(["Low", "Medium", "High", "Urgent"] as const),
  status: pick(["Todo", "In Progress", "Waiting", "Completed"] as const),
  related: rand() > 0.4 ? pick(companies).name : undefined,
}));

// ---- Dashboard aggregate series ----
export const revenueSeries = (() => {
  const days = 30;
  let revenue = 62000;
  let pipeline = 140000;
  return Array.from({ length: days }).map((_, i) => {
    revenue += int(-4000, 9000);
    pipeline += int(-6000, 12000);
    const d = new Date();
    d.setDate(d.getDate() - (days - i));
    return {
      date: d.toISOString().slice(5, 10),
      revenue: Math.max(20000, revenue),
      dealsWon: int(2, 14),
      dealsLost: int(0, 6),
      pipeline: Math.max(60000, pipeline),
    };
  });
})();

export const salesFunnel = [
  { stage: "Leads", value: 1842, rate: 100 },
  { stage: "Qualified", value: 1024, rate: 55.6 },
  { stage: "Proposal", value: 512, rate: 27.8 },
  { stage: "Negotiation", value: 268, rate: 14.5 },
  { stage: "Won", value: 158, rate: 8.6 },
];

export const revenueBySource = [
  { source: "Organic", value: 890000 },
  { source: "Referral", value: 640000 },
  { source: "Paid Ads", value: 520000 },
  { source: "Social", value: 310000 },
  { source: "Email", value: 260000 },
  { source: "Partners", value: 380000 },
];

export const topProducts = PRODUCTS.slice(0, 5).map((p, i) => ({
  name: p.name,
  revenue: [245000, 159000, 142000, 118000, 96000][i],
}));

export const topCustomers = pickN(companies, 12).map((c) => ({
  id: c.id,
  customer: makePersonName(),
  company: c.name,
  revenue: int(24000, 480000),
  deals: int(1, 9),
  lastActivity: daysAgo(int(0, 30)),
  owner: c.owner,
  status: pick(["Active", "Active", "At Risk", "Churned"] as const),
}));

export const kpis = [
  { key: "revenue", label: "Revenue", value: 2_450_000, format: "currency", change: 12.5, spark: [40, 45, 42, 50, 55, 60, 58, 66, 70, 72] },
  { key: "deals", label: "Deals", value: 1842, format: "number", change: 8.3, spark: [30, 32, 35, 33, 38, 40, 42, 45, 44, 48] },
  { key: "pipeline", label: "Pipeline Value", value: 4_800_000, format: "currency", change: 15.7, spark: [50, 52, 55, 58, 60, 64, 66, 70, 74, 78] },
  { key: "conversion", label: "Conversion Rate", value: 24.8, format: "percent", change: 4.2, spark: [20, 21, 22, 21, 23, 24, 23, 24, 25, 24.8] },
  { key: "customers", label: "New Customers", value: 324, format: "number", change: 12.1, spark: [22, 24, 23, 26, 28, 27, 30, 32, 31, 34] },
  { key: "clv", label: "Customer Lifetime Value", value: 8420, format: "currency", change: 6.5, spark: [70, 71, 73, 72, 75, 76, 78, 80, 79, 82] },
];

export const recentOrders = [
  { id: "ORD-10421", company: "Acme Corporation", amount: 12450, status: "Confirmed" },
  { id: "ORD-10420", company: "Global Industries", amount: 8975, status: "Processing" },
  { id: "ORD-10419", company: "Summit Supplies", amount: 6320, status: "Shipped" },
  { id: "ORD-10418", company: "Beta Manufacturing", amount: 9840, status: "Confirmed" },
];

// ---- Calendar events ----
export type CalendarEventType = "Meeting" | "Call" | "Task" | "Follow-up" | "Deadline";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: Date;
  time: string;
  withWhom?: string;
}

const EVENT_TYPES: CalendarEventType[] = ["Meeting", "Call", "Task", "Follow-up", "Deadline"];

export const calendarEvents: CalendarEvent[] = Array.from({ length: 46 }).map((_, i) => {
  const type = pick(EVENT_TYPES);
  const day = int(-10, 24);
  const hour = int(8, 17);
  return {
    id: `ev_${i + 1}`,
    title: pick([
      "Discovery call", "Product demo", "Contract review", "Renewal check-in",
      "Onboarding kickoff", "QBR", "Pricing discussion", "Follow-up email",
      "Proposal deadline", "Team sync", "Executive briefing", "Site visit",
    ]),
    type,
    date: daysAgo(-day),
    time: `${hour}:00`,
    withWhom: rand() > 0.3 ? pick(companies).name : undefined,
  };
});

// ---- Inbox / email data ----
export type MailFolder = "Inbox" | "Sent" | "Drafts" | "Starred" | "Archived";

export interface EmailMessage {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string[];
  timestamp: Date;
  folder: MailFolder;
  starred: boolean;
  read: boolean;
  attachments: string[];
}

const EMAIL_SUBJECTS = [
  "Re: Enterprise proposal follow-up",
  "Contract redlines attached",
  "Quick question about pricing tiers",
  "Renewal terms for next year",
  "Demo recap and next steps",
  "Invoice #INV-3021 receipt",
  "Onboarding kickoff — welcome!",
  "Can we move Thursday's call?",
  "Product roadmap questions",
  "Introduction: new account contact",
  "Signed order form",
  "Following up from the trade show",
];

const BODY_PARAGRAPHS = [
  "Thanks for the quick turnaround on this — really appreciate the detail in your last note.",
  "I looped in our procurement team so we can move this through approval faster on our end.",
  "Could you send over the updated pricing sheet reflecting the annual commitment discount?",
  "We're aligned internally on moving forward, just ironing out a couple of legal points.",
  "Let me know if a call this week works better than email for hashing out details.",
  "Attaching the notes from our last sync in case it's useful for your team.",
];

export const emails: EmailMessage[] = Array.from({ length: 42 }).map((_, i) => {
  const folder: MailFolder = pick(["Inbox", "Inbox", "Inbox", "Sent", "Drafts", "Archived"] as MailFolder[]);
  const person = pick(contacts);
  const subject = pick(EMAIL_SUBJECTS);
  return {
    id: `em_${i + 1}`,
    from: folder === "Sent" || folder === "Drafts" ? "You" : person.name,
    fromEmail: folder === "Sent" || folder === "Drafts" ? "alex.morgan@nimbuscrm.com" : person.email,
    subject,
    preview: pick(BODY_PARAGRAPHS),
    body: pickN(BODY_PARAGRAPHS, int(2, 4)),
    timestamp: daysAgo(int(0, 21)),
    folder,
    starred: rand() > 0.8,
    read: folder !== "Inbox" || rand() > 0.35,
    attachments: rand() > 0.7 ? ["Proposal.pdf"] : [],
  };
});

// ---- Report-specific series ----
export const repPerformance = OWNERS.map((owner) => ({
  label: owner.split(" ")[0],
  revenue: int(80_000, 620_000),
  deals: int(8, 42),
}));

export const dealVelocity = [
  { label: "New Lead", days: 3 },
  { label: "Qualified", days: 6 },
  { label: "Proposal", days: 9 },
  { label: "Negotiation", days: 12 },
  { label: "Won", days: 4 },
];

export const customerGrowth = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (11 - i));
  return {
    label: d.toLocaleDateString("en-US", { month: "short" }),
    new: int(18, 60),
    churned: int(2, 14),
  };
});

export const activityPerformance = Array.from({ length: 8 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (7 - i) * 4);
  return {
    label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    calls: int(20, 80),
    emails: int(40, 160),
    meetings: int(5, 25),
  };
});

export const leadConversionSeries = Array.from({ length: 8 }).map((_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (7 - i));
  return { label: d.toLocaleDateString("en-US", { month: "short" }), rate: Number((int(180, 320) / 10).toFixed(1)) };
});

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------
export interface AuditLogEntry {
  id: string;
  actor: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entity: string;
  timestamp: Date;
  ip: string;
  severity: "info" | "warning" | "critical";
}

const AUDIT_ACTIONS = [
  { action: "Created", entityType: "Lead", severity: "info" as const },
  { action: "Updated", entityType: "Lead", severity: "info" as const },
  { action: "Deleted", entityType: "Lead", severity: "warning" as const },
  { action: "Created", entityType: "Contact", severity: "info" as const },
  { action: "Updated", entityType: "Contact", severity: "info" as const },
  { action: "Created", entityType: "Company", severity: "info" as const },
  { action: "Updated", entityType: "Deal", severity: "info" as const },
  { action: "Moved stage", entityType: "Deal", severity: "info" as const },
  { action: "Closed won", entityType: "Deal", severity: "info" as const },
  { action: "Closed lost", entityType: "Deal", severity: "warning" as const },
  { action: "Deleted", entityType: "Deal", severity: "warning" as const },
  { action: "Assigned", entityType: "Task", severity: "info" as const },
  { action: "Completed", entityType: "Task", severity: "info" as const },
  { action: "Sent", entityType: "Email", severity: "info" as const },
  { action: "Logged in", entityType: "Session", severity: "info" as const },
  { action: "Failed login", entityType: "Session", severity: "critical" as const },
  { action: "Changed permissions", entityType: "Role", severity: "critical" as const },
  { action: "Created", entityType: "User", severity: "warning" as const },
  { action: "Deactivated", entityType: "User", severity: "critical" as const },
  { action: "Exported data", entityType: "Report", severity: "warning" as const },
  { action: "Updated", entityType: "Custom Field", severity: "info" as const },
  { action: "Enabled", entityType: "Workflow", severity: "info" as const },
  { action: "Disabled", entityType: "Workflow", severity: "warning" as const },
  { action: "Updated", entityType: "Billing", severity: "critical" as const },
];

function randomIp() {
  return `${int(10, 250)}.${int(0, 255)}.${int(0, 255)}.${int(1, 254)}`;
}

export const auditLogs: AuditLogEntry[] = Array.from({ length: 180 }).map((_, i) => {
  const entry = pick(AUDIT_ACTIONS);
  const person = pick(contacts);
  const actorName = i % 6 === 0 ? "System" : makePersonName();
  return {
    id: `AUD-${(10500 + i).toString()}`,
    actor: actorName,
    actorEmail: actorName === "System" ? "system@crmapp.io" : emailFor(actorName, "crmapp.io"),
    action: entry.action,
    entityType: entry.entityType,
    entity:
      entry.entityType === "Deal" || entry.entityType === "Lead"
        ? `${pick(COMPANY_PREFIX)} ${pick(COMPANY_SUFFIX)} — ${entry.entityType}`
        : entry.entityType === "Session" || entry.entityType === "User"
          ? person?.name ?? makePersonName()
          : `${entry.entityType} #${int(1000, 9999)}`,
    timestamp: daysAgo(int(0, 90)),
    ip: randomIp(),
    severity: entry.severity,
  };
}).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
