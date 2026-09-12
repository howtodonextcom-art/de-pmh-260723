import { getTranslations } from "next-intl/server";

import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

/**
 * D8 — text fact-grid fallback only. Amenity photos are already browsable
 * via the Gallery's own "Tiện ích" tab (components/project/detail/gallery.tsx),
 * so this section renders nothing once photo coverage exists to avoid
 * duplicating the same images twice on the page.
 */
export async function DetailAmenities({
  project,
  amenityAssets,
}: {
  project: FullProject;
  amenityAssets: V0ImageAsset[];
}) {
  const amenities = project.amenities ?? [];
  if (amenityAssets.length > 0 || amenities.length === 0) return null;

  const t = await getTranslations();
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
