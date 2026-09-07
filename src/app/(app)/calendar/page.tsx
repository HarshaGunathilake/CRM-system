"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView } from "@/components/calendar/week-view";
import { DayView } from "@/components/calendar/day-view";
import { AgendaView } from "@/components/calendar/agenda-view";
import { CreateEventDialog } from "@/components/calendar/create-event-dialog";
import { calendarEvents } from "@/lib/mock/data";

export default function CalendarPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  // eslint-disable-next-line react-hooks/purity
  const agendaCutoff = React.useMemo(() => Date.now() - 86400000, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calendar"
        description="Meetings, calls, follow-ups, and deadlines in one place."
        actions={
          <Button size="sm" onClick={() => { setSelectedDate(undefined); setDialogOpen(true); }}>
            <Plus className="size-3.5" /> New event
          </Button>
        }
      />

      <Tabs defaultValue="month">
        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
        </TabsList>
        <TabsContent value="month">
          <Card className="p-4">
            <MonthView
              events={calendarEvents}
              onDayClick={(d) => { setSelectedDate(d); setDialogOpen(true); }}
            />
          </Card>
        </TabsContent>
        <TabsContent value="week">
          <Card className="p-4"><WeekView events={calendarEvents} /></Card>
        </TabsContent>
        <TabsContent value="day">
          <Card className="p-4"><DayView events={calendarEvents} /></Card>
        </TabsContent>
        <TabsContent value="agenda">
          <AgendaView events={calendarEvents.filter((e) => e.date.getTime() >= agendaCutoff)} />
        </TabsContent>
      </Tabs>

      <CreateEventDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultDate={selectedDate} />
    </div>
  );
}
