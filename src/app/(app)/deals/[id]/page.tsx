import { notFound } from "next/navigation";
import { Mail, FileText, MessageSquare, CheckSquare, Package } from "lucide-react";
import { DetailHeader } from "@/components/shared/detail-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getDealById } from "@/lib/actions/deals";
import { AttachmentsPanel } from "@/components/shared/attachments-panel";
import { formatCurrency } from "@/lib/utils";

const STAGE_VARIANT: Record<string, "secondary" | "default" | "warning" | "success" | "destructive"> = {
  "New Lead": "secondary", Qualified: "default", Proposal: "default",
  Negotiation: "warning", Won: "success", Lost: "destructive",
};

export const dynamic = "force-dynamic";

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await getDealById(id);
  if (!deal) notFound();
  const weighted = (deal.value * deal.probability) / 100;

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        backHref="/deals"
        backLabel="Back to deals"
        name={deal.name}
        subtitle={`${deal.companyName} · ${deal.contactName}`}
        status={deal.stage}
        statusVariant={STAGE_VARIANT[deal.stage]}
        actions={
          <>
            <Button variant="outline" size="sm"><Mail className="size-3.5" /> Log activity</Button>
            <Button size="sm">Mark as won</Button>
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
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Stat label="Deal value" value={formatCurrency(deal.value)} />
                  <Stat label="Weighted value" value={formatCurrency(weighted)} accent />
                  <Stat label="Priority" value={deal.priority} />
                  <Stat label="Expected close" value={deal.expectedClose.toLocaleDateString()} />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium">Win probability</span>
                    <span className="text-muted-foreground">{deal.probability}%</span>
                  </div>
                  <Progress value={deal.probability} />
                </div>
              </TabsContent>

              <TabsContent value="timeline"><EmptyTab icon={FileText} message="Deal timeline will appear here." /></TabsContent>
              <TabsContent value="tasks"><EmptyTab icon={CheckSquare} message="No open tasks for this deal." /></TabsContent>
              <TabsContent value="notes"><EmptyTab icon={MessageSquare} message="No notes yet." /></TabsContent>
              <TabsContent value="products"><EmptyTab icon={Package} message="No products attached to this deal." /></TabsContent>
              <TabsContent value="files"><AttachmentsPanel dealId={deal.id} /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-sm">Deal details</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0 text-sm">
            <DetailRow label="Owner" value={deal.owner} />
            <Separator />
            <DetailRow label="Stage" value={deal.stage} />
            <Separator />
            <DetailRow label="Created" value={deal.createdAt.toLocaleDateString()} />
            <Separator />
            <DetailRow label="Company" value={deal.companyName} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-semibold ${accent ? "text-primary" : ""}`}>{value}</p>
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
