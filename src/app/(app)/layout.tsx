import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth/session";
import { getMyNotifications } from "@/lib/actions/notifications";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  const initialNotifications = await getMyNotifications();
  return (
    <AppShell
      user={{
        name: session.name,
        email: session.email,
        role: session.role,
        avatarUrl: session.avatarUrl,
      }}
      initialNotifications={initialNotifications}
    >
      {children}
    </AppShell>
  );
}
