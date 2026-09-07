import { TeamTasksPageClient } from "@/components/tasks/team-tasks-page-client";
import { getTasks } from "@/lib/actions/tasks";

export const dynamic = "force-dynamic";

export default async function TeamTasksPage() {
  const tasks = await getTasks();
  return <TeamTasksPageClient tasks={tasks} />;
}
