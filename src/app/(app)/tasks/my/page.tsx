import { MyTasksPageClient } from "@/components/tasks/my-tasks-page-client";
import { getTasks } from "@/lib/actions/tasks";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function MyTasksPage() {
  const [tasks, session] = await Promise.all([getTasks(), getSession()]);
  const myTasks = session ? tasks.filter((t) => t.assignee === session.name) : tasks;
  return <MyTasksPageClient tasks={myTasks} />;
}
