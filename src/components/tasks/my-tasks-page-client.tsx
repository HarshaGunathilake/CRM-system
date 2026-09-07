"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskList } from "@/components/tasks/task-list";
import { TaskKanban } from "@/components/tasks/task-kanban";
import { MonthView } from "@/components/calendar/month-view";
import { useDrawer } from "@/components/providers/drawer-provider";
import { calendarEvents } from "@/lib/mock/data";
import type { TaskItem } from "@/lib/mock/data";

export function MyTasksPageClient({ tasks }: { tasks: TaskItem[] }) {
  const { openDrawer } = useDrawer();
  const events = calendarEvents.filter((_, i) => i % 3 === 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Tasks"
        description={`${tasks.length} tasks assigned to you`}
        actions={<Button size="sm" onClick={() => openDrawer("task")}><Plus className="size-3.5" /> New task</Button>}
      />
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="list"><TaskList tasks={tasks} /></TabsContent>
        <TabsContent value="kanban"><TaskKanban tasks={tasks} /></TabsContent>
        <TabsContent value="calendar"><MonthView events={events} /></TabsContent>
      </Tabs>
    </div>
  );
}
