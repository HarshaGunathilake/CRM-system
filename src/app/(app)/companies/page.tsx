import { CompaniesPageClient } from "@/components/companies/companies-page-client";
import { getCompanies } from "@/lib/actions/companies";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await getCompanies();
  return <CompaniesPageClient companies={companies} />;
}
