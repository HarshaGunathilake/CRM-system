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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useDrawer } from "@/components/providers/drawer-provider";
import { useRouter } from "next/navigation";
import { createDealAction } from "@/lib/actions/deals";

const schema = z.object({
  name: z.string().min(2, "Deal name is required"),
  companyName: z.string().min(2, "Company is required"),
  value: z.string().min(1, "Enter a value"),
  stage: z.string().min(1),
  priority: z.string().min(1),
  expectedClose: z.string().min(1, "Pick a date"),
});

type FormValues = z.infer<typeof schema>;

export function CreateDealDrawer() {
  const { open, closeDrawer } = useDrawer();
  const router = useRouter();
  const isOpen = open === "deal";
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { stage: "New Lead", priority: "Medium" },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createDealAction(values);
    if (!result.ok) {
      toast.error("Could not create deal", { description: result.error });
      return;
    }
    toast.success("Deal created", { description: `${values.name} — $${Number(values.value).toLocaleString()}` });
    reset();
    closeDrawer();
    router.refresh();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeDrawer()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create deal</SheetTitle>
          <SheetDescription>Add a new opportunity to your pipeline.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5">
          <div className="grid gap-1.5">
            <Label htmlFor="dl-name">Deal name</Label>
            <Input id="dl-name" placeholder="Acme Corp – Enterprise License" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dl-company">Company</Label>
            <Input id="dl-company" placeholder="Acme Corporation" {...register("companyName")} />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="dl-value">Value ($)</Label>
              <Input id="dl-value" type="number" placeholder="42000" {...register("value")} />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="dl-close">Expected close</Label>
              <Input id="dl-close" type="date" {...register("expectedClose")} />
              {errors.expectedClose && <p className="text-xs text-destructive">{errors.expectedClose.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Stage</Label>
              <Select defaultValue={watch("stage")} onValueChange={(v) => setValue("stage", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["New Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
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
        </form>
        <SheetFooter className="flex-row justify-end border-t border-border pt-4">
          <Button variant="outline" onClick={closeDrawer} type="button">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create deal"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
