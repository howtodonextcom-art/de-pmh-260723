import Link from "next/link";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

/**
 * D8 — photo masonry when amenity images exist; falls back to the verified
 * amenity names as a fact grid when a project has 0 amenity photos. Hidden
 * only when there is neither text nor imagery.
 */
export function DetailAmenities({
  project,
  amenityAssets,
  hasGallery,
}: {
  project: FullProject;
  amenityAssets: V0ImageAsset[];
  hasGallery: boolean;
}) {
  const amenities = project.amenities ?? [];
  if (amenityAssets.length === 0 && amenities.length === 0) return null;

  if (amenityAssets.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.amenities")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {amenities.map((a) => (
            <div key={a} className="rounded-xl border border-border p-4 text-sm font-medium text-foreground">
              {a}
            </div>
          ))}
        </div>
      </section>
    );
  }

  const shown = amenityAssets.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.amenities")}</h2>
      <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {shown.map((a) => (
          <figure key={a.assetId} className="overflow-hidden rounded-xl">
            <div className="relative aspect-[4/3]">
              <ImageWithFallback
                src={a.resolvedUrl ?? a.sourceFileUrl}
                alt={a.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1 text-xs text-muted-foreground">{a.alt}</figcaption>
          </figure>
        ))}
      </div>
      {amenityAssets.length > 8 && hasGallery && (
        <div className="mt-4">
          <Link href="#gallery" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả trong Gallery →
          </Link>
        </div>
      )}
    </section>
  );
}
