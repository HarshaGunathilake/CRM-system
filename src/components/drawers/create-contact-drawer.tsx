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
import { useDrawer } from "@/components/providers/drawer-provider";
import { useRouter } from "next/navigation";
import { createContactAction } from "@/lib/actions/contacts";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  jobTitle: z.string().optional(),
  companyName: z.string().min(2, "Company is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateContactDrawer() {
  const { open, closeDrawer } = useDrawer();
  const router = useRouter();
  const isOpen = open === "contact";
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createContactAction(values);
    if (!result.ok) {
      toast.error("Could not add contact", { description: result.error });
      return;
    }
    toast.success("Contact added", { description: `${values.name} · ${values.companyName}` });
    reset();
    closeDrawer();
    router.refresh();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeDrawer()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add contact</SheetTitle>
          <SheetDescription>Create a new contact record.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5">
          <div className="grid gap-1.5">
            <Label htmlFor="ct-name">Full name</Label>
            <Input id="ct-name" placeholder="Taylor Reed" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ct-title">Job title</Label>
            <Input id="ct-title" placeholder="VP of Operations" {...register("jobTitle")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ct-company">Company</Label>
            <Input id="ct-company" placeholder="Summit Industries" {...register("companyName")} />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ct-email">Email</Label>
              <Input id="ct-email" placeholder="taylor@summit.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ct-phone">Phone</Label>
              <Input id="ct-phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ct-location">Location</Label>
            <Input id="ct-location" placeholder="Austin, TX" {...register("location")} />
          </div>
        </form>
        <SheetFooter className="flex-row justify-end border-t border-border pt-4">
          <Button variant="outline" onClick={closeDrawer} type="button">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add contact"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
