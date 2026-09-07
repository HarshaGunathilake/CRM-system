"use client";

import { Plus, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { companyColumns } from "@/components/companies/company-columns";
import { useDrawer } from "@/components/providers/drawer-provider";
import type { Company } from "@/lib/mock/data";

export function CompaniesPageClient({ companies }: { companies: Company[] }) {
  const { openDrawer } = useDrawer();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Companies"
        description={`${companies.length} companies across your workspace`}
        actions={
          <>
            <Button variant="outline" size="sm"><Upload className="size-3.5" /> Import</Button>
            <Button size="sm" onClick={() => openDrawer("company")}><Plus className="size-3.5" /> New company</Button>
          </>
        }
      />
      <DataTable columns={companyColumns} data={companies} searchKey="name" searchPlaceholder="Search companies..." />
    </div>
  );
}
