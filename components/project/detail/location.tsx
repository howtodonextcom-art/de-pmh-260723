import Image from "next/image";

import { t } from "@/lib/i18n/t";
import type { Project as FullProject } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

/**
 * D4 — schema 13 has no `connectivity[]` field despite the SPEC narrative
 * example; the closest verified data is each project's `highlights[]`
 * (distance/location facts already sourced), reused here instead of
 * inventing figures.
 */
export function DetailLocation({
  project,
  locationAsset,
}: {
  project: FullProject;
  locationAsset?: V0ImageAsset | null;
}) {
  const locationFacts = (project.highlights ?? []).filter((h) => /phút|km|Hồ|Mall|kết nối|giao lộ/i.test(h));
  const imageUrl = locationAsset ? (locationAsset.resolvedUrl ?? locationAsset.sourceFileUrl) : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="mb-8 text-2xl font-bold text-foreground">{t("detail.location")}</h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-foreground">Địa chỉ pháp lý</p>
          <p className="mt-1 text-muted-foreground">{project.address}</p>
          {locationFacts.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm text-foreground">
              {locationFacts.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden>📍</span> {f}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={locationAsset?.alt ?? "Bản đồ vị trí"}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
          )}
        </div>
      </div>
    </section>
  );
}
