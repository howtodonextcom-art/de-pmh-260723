import type { CmsAsset, CmsProjectDoc } from "@/lib/cms/types";
import { cmsStorageObjectPath, extOf } from "@/lib/cms/upload-ext";
import { isLocalCmsUploadUrl, parseStorageObjectPath } from "@/lib/firebase/storage-urls";

export function appendCmsAsset(doc: CmsProjectDoc, asset: CmsAsset, category: string): CmsProjectDoc {
  const assets = [...(doc.assets ?? []), asset];
  const next: CmsProjectDoc = { ...doc, assets };
  if (category === "hero" && !doc.heroAssetId) {
    next.heroAssetId = asset.assetId;
  }
  if (category !== "hero") {
    const ids = doc.galleryAssetIds ?? [];
    if (!ids.includes(asset.assetId)) {
      next.galleryAssetIds = [...ids, asset.assetId];
    }
  }
  return next;
}

export function stripCmsAsset(doc: CmsProjectDoc, assetId: string): CmsProjectDoc {
  return {
    ...doc,
    assets: (doc.assets ?? []).filter((asset) => asset.assetId !== assetId),
    heroAssetId: doc.heroAssetId === assetId ? null : doc.heroAssetId,
    galleryAssetIds: (doc.galleryAssetIds ?? []).filter((id) => id !== assetId),
  };
}

export function storageObjectPathFromAsset(
  asset: Pick<CmsAsset, "assetId" | "projectSlug" | "sourceFileUrl" | "resolvedUrl">,
): string | null {
  const url = (asset.resolvedUrl || asset.sourceFileUrl || "").trim();
  if (!url || isLocalCmsUploadUrl(url)) return null;
  const parsed = parseStorageObjectPath(url);
  if (parsed) return parsed;
  if (asset.projectSlug && asset.assetId) {
    return cmsStorageObjectPath(asset.projectSlug, asset.assetId, extOf(url.split("?")[0] ?? "", ""));
  }
  return null;
}
