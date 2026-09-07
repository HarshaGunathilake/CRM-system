import { notFound } from "next/navigation";
import { Mail, Phone, MessageSquare, Handshake, FileText, Tag, Building2, MapPin } from "lucide-react";
import { DetailHeader } from "@/components/shared/detail-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getContactById } from "@/lib/actions/contacts";
import { getDeals } from "@/lib/actions/deals";
import { AttachmentsPanel } from "@/components/shared/attachments-panel";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getContactById(id);
  if (!contact) notFound();

  const allDeals = await getDeals();
  const relatedDeals = allDeals.filter((d) => d.companyId === contact.companyId);

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/contacts"
        backLabel="Back to contacts"
        name={contact.name}
        subtitle={`${contact.jobTitle} at ${contact.companyName}`}
        status={contact.status}
        statusVariant={contact.status === "Active" ? "success" : contact.status === "Lead" ? "secondary" : "muted"}
        actions={
          <>
            <Button variant="outline" size="sm"><Mail className="size-3.5" /> Email</Button>
            <Button variant="outline" size="sm"><Phone className="size-3.5" /> Call</Button>
            <Button variant="outline" size="sm"><MessageSquare className="size-3.5" /> Message</Button>
            <Button size="sm"><Handshake className="size-3.5" /> Create deal</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="pt-5">
            <Tabs defaultValue="overview">
              <TabsList className="flex-wrap">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Mail} label="Email" value={contact.email} />
                <InfoRow icon={Phone} label="Phone" value={contact.phone} />
                <InfoRow icon={Building2} label="Company" value={contact.companyName} />
                <InfoRow icon={MapPin} label="Location" value={contact.location} />
                <div className="sm:col-span-2">
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.length ? contact.tags.map((t) => (
                      <Badge key={t} variant="outline"><Tag className="size-3" />{t}</Badge>
                    )) : <span className="text-sm text-muted-foreground">No tags yet</span>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <EmptyTab icon={FileText} message="Full activity timeline for this contact will appear here." />
              </TabsContent>
              <TabsContent value="activities">
                <EmptyTab icon={MessageSquare} message="No logged activities yet." />
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
                ) : (
                  <EmptyTab icon={Handshake} message="No deals associated with this contact yet." />
                )}
              </TabsContent>
              <TabsContent value="emails">
                <EmptyTab icon={Mail} message="No emails logged with this contact yet." />
              </TabsContent>
              <TabsContent value="notes">
                <EmptyTab icon={MessageSquare} message="No notes yet." />
              </TabsContent>
              <TabsContent value="files">
                <AttachmentsPanel contactId={contact.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0 text-sm">
            <DetailRow label="Owner" value={contact.owner} />
            <Separator />
            <DetailRow label="Last activity" value={contact.lastActivity.toLocaleDateString()} />
            <Separator />
            <DetailRow label="Status" value={contact.status} />
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
