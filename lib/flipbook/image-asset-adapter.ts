import type { ImageAsset } from "@/lib/types";
import type { FlipbookAsset } from "@/lib/flipbook/types";

export function getImageUrl(asset: ImageAsset): string {
  return asset.resolvedUrl ?? asset.sourceFileUrl;
}

/** Map project gallery `ImageAsset[]` to flipbook page model (1 image = 1 page). */
export function toFlipbookAssets(assets: ImageAsset[]): FlipbookAsset[] {
  return assets.map((asset) => ({
    id: asset.assetId,
    src: getImageUrl(asset),
    label: asset.alt,
    fitMode: "contain",
    letterboxColor: "#f8f5f0",
  }));
}
