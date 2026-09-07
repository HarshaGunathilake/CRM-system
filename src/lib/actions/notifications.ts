"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { notifications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import type { NotificationItem } from "@/lib/mock/data";
import type { ActionResult } from "./leads";

type NotificationRow = typeof notifications.$inferSelect;

const CATEGORY_FROM_DB: Record<string, NotificationItem["category"]> = {
  MENTIONS: "Mentions", TASKS: "Tasks", DEALS: "Deals", LEADS: "Leads", SYSTEM: "System", AUTOMATIONS: "Automations",
};

function toUiNotification(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    category: CATEGORY_FROM_DB[row.category] ?? "System",
    title: row.title,
    description: row.description,
    timestamp: row.createdAt,
    read: row.read,
  };
}

export async function getMyNotifications(): Promise<NotificationItem[]> {
  const session = await getSession();
  if (!session) return [];
  const rows = await db.query.notifications.findMany({
    where: eq(notifications.userId, session.userId),
    orderBy: [desc(notifications.createdAt)],
    limit: 50,
  });
  return rows.map(toUiNotification);
}

export async function markNotificationReadAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, session.userId)));
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, session.userId));
  revalidatePath("/dashboard");
  return { ok: true };
}
