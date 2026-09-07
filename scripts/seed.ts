import "dotenv/config";
import { db } from "../src/lib/db/client";
import {
  users, companies, contacts, leads, deals, tasks, notifications, auditLogs,
} from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth/password";
import {
  companies as mockCompanies,
  contacts as mockContacts,
  leads as mockLeads,
  deals as mockDeals,
  tasks as mockTasks,
  notifications as mockNotifications,
  auditLogs as mockAuditLogs,
} from "../src/lib/mock/data";

const OWNER_NAMES = [
  "Alex Morgan", "Priya Nair", "Jordan Lee", "Sam Whitfield", "Maria Chen",
  "Derek Osei", "Emma Rousseau", "Noah Bennett",
];
const OWNER_ROLES = [
  "SUPER_ADMIN", "ADMIN", "SALES_MANAGER", "SALES_REP", "SALES_REP", "SALES_REP", "SUPPORT_AGENT", "VIEWER",
] as const;

const CONTACT_STATUS_MAP: Record<string, "ACTIVE" | "INACTIVE" | "LEAD"> = {
  Active: "ACTIVE", Inactive: "INACTIVE", Lead: "LEAD",
};
const LEAD_STATUS_MAP: Record<string, string> = {
  New: "NEW", Contacted: "CONTACTED", Qualified: "QUALIFIED", Proposal: "PROPOSAL",
  Negotiation: "NEGOTIATION", Converted: "CONVERTED", Lost: "LOST",
};
const DEAL_STAGE_MAP: Record<string, string> = {
  "New Lead": "NEW_LEAD", Qualified: "QUALIFIED", Proposal: "PROPOSAL",
  Negotiation: "NEGOTIATION", Won: "WON", Lost: "LOST",
};
const PRIORITY_MAP: Record<string, string> = { Low: "LOW", Medium: "MEDIUM", High: "HIGH", Urgent: "URGENT" };
const TASK_STATUS_MAP: Record<string, string> = {
  Todo: "TODO", "In Progress": "IN_PROGRESS", Waiting: "WAITING", Completed: "COMPLETED",
};
const NOTIF_CATEGORY_MAP: Record<string, string> = {
  Mentions: "MENTIONS", Tasks: "TASKS", Deals: "DEALS", Leads: "LEADS", System: "SYSTEM", Automations: "AUTOMATIONS",
};

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hashPassword("password123");
  const insertedUsers = await db
    .insert(users)
    .values(
      OWNER_NAMES.map((name, i) => ({
        name,
        email:
          i === 0
            ? "demo@nimbuscrm.com"
            : `${name.toLowerCase().replace(/\s+/g, ".")}@nimbuscrm.com`,
        passwordHash,
        role: OWNER_ROLES[i],
      }))
    )
    .returning();
  const userIdByName = new Map(insertedUsers.map((u) => [u.name, u.id]));
  console.log(`  users: ${insertedUsers.length} (demo login: demo@nimbuscrm.com / password123)`);

  const insertedCompanies = await db
    .insert(companies)
    .values(
      mockCompanies.map((c) => ({
        name: c.name,
        industry: c.industry,
        employees: c.employees,
        annualRevenue: c.annualRevenue,
        location: c.location,
        website: c.website,
        totalRevenue: c.totalRevenue,
        logoLetter: c.logoLetter,
        ownerId: userIdByName.get(c.owner) ?? null,
      }))
    )
    .returning();
  const companyIdByMockId = new Map(mockCompanies.map((c, i) => [c.id, insertedCompanies[i].id]));
  const companyIdByName = new Map(insertedCompanies.map((c) => [c.name, c.id]));
  console.log(`  companies: ${insertedCompanies.length}`);

  const insertedContacts = await db
    .insert(contacts)
    .values(
      mockContacts.map((c) => ({
        name: c.name,
        jobTitle: c.jobTitle,
        email: c.email,
        phone: c.phone,
        location: c.location,
        status: CONTACT_STATUS_MAP[c.status] as "ACTIVE" | "INACTIVE" | "LEAD",
        tags: c.tags,
        lastActivity: c.lastActivity,
        companyId: companyIdByMockId.get(c.companyId) ?? null,
        ownerId: userIdByName.get(c.owner) ?? null,
      }))
    )
    .returning();
  console.log(`  contacts: ${insertedContacts.length}`);

  const insertedLeads = await db
    .insert(leads)
    .values(
      mockLeads.map((l) => ({
        name: l.name,
        companyName: l.companyName,
        jobTitle: l.jobTitle,
        email: l.email,
        phone: l.phone,
        status: LEAD_STATUS_MAP[l.status] as never,
        source: l.source,
        score: l.score,
        estValue: l.estValue,
        tags: l.tags,
        nextActivity: l.nextActivity,
        lastActivity: l.lastActivity,
        ownerId: userIdByName.get(l.owner) ?? null,
        createdAt: l.createdAt,
      }))
    )
    .returning();
  console.log(`  leads: ${insertedLeads.length}`);

  const insertedDeals = await db
    .insert(deals)
    .values(
      mockDeals.map((d) => ({
        name: d.name,
        contactName: d.contactName,
        value: d.value,
        stage: DEAL_STAGE_MAP[d.stage] as never,
        probability: d.probability,
        priority: PRIORITY_MAP[d.priority] as never,
        expectedClose: d.expectedClose,
        companyId: companyIdByMockId.get(d.companyId) ?? companyIdByName.get(d.companyName) ?? null,
        ownerId: userIdByName.get(d.owner) ?? null,
        createdAt: d.createdAt,
      }))
    )
    .returning();
  console.log(`  deals: ${insertedDeals.length}`);

  const insertedTasks = await db
    .insert(tasks)
    .values(
      mockTasks.map((t) => ({
        title: t.title,
        dueDate: t.dueDate,
        priority: PRIORITY_MAP[t.priority] as never,
        status: TASK_STATUS_MAP[t.status] as never,
        related: t.related ?? null,
        assigneeId: userIdByName.get(t.assignee) ?? null,
      }))
    )
    .returning();
  console.log(`  tasks: ${insertedTasks.length}`);

  const demoUserId = insertedUsers[0].id;
  const insertedNotifications = await db
    .insert(notifications)
    .values(
      mockNotifications.map((n) => ({
        category: NOTIF_CATEGORY_MAP[n.category] as never,
        title: n.title,
        description: n.description,
        read: n.read,
        userId: demoUserId,
        createdAt: n.timestamp,
      }))
    )
    .returning();
  console.log(`  notifications: ${insertedNotifications.length}`);

  const insertedAuditLogs = await db
    .insert(auditLogs)
    .values(
      mockAuditLogs.map((a) => ({
        action: a.action,
        entityType: a.entityType,
        entity: a.entity,
        ip: a.ip,
        severity: a.severity.toUpperCase() as never,
        actorId: a.actor === "System" ? null : userIdByName.get(a.actor) ?? null,
        createdAt: a.timestamp,
      }))
    )
    .returning();
  console.log(`  audit logs: ${insertedAuditLogs.length}`);

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
