import { appsScriptCall } from "@/lib/apps-script-api";
import { getRuntimeConfig } from "@/lib/runtime-config";

async function blobToBase64(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      resolve(value.includes(",") ? value.split(",")[1]! : value);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read the selected file."));
    reader.readAsDataURL(blob);
  });
}

export async function putPortalFile(id: string, ownerId: string, blob: Blob) {
  const max = getRuntimeConfig().MAX_UPLOAD_MB * 1024 * 1024;
  if (blob.size > max) throw new Error(`Files must be ${getRuntimeConfig().MAX_UPLOAD_MB} MB or smaller.`);
  const file = blob as File;
  const base64 = await blobToBase64(blob);
  await appsScriptCall("files.upload", {
    id,
    ownerId,
    name: file.name || id,
    mimeType: blob.type || "application/octet-stream",
    size: blob.size,
    base64,
  }, { timeoutMs: 90_000 });
}

export async function getPortalFile(id: string) {
  const result = await appsScriptCall<{ id: string; name: string; mimeType: string; base64: string }>("files.get", { id }, { timeoutMs: 90_000 });
  const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0));
  return { id: result.id, customerId: "", blob: new Blob([bytes], { type: result.mimeType }), name: result.name };
}

export async function deletePortalFile(id: string) {
  await appsScriptCall("files.delete", { id });
}

export async function openPortalFile(id: string, downloadName?: string) {
  const stored = await getPortalFile(id);
  const url = URL.createObjectURL(stored.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  if (downloadName) anchor.download = downloadName;
  else anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
