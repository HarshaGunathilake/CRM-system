import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_MANAGER",
  "SALES_REP",
  "SUPPORT_AGENT",
  "VIEWER",
]);

export const contactStatusEnum = pgEnum("contact_status", ["ACTIVE", "INACTIVE", "LEAD"]);

export const leadStatusEnum = pgEnum("lead_status", [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "CONVERTED",
  "LOST",
]);

export const dealStageEnum = pgEnum("deal_stage", [
  "NEW_LEAD",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
]);

export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const taskStatusEnum = pgEnum("task_status", ["TODO", "IN_PROGRESS", "WAITING", "COMPLETED"]);

export const notificationCategoryEnum = pgEnum("notification_category", [
  "MENTIONS",
  "TASKS",
  "DEALS",
  "LEADS",
  "SYSTEM",
  "AUTOMATIONS",
]);

export const auditSeverityEnum = pgEnum("audit_severity", ["INFO", "WARNING", "CRITICAL"]);

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => createId());

// ---------------------------------------------------------------------------
// Users / auth
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("SALES_REP"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

export const companies = pgTable("companies", {
  id: id(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  employees: integer("employees").notNull().default(0),
  annualRevenue: integer("annual_revenue").notNull().default(0),
  location: text("location").notNull(),
  website: text("website").notNull(),
  totalRevenue: integer("total_revenue").notNull().default(0),
  logoLetter: text("logo_letter").notNull(),
  ownerId: text("owner_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export const contacts = pgTable("contacts", {
  id: id(),
  name: text("name").notNull(),
  jobTitle: text("job_title").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  status: contactStatusEnum("status").notNull().default("ACTIVE"),
  tags: text("tags").array().notNull().default([]),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
  companyId: text("company_id").references(() => companies.id, { onDelete: "set null" }),
  ownerId: text("owner_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export const leads = pgTable("leads", {
  id: id(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  jobTitle: text("job_title").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: leadStatusEnum("status").notNull().default("NEW"),
  source: text("source").notNull(),
  score: integer("score").notNull().default(50),
  estValue: integer("est_value").notNull().default(0),
  tags: text("tags").array().notNull().default([]),
  nextActivity: timestamp("next_activity"),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
  ownerId: text("owner_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------

export const deals = pgTable("deals", {
  id: id(),
  name: text("name").notNull(),
  contactName: text("contact_name").notNull(),
  value: integer("value").notNull().default(0),
  stage: dealStageEnum("stage").notNull().default("NEW_LEAD"),
  probability: integer("probability").notNull().default(10),
  priority: priorityEnum("priority").notNull().default("MEDIUM"),
  expectedClose: timestamp("expected_close").notNull(),
  companyId: text("company_id").references(() => companies.id, { onDelete: "set null" }),
  ownerId: text("owner_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const tasks = pgTable("tasks", {
  id: id(),
  title: text("title").notNull(),
  dueDate: timestamp("due_date").notNull(),
  priority: priorityEnum("priority").notNull().default("MEDIUM"),
  status: taskStatusEnum("status").notNull().default("TODO"),
  related: text("related"),
  assigneeId: text("assignee_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notifications = pgTable(
  "notifications",
  {
    id: id(),
    category: notificationCategoryEnum("category").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    read: boolean("read").notNull().default(false),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("notifications_user_read_idx").on(t.userId, t.read)]
);

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entity: text("entity").notNull(),
    ip: text("ip"),
    severity: auditSeverityEnum("severity").notNull().default("INFO"),
    actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("audit_logs_created_at_idx").on(t.createdAt)]
);

// ---------------------------------------------------------------------------
// Attachments
// ---------------------------------------------------------------------------

export const attachments = pgTable("attachments", {
  id: id(),
  fileName: text("file_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  uploaderId: text("uploader_id").references(() => users.id, { onDelete: "set null" }),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }),
  contactId: text("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
  dealId: text("deal_id").references(() => deals.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Relations (for query-builder `with` support)
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  ownedCompanies: many(companies),
  ownedContacts: many(contacts),
  ownedLeads: many(leads),
  ownedDeals: many(deals),
  assignedTasks: many(tasks),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  attachments: many(attachments),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, { fields: [companies.ownerId], references: [users.id] }),
  contacts: many(contacts),
  deals: many(deals),
  attachments: many(attachments),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  company: one(companies, { fields: [contacts.companyId], references: [companies.id] }),
  owner: one(users, { fields: [contacts.ownerId], references: [users.id] }),
  attachments: many(attachments),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  owner: one(users, { fields: [leads.ownerId], references: [users.id] }),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  company: one(companies, { fields: [deals.companyId], references: [companies.id] }),
  owner: one(users, { fields: [deals.ownerId], references: [users.id] }),
  attachments: many(attachments),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, { fields: [auditLogs.actorId], references: [users.id] }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  uploader: one(users, { fields: [attachments.uploaderId], references: [users.id] }),
  company: one(companies, { fields: [attachments.companyId], references: [companies.id] }),
  contact: one(contacts, { fields: [attachments.contactId], references: [contacts.id] }),
  deal: one(deals, { fields: [attachments.dealId], references: [deals.id] }),
}));
