"use client";

import * as React from "react";
import { toast } from "sonner";
import { FileText, Upload, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAttachments, uploadAttachmentAction, deleteAttachmentAction, type AttachmentDto,
} from "@/lib/actions/attachments";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Target {
  contactId?: string;
  dealId?: string;
  companyId?: string;
}

export function AttachmentsPanel(target: Target) {
  const [files, setFiles] = React.useState<AttachmentDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { contactId, dealId, companyId } = target;
  const refresh = React.useCallback(async () => {
    const items = await getAttachments({ contactId, dealId, companyId });
    setFiles(items);
    setLoading(false);
  }, [contactId, dealId, companyId]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadAttachmentAction(formData, target);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (!result.ok) {
      toast.error("Upload failed", { description: result.error });
      return;
    }
    toast.success("File uploaded", { description: file.name });
    refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await deleteAttachmentAction(id);
    if (!result.ok) {
      toast.error("Could not delete file", { description: result.error });
      return;
    }
    toast.success("File deleted", { description: name });
    refresh();
  };

  if (loading) {
    return <div className="py-14 text-center text-sm text-muted-foreground">Loading files...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{files.length} file{files.length === 1 ? "" : "s"}</p>
        <label>
          <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          <Button size="sm" variant="outline" asChild disabled={uploading}>
            <span className="cursor-pointer">
              <Upload className="size-3.5" /> {uploading ? "Uploading..." : "Upload file"}
            </span>
          </Button>
        </label>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileText className="size-4" />
          </span>
          <p className="text-sm text-muted-foreground">No files attached yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.fileName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatSize(f.sizeBytes)} · {f.uploaderName ?? "Unknown"} · {f.createdAt.toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="size-8" asChild>
                <a href={f.url} target="_blank" rel="noopener noreferrer" download>
                  <Download className="size-3.5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => handleDelete(f.id, f.fileName)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
