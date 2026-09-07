import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

function isS3Configured() {
  return Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);
}

let client: S3Client | null = null;

function getClient() {
  if (!isS3Configured()) return null;
  if (!client) {
    client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export interface UploadResult {
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storedIn: "s3" | "local";
}

/**
 * Uploads a file to S3-compatible storage (AWS S3, Cloudflare R2, MinIO, ...)
 * when S3_* env vars are configured. Otherwise falls back to saving it under
 * public/uploads on local disk, so avatar/attachment uploads keep working in
 * local dev without any cloud credentials.
 */
export async function uploadFile(file: File, folder: string): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const key = `${folder}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const s3 = getClient();
  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );
    const publicBase = process.env.S3_PUBLIC_URL || `https://${process.env.S3_BUCKET}.s3.amazonaws.com`;
    return {
      url: `${publicBase.replace(/\/$/, "")}/${key}`,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: buffer.byteLength,
      storedIn: "s3",
    };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });
  const localName = `${randomUUID()}${ext ? `.${ext}` : ""}`;
  await fs.writeFile(path.join(uploadsDir, localName), buffer);

  return {
    url: `/uploads/${folder}/${localName}`,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: buffer.byteLength,
    storedIn: "local",
  };
}
