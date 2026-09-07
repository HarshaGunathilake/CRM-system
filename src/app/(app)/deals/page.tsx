import { DealsPageClient } from "@/components/deals/deals-page-client";
import { getDeals } from "@/lib/actions/deals";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const deals = await getDeals();
  return <DealsPageClient deals={deals} />;
}
