"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { attachments } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import { uploadFile } from "@/lib/storage";
import type { ActionResult } from "./leads";

export interface AttachmentDto {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  uploaderName: string | null;
  createdAt: Date;
}

export async function getAttachments(target: { contactId?: string; dealId?: string; companyId?: string }): Promise<AttachmentDto[]> {
  const where = target.contactId
    ? eq(attachments.contactId, target.contactId)
    : target.dealId
      ? eq(attachments.dealId, target.dealId)
      : target.companyId
        ? eq(attachments.companyId, target.companyId)
        : undefined;
  if (!where) return [];

  const rows = await db.query.attachments.findMany({
    where,
    orderBy: [desc(attachments.createdAt)],
    with: { uploader: true },
  });
  return rows.map((r) => ({
    id: r.id,
    fileName: r.fileName,
    url: r.url,
    mimeType: r.mimeType,
    sizeBytes: r.sizeBytes,
    uploaderName: r.uploader?.name ?? null,
    createdAt: r.createdAt,
  }));
}

export async function uploadAttachmentAction(
  formData: FormData,
  target: { contactId?: string; dealId?: string; companyId?: string }
): Promise<ActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a file first" };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: "File is too large (max 10MB)" };
  }
  const session = await getSession();

  const uploaded = await uploadFile(file, target.contactId ? "contacts" : target.dealId ? "deals" : "companies");

  await db.insert(attachments).values({
    fileName: uploaded.fileName,
    url: uploaded.url,
    mimeType: uploaded.mimeType,
    sizeBytes: uploaded.sizeBytes,
    uploaderId: session?.userId,
    contactId: target.contactId,
    dealId: target.dealId,
    companyId: target.companyId,
  });

  await logAudit({ actorId: session?.userId, action: "Uploaded", entityType: "Attachment", entity: uploaded.fileName });

  if (target.contactId) revalidatePath(`/contacts/${target.contactId}`);
  if (target.dealId) revalidatePath(`/deals/${target.dealId}`);
  if (target.companyId) revalidatePath(`/companies/${target.companyId}`);
  return { ok: true };
}

export async function deleteAttachmentAction(id: string): Promise<ActionResult> {
  const session = await getSession();
  const row = await db.query.attachments.findFirst({ where: eq(attachments.id, id) });
  if (!row) return { ok: false, error: "File not found" };
  await db.delete(attachments).where(eq(attachments.id, id));
  await logAudit({ actorId: session?.userId, action: "Deleted", entityType: "Attachment", entity: row.fileName, severity: "WARNING" });
  if (row.contactId) revalidatePath(`/contacts/${row.contactId}`);
  if (row.dealId) revalidatePath(`/deals/${row.dealId}`);
  if (row.companyId) revalidatePath(`/companies/${row.companyId}`);
  return { ok: true };
}
