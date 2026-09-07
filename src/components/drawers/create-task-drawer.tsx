"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useDrawer } from "@/components/providers/drawer-provider";
import { useRouter } from "next/navigation";
import { createTaskAction } from "@/lib/actions/tasks";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  assignee: z.string().min(1),
  priority: z.string().min(1),
  dueDate: z.string().min(1, "Pick a due date"),
});

type FormValues = z.infer<typeof schema>;

const OWNERS = ["Alex Morgan", "Priya Nair", "Jordan Lee", "Sam Whitfield", "Maria Chen", "Derek Osei"];

export function CreateTaskDrawer() {
  const { open, closeDrawer } = useDrawer();
  const router = useRouter();
  const isOpen = open === "task";
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { assignee: "Alex Morgan", priority: "Medium" },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createTaskAction(values);
    if (!result.ok) {
      toast.error("Could not create task", { description: result.error });
      return;
    }
    toast.success("Task created", { description: values.title });
    reset();
    closeDrawer();
    router.refresh();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeDrawer()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create task</SheetTitle>
          <SheetDescription>Add a task and assign it to your team.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5">
          <div className="grid gap-1.5">
            <Label htmlFor="tk-title">Title</Label>
            <Input id="tk-title" placeholder="Follow up on proposal" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tk-desc">Description</Label>
            <Textarea id="tk-desc" placeholder="Add more detail..." {...register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Assignee</Label>
              <Select defaultValue={watch("assignee")} onValueChange={(v) => setValue("assignee", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OWNERS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select defaultValue={watch("priority")} onValueChange={(v) => setValue("priority", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High", "Urgent"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tk-due">Due date</Label>
            <Input id="tk-due" type="date" {...register("dueDate")} />
            {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
          </div>
        </form>
        <SheetFooter className="flex-row justify-end border-t border-border pt-4">
          <Button variant="outline" onClick={closeDrawer} type="button">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create task"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
