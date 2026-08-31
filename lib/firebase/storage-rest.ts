import "server-only";

import { getFirebaseClientEnv } from "@/lib/config/env.server";
import {
  firebaseStorageDownloadUrl,
  firebaseStorageObjectUrl,
  firebaseStorageUploadUrl,
} from "@/lib/firebase/storage-urls";

export function isFirebaseStorageRestConfigured(): boolean {
  return Boolean(getFirebaseClientEnv().storageBucket);
}

export async function restUploadObject(
  objectPath: string,
  bytes: Buffer,
  contentType: string,
  idToken: string,
): Promise<{ ok: boolean; status: number; url: string }> {
  const bucket = getFirebaseClientEnv().storageBucket;
  if (!bucket || !idToken.trim()) return { ok: false, status: 0, url: "" };
  const res = await fetch(firebaseStorageUploadUrl(bucket, objectPath), {
    method: "POST",
    headers: {
      Authorization: `Firebase ${idToken}`,
      "Content-Type": contentType || "application/octet-stream",
    },
    body: new Uint8Array(bytes),
  });
  if (!res.ok) return { ok: false, status: res.status, url: "" };
  const meta = (await res.json().catch(() => ({}))) as { downloadTokens?: string };
  const token = typeof meta.downloadTokens === "string" ? meta.downloadTokens.split(",")[0] : "";
  return {
    ok: true,
    status: res.status,
    url: firebaseStorageDownloadUrl(bucket, objectPath, token),
  };
}

/** 404 is treated as success (object already gone). */
export async function restDeleteObject(
  objectPath: string,
  idToken: string,
): Promise<{ ok: boolean; status: number }> {
  const bucket = getFirebaseClientEnv().storageBucket;
  if (!bucket || !idToken.trim()) return { ok: false, status: 0 };
  const res = await fetch(firebaseStorageObjectUrl(bucket, objectPath), {
    method: "DELETE",
    headers: {
      Authorization: `Firebase ${idToken}`,
    },
  });
  if (res.status === 404) return { ok: true, status: 404 };
  return { ok: res.ok, status: res.status };
}
