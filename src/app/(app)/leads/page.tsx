import { LeadsPageClient } from "@/components/leads/leads-page-client";
import { getLeads } from "@/lib/actions/leads";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();
  return <LeadsPageClient leads={leads} />;
}
