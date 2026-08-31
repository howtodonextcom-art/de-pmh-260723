export function firebaseStorageUploadUrl(bucket: string, objectPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o?name=${encodeURIComponent(objectPath)}`;
}

export function firebaseStorageObjectUrl(bucket: string, objectPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(objectPath)}`;
}

export function firebaseStorageDownloadUrl(bucket: string, objectPath: string, token = ""): string {
  const base = `${firebaseStorageObjectUrl(bucket, objectPath)}?alt=media`;
  return token ? `${base}&token=${encodeURIComponent(token)}` : base;
}

export function isLocalCmsUploadUrl(url: string): boolean {
  return url.startsWith("/cms-uploads/");
}

/** Object path inside the bucket, e.g. `projects/slug/id.jpg`. Local `/cms-uploads/` URLs return null. */
export function parseStorageObjectPath(url: string): string | null {
  const raw = url.trim();
  if (!raw || isLocalCmsUploadUrl(raw)) return null;

  const objectMarker = "/o/";
  if (raw.includes("firebasestorage.googleapis.com") && raw.includes(objectMarker)) {
    const encoded = raw.slice(raw.indexOf(objectMarker) + objectMarker.length).split("?")[0];
    try {
      const decoded = decodeURIComponent(encoded);
      return decoded || null;
    } catch {
      return encoded || null;
    }
  }

  try {
    const parsed = new URL(raw);
    if (parsed.hostname === "storage.googleapis.com") {
      const segments = parsed.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
      if (segments.length >= 2) return segments.slice(1).join("/");
    }
  } catch {
    return null;
  }
  return null;
}
