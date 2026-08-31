export function extOf(name: string, type: string): string {
  const dot = name.lastIndexOf(".");
  const fromName = dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
  if (fromName && fromName.length <= 8 && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("svg")) return "svg";
  return "jpg";
}

export function cmsStorageObjectPath(slug: string, assetId: string, ext: string): string {
  return `projects/${slug}/${assetId}.${ext}`;
}

/** Relative path under `public/` for a local CMS upload URL, or null if unsafe / not local. */
export function localCmsUploadRelPath(url: string): string | null {
  if (!url.startsWith("/cms-uploads/")) return null;
  const rel = url.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!rel.startsWith("cms-uploads/") || rel.includes("..") || rel.includes("\0")) return null;
  const parts = rel.split("/").filter(Boolean);
  if (parts.length < 3 || parts.some((p) => p === "." || p === "..")) return null;
  return parts.join("/");
}
