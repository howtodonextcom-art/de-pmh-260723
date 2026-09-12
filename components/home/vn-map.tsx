"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { Reveal } from "@/components/shared/reveal";
import type { RegionPin } from "@/components/home/region-map-canvas";
import type { HomeProjectPin, HomeRegionGroup } from "@/lib/home-content";

function RegionMapLoadingFallback() {
  const t = useTranslations();
  return (
    <div
      data-testid="region-map-stage"
      className="relative min-h-[70vh] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted via-primary/5 to-muted md:min-h-[65vh]"
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer-sweep" />
      <span className="absolute left-[38%] top-[42%] size-3 animate-pulse rounded-full bg-primary/30" />
      <span className="absolute left-[62%] top-[58%] size-3 animate-pulse rounded-full bg-primary/30 [animation-delay:0.4s]" />
      <span className="sr-only">{t("home.mapLoading")}</span>
    </div>
  );
}

const RegionMapCanvas = dynamic(
  () => import("@/components/home/region-map-canvas").then((m) => m.RegionMapCanvas),
  {
    ssr: false,
    loading: () => <RegionMapLoadingFallback />,
  },
);

/** Builds the destination URL for a region card — a solo project links
 *  straight to its detail page; a multi-project region links to the
 *  catalog filter, whose slug matches exactly what `/du-an` computes for
 *  the same projects (both sides use `groupProjectsByRegion`/`citySlug`). */
function regionHref(group: HomeRegionGroup): string {
  return group.soloSlug ? `/du-an/${group.soloSlug}` : `/du-an?khu-vuc=${group.slug}`;
}

export function VnMap({
  projectPins,
  regionGroups,
}: {
  projectPins: HomeProjectPin[];
  regionGroups: HomeRegionGroup[];
}) {
  const t = useTranslations();
  const router = useRouter();

  // One marker per project — clicking it navigates straight to that
  // project's detail page. No city-cluster centroid, no coordinate guess:
  // a project without real `coordinates` simply has no pin here.
  const mapPins: RegionPin[] = projectPins.map((p) => ({
    region: p.displayNameVi,
    count: 1,
    lat: p.lat,
    lng: p.lng,
    query: `/du-an/${p.slug}`,
  }));

  return (
    <section
      data-testid="home-map-section"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12"
      aria-labelledby="home-map-heading"
    >
      <h2 id="home-map-heading" className="mb-6 font-display text-2xl font-semibold md:mb-8">
        {t("home.mapHeading")}
      </h2>
      <Reveal className="grid items-stretch gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-8 lg:col-span-9">
          {mapPins.length > 0 ? (
            <RegionMapCanvas regions={mapPins} onSelectRegion={(href) => router.push(href)} />
          ) : (
            <div
              data-testid="region-map-stage"
              className="relative flex min-h-[40vh] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30 md:min-h-[65vh]"
            >
              <p className="px-6 text-center text-sm text-muted-foreground">{t("home.emptyCatalog")}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 md:col-span-4 md:justify-start md:pt-2 lg:col-span-3">
          <p className="text-sm text-muted-foreground">{t("home.mapListIntro")}</p>
          {regionGroups.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
              {t("home.emptyCatalog")}
            </p>
          ) : null}
          {regionGroups.map((r) => (
            <div
              key={r.slug}
              className="rounded-xl border border-border bg-card p-4"
              data-testid={`region-card-${r.slug}`}
            >
              <button
                type="button"
                onClick={() => router.push(regionHref(r))}
                className="focus-visible:ring-ring flex w-full items-center justify-between gap-3 text-left transition-colors hover:text-primary focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="inline-block size-2.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {r.region}
                </span>
                <span className="text-sm text-muted-foreground">
                  {r.count} {t("home.mapUnit")}
                </span>
              </button>
              {r.saBanUrl ? (
                <a
                  href={r.saBanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="sa-ban-cta"
                  className="focus-visible:ring-ring mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  {t("home.mapSaBanCta")}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
