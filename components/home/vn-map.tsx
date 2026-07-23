"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { Reveal } from "@/components/shared/reveal";
import { t } from "@/lib/i18n/t";
import type { RegionPin } from "@/components/home/region-map-canvas";

const SA_BAN_HH_URL =
  "https://www.bacninhhonghaccity.vn/sa-ban?utm_source=ded-pmh&utm_medium=home-map&utm_campaign=map-cta";

// Lazy: maplibre-gl is a sizable client-only dependency — load it only when
// the home route actually renders this section, not on every route's bundle.
const RegionMapCanvas = dynamic(
  () => import("@/components/home/region-map-canvas").then((m) => m.RegionMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="region-map-stage"
        className="relative min-h-[70vh] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted via-primary/5 to-muted md:min-h-[65vh]"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer-sweep" />
        <span className="absolute left-[38%] top-[42%] size-3 animate-pulse rounded-full bg-primary/30" />
        <span className="absolute left-[62%] top-[58%] size-3 animate-pulse rounded-full bg-primary/30 [animation-delay:0.4s]" />
        <span className="sr-only">{t("home.mapLoading")}</span>
      </div>
    ),
  },
);

function isBacNinh(region: string) {
  return region === "Bắc Ninh" || region.toLowerCase().includes("bắc ninh");
}

export function VnMap({ regionCounts }: { regionCounts: RegionPin[] }) {
  const router = useRouter();

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
          <RegionMapCanvas
            regions={regionCounts}
            onSelectRegion={(query) => router.push(`/du-an?${query}`)}
          />
        </div>
        <div className="flex flex-col gap-3 md:col-span-4 md:justify-start md:pt-2 lg:col-span-3">
          <p className="text-sm text-muted-foreground">{t("home.mapListIntro")}</p>
          {regionCounts.map((r) => (
            <div
              key={r.region}
              className="rounded-xl border border-border bg-card p-4"
              data-testid={`region-card-${r.query.includes("bac-ninh") ? "bac-ninh" : "other"}`}
            >
              <button
                type="button"
                onClick={() => router.push(`/du-an?${r.query}`)}
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
              {isBacNinh(r.region) ? (
                <a
                  href={SA_BAN_HH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="sa-ban-hh-cta"
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
