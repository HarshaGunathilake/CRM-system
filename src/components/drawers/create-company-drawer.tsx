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
import { createCompanyAction } from "@/lib/actions/companies";

const schema = z.object({
  name: z.string().min(2, "Company name is required"),
  industry: z.string().optional(),
  website: z.string().optional(),
  employees: z.string().optional(),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateCompanyDrawer() {
  const { open, closeDrawer } = useDrawer();
  const router = useRouter();
  const isOpen = open === "company";
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createCompanyAction(values);
    if (!result.ok) {
      toast.error("Could not create company", { description: result.error });
      return;
    }
    toast.success("Company created", { description: values.name });
    reset();
    closeDrawer();
    router.refresh();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeDrawer()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create company</SheetTitle>
          <SheetDescription>Add a new company to your CRM.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5">
          <div className="grid gap-1.5">
            <Label htmlFor="co-name">Company name</Label>
            <Input id="co-name" placeholder="Redwood Logistics" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="co-industry">Industry</Label>
              <Input id="co-industry" placeholder="Logistics" {...register("industry")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="co-employees">Employees</Label>
              <Input id="co-employees" type="number" placeholder="240" {...register("employees")} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="co-website">Website</Label>
            <Input id="co-website" placeholder="www.redwoodlogistics.com" {...register("website")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="co-location">Location</Label>
            <Input id="co-location" placeholder="Portland, OR" {...register("location")} />
          </div>
        </form>
        <SheetFooter className="flex-row justify-end border-t border-border pt-4">
          <Button variant="outline" onClick={closeDrawer} type="button">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create company"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
