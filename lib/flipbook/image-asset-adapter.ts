import type { ImageAsset } from "@/lib/types";
import type { FlipbookAsset } from "@/lib/flipbook/types";
import { ASPECT_SAMPLE } from "@/lib/flipbook/page-size";

export function getImageUrl(asset: ImageAsset): string {
  return asset.resolvedUrl ?? asset.sourceFileUrl;
}

/** Map project gallery `ImageAsset[]` to flipbook page model (1 image = 1 page). */
export function toFlipbookAssets(assets: ImageAsset[]): FlipbookAsset[] {
  return assets.map((asset) => ({
    id: asset.assetId,
    src: getImageUrl(asset),
    label: asset.alt,
    category: asset.category,
    fitMode: "contain",
    letterboxColor: "#f8f5f0",
  }));
}

/** Load intrinsic sizes for the first few pages so the engine can pick a landscape/portrait ratio. */
export async function probeAssetDimensions(
  assets: FlipbookAsset[],
  sample = ASPECT_SAMPLE,
): Promise<FlipbookAsset[]> {
  if (typeof Image === "undefined" || assets.length === 0) return assets;
  const limit = Math.min(sample, assets.length);
  const head = await Promise.all(
    assets.slice(0, limit).map(
      (asset) =>
        new Promise<FlipbookAsset>((resolve) => {
          if (asset.naturalWidth && asset.naturalHeight) {
            resolve(asset);
            return;
          }
          const img = new Image();
          img.onload = () =>
            resolve({
              ...asset,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
            });
          img.onerror = () => resolve(asset);
          img.src = asset.src;
        }),
    ),
  );
  if (assets.length <= limit) return head;
  return [...head, ...assets.slice(limit)];
}
