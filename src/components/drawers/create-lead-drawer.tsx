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
import { createLeadAction } from "@/lib/actions/leads";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  companyName: z.string().min(2, "Company is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  source: z.string().min(1, "Pick a source"),
  status: z.string().min(1, "Pick a status"),
  estValue: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateLeadDrawer() {
  const { open, closeDrawer } = useDrawer();
  const router = useRouter();
  const isOpen = open === "lead";
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { source: "Website", status: "New" } });

  const onSubmit = async (values: FormValues) => {
    const result = await createLeadAction(values);
    if (!result.ok) {
      toast.error("Could not create lead", { description: result.error });
      return;
    }
    toast.success("Lead created", { description: `${values.name} at ${values.companyName}` });
    reset();
    closeDrawer();
    router.refresh();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeDrawer()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create lead</SheetTitle>
          <SheetDescription>Add a new lead to your pipeline.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5">
          <div className="grid gap-1.5">
            <Label htmlFor="lead-name">Full name</Label>
            <Input id="lead-name" placeholder="Jordan Blake" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-company">Company</Label>
            <Input id="lead-company" placeholder="Acme Corporation" {...register("companyName")} />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="lead-email">Email</Label>
              <Input id="lead-email" placeholder="jordan@acme.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input id="lead-phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Source</Label>
              <Select defaultValue={watch("source")} onValueChange={(v) => setValue("source", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Website", "Referral", "Trade Show", "Cold Call", "LinkedIn", "Webinar", "Partner"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select defaultValue={watch("status")} onValueChange={(v) => setValue("status", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["New", "Contacted", "Qualified", "Proposal", "Negotiation"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-value">Estimated value ($)</Label>
            <Input id="lead-value" type="number" placeholder="15000" {...register("estValue")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lead-notes">Notes</Label>
            <Textarea id="lead-notes" placeholder="Any context about this lead..." {...register("notes")} />
          </div>
        </form>
        <SheetFooter className="flex-row justify-end border-t border-border pt-4">
          <Button variant="outline" onClick={closeDrawer} type="button">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create lead"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
