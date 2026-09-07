import { notFound } from "next/navigation";
import { Globe, MapPin, Users, Handshake, Mail, FileText, MessageSquare, Building2 } from "lucide-react";
import { DetailHeader } from "@/components/shared/detail-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCompanyById } from "@/lib/actions/companies";
import { getContacts } from "@/lib/actions/contacts";
import { getDeals } from "@/lib/actions/deals";
import { formatCurrency, formatCompactNumber, initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) notFound();

  const [allContacts, allDeals] = await Promise.all([getContacts(), getDeals()]);
  const relatedContacts = allContacts.filter((c) => c.companyId === company.id);
  const relatedDeals = allDeals.filter((d) => d.companyId === company.id);

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/companies"
        backLabel="Back to companies"
        name={company.name}
        subtitle={`${company.industry} · ${company.location}`}
        actions={
          <>
            <Button variant="outline" size="sm"><Mail className="size-3.5" /> Log activity</Button>
            <Button size="sm"><Handshake className="size-3.5" /> New deal</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="pt-5">
            <Tabs defaultValue="overview">
              <TabsList className="flex-wrap">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Globe} label="Website" value={company.website} />
                <InfoRow icon={MapPin} label="Location" value={company.location} />
                <InfoRow icon={Users} label="Employees" value={formatCompactNumber(company.employees)} />
                <InfoRow icon={Building2} label="Industry" value={company.industry} />
              </TabsContent>

              <TabsContent value="contacts">
                {relatedContacts.length ? (
                  <div className="flex flex-col gap-2">
                    {relatedContacts.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                        <Avatar className="size-8"><AvatarFallback className="text-xs">{initials(c.name)}</AvatarFallback></Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{c.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{c.jobTitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyTab icon={Users} message="No contacts linked to this company yet." />}
              </TabsContent>

              <TabsContent value="deals">
                {relatedDeals.length ? (
                  <div className="flex flex-col gap-2">
                    {relatedDeals.map((d) => (
                      <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div>
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.stage} · {d.probability}% probability</p>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(d.value)}</span>
                      </div>
                    ))}
                  </div>
                ) : <EmptyTab icon={Handshake} message="No open deals for this company." />}
              </TabsContent>

              <TabsContent value="activities">
                <EmptyTab icon={MessageSquare} message="No activities logged yet." />
              </TabsContent>
              <TabsContent value="notes">
                <EmptyTab icon={FileText} message="No notes yet." />
              </TabsContent>
              <TabsContent value="timeline">
                <EmptyTab icon={FileText} message="Timeline will appear here as activity happens." />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-sm">Account details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0 text-sm">
            <DetailRow label="Owner" value={company.owner} />
            <Separator />
            <DetailRow label="Annual revenue" value={formatCurrency(company.annualRevenue, true)} />
            <Separator />
            <DetailRow label="Total revenue" value={formatCurrency(company.totalRevenue)} />
            <Separator />
            <DetailRow label="Open deals" value={String(company.openDeals)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function EmptyTab({ icon: Icon, message }: { icon: React.ComponentType<{ className?: string }>; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
