"use server";

import { z } from "zod";
import { desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { tasks, users, notifications } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import type { TaskItem, Priority } from "@/lib/mock/data";
import type { ActionResult } from "./leads";

type TaskRow = typeof tasks.$inferSelect;

const PRIORITY_TO_DB: Record<string, TaskRow["priority"]> = {
  Low: "LOW", Medium: "MEDIUM", High: "HIGH", Urgent: "URGENT",
};
const PRIORITY_FROM_DB: Record<string, Priority> = {
  LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent",
};
const STATUS_FROM_DB: Record<string, TaskItem["status"]> = {
  TODO: "Todo", IN_PROGRESS: "In Progress", WAITING: "Waiting", COMPLETED: "Completed",
};

function toUiTask(row: TaskRow & { assigneeName?: string | null }): TaskItem {
  return {
    id: row.id,
    title: row.title,
    assignee: row.assigneeName ?? "Unassigned",
    dueDate: row.dueDate,
    priority: PRIORITY_FROM_DB[row.priority] ?? "Medium",
    status: STATUS_FROM_DB[row.status] ?? "Todo",
    related: row.related ?? undefined,
  };
}

export async function getTasks(): Promise<TaskItem[]> {
  const rows = await db.query.tasks.findMany({
    orderBy: [desc(tasks.createdAt)],
    with: { assignee: true },
  });
  return rows.map((r) => toUiTask({ ...r, assigneeName: r.assignee?.name }));
}

const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  assignee: z.string().min(1),
  priority: z.string().min(1),
  dueDate: z.string().min(1),
});

export async function createTaskAction(input: z.infer<typeof createTaskSchema>): Promise<ActionResult> {
  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const session = await getSession();
  const { title, assignee, priority, dueDate } = parsed.data;

  const assigneeUser = await db.query.users.findFirst({ where: ilike(users.name, assignee) });

  const [row] = await db
    .insert(tasks)
    .values({
      title,
      dueDate: new Date(dueDate),
      priority: PRIORITY_TO_DB[priority] ?? "MEDIUM",
      assigneeId: assigneeUser?.id ?? session?.userId,
    })
    .returning();

  await logAudit({ actorId: session?.userId, action: "Assigned", entityType: "Task", entity: row.title });
  if (row.assigneeId && row.assigneeId !== session?.userId) {
    await db.insert(notifications).values({
      category: "TASKS",
      title: "New task assigned",
      description: row.title,
      userId: row.assigneeId,
    });
  }
  revalidatePath("/tasks/my");
  revalidatePath("/tasks/team");
  return { ok: true };
}

export async function updateTaskStatusAction(id: string, status: TaskItem["status"]): Promise<ActionResult> {
  const session = await getSession();
  const STATUS_TO_DB: Record<TaskItem["status"], TaskRow["status"]> = {
    Todo: "TODO", "In Progress": "IN_PROGRESS", Waiting: "WAITING", Completed: "COMPLETED",
  };
  const [row] = await db.update(tasks).set({ status: STATUS_TO_DB[status], updatedAt: new Date() }).where(eq(tasks.id, id)).returning();
  if (!row) return { ok: false, error: "Task not found" };
  await logAudit({
    actorId: session?.userId,
    action: status === "Completed" ? "Completed" : "Updated",
    entityType: "Task",
    entity: row.title,
  });
  revalidatePath("/tasks/my");
  revalidatePath("/tasks/team");
  return { ok: true };
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  const row = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  if (!row) return { ok: false, error: "Task not found" };
  await db.delete(tasks).where(eq(tasks.id, id));
  await logAudit({ actorId: session?.userId, action: "Deleted", entityType: "Task", entity: row.title, severity: "WARNING" });
  revalidatePath("/tasks/my");
  revalidatePath("/tasks/team");
  return { ok: true };
}
