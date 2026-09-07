import { notFound } from "next/navigation";
import { Mail, Phone, MessageSquare, CheckSquare, Handshake, Tag } from "lucide-react";
import { DetailHeader } from "@/components/shared/detail-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeadScoreGauge } from "@/components/leads/lead-score-gauge";
import { activityFeed } from "@/lib/mock/data";
import { getLeadById } from "@/lib/actions/leads";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "muted"> = {
  New: "secondary", Contacted: "default", Qualified: "default",
  Proposal: "warning", Negotiation: "warning", Converted: "success", Lost: "destructive",
};

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/leads"
        backLabel="Back to leads"
        name={lead.name}
        subtitle={`${lead.jobTitle} at ${lead.companyName}`}
        status={lead.status}
        statusVariant={STATUS_VARIANT[lead.status]}
        actions={
          <>
            <Button variant="outline" size="sm"><Mail className="size-3.5" /> Email</Button>
            <Button variant="outline" size="sm"><Phone className="size-3.5" /> Call</Button>
            <Button size="sm"><Handshake className="size-3.5" /> Convert to deal</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="pt-5">
            <Tabs defaultValue="overview">
              <TabsList className="flex-wrap">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="calls">Calls</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Email" value={lead.email} />
                <InfoRow label="Phone" value={lead.phone} />
                <InfoRow label="Source" value={lead.source} />
                <InfoRow label="Owner" value={lead.owner} />
                <InfoRow label="Estimated value" value={`$${lead.estValue.toLocaleString()}`} />
                <InfoRow label="Created" value={lead.createdAt.toLocaleDateString()} />
                <div className="sm:col-span-2">
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.length ? lead.tags.map((t) => (
                      <Badge key={t} variant="outline"><Tag className="size-3" />{t}</Badge>
                    )) : <span className="text-sm text-muted-foreground">No tags yet</span>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities">
                <ActivityFeed />
              </TabsContent>

              <TabsContent value="notes">
                <EmptyTab icon={MessageSquare} message="No notes yet. Add the first note about this lead." />
              </TabsContent>

              <TabsContent value="emails">
                <EmptyTab icon={Mail} message="No emails logged with this lead yet." />
              </TabsContent>

              <TabsContent value="calls">
                <EmptyTab icon={Phone} message="No calls logged with this lead yet." />
              </TabsContent>

              <TabsContent value="tasks">
                <EmptyTab icon={CheckSquare} message="No open tasks for this lead." />
              </TabsContent>

              <TabsContent value="deals">
                <EmptyTab icon={Handshake} message="This lead hasn't been converted to a deal yet." />
              </TabsContent>

              <TabsContent value="files">
                <EmptyTab icon={Tag} message="No files attached to this lead." />
              </TabsContent>

              <TabsContent value="timeline">
                <div className="flex flex-col gap-4">
                  {activityFeed.slice(0, 6).map((a) => (
                    <div key={a.id} className="flex gap-3 text-sm">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p><span className="font-medium">{a.actor}</span> <span className="text-muted-foreground">{a.message}</span></p>
                        <p className="text-xs text-muted-foreground/70">{a.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Lead scoring</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-3 pt-0">
              <LeadScoreGauge score={lead.score} />
              <p className="text-center text-xs text-muted-foreground">
                Based on engagement, fit, and source quality
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2.5 pt-0 text-sm">
              <DetailRow label="Owner" value={lead.owner} />
              <DetailRow label="Next activity" value={lead.nextActivity ? lead.nextActivity.toLocaleDateString() : "Not scheduled"} />
              <DetailRow label="Last activity" value={lead.lastActivity.toLocaleDateString()} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
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
