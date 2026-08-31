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
