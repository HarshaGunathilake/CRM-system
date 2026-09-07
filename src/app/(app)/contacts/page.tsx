import { ContactsPageClient } from "@/components/contacts/contacts-page-client";
import { getContacts } from "@/lib/actions/contacts";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await getContacts();
  return <ContactsPageClient contacts={contacts} />;
}
