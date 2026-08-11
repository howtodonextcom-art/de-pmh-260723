import type { Metadata } from "next";

import { SiteHeader } from "@/components/shared/site-header";
import { Hero } from "@/components/home/hero";
import { FeaturedCards } from "@/components/home/featured-cards";
import { ExplorerPreview } from "@/components/home/explorer-preview";
import { VnMap } from "@/components/home/vn-map";
import { Updates } from "@/components/home/updates";
import { getCatalogFromLibrary, getFullCatalog } from "@/lib/library-bridge";
import {
  buildSiteSettings,
  buildUpdates,
  citySlug,
  REGION_LNG_LAT,
} from "@/lib/home-content";

export const metadata: Metadata = {
  title: "DED-PMH — Trung tâm Thông tin Dự án",
  description: "Tra cứu, so sánh và xác minh dữ liệu công khai của 4 dự án Phú Mỹ Hưng từ một nguồn duy nhất.",
};

export default async function HomePage() {
  const [{ headerProjects, thumbBySlug }, { projects, assets, source }] = await Promise.all([
    getCatalogFromLibrary(),
    getFullCatalog(),
  ]);

  const heroAssetsBySlug = Object.fromEntries(
    projects.map((p) => [
      p.slug,
      p.heroAssetId
        ? (assets.find((a) => a.assetId === p.heroAssetId) ?? null)
        : (assets.find((a) => a.projectSlug === p.slug) ?? null),
    ]),
  );

  const settings = buildSiteSettings(projects);
  const updates = buildUpdates();

  const featured = projects.filter((p) => p.featured).slice(0, 2);
  const featuredFinal = featured.length >= 2 ? featured : projects.slice(0, 2);

  const cityCounts = new Map<string, number>();
  for (const p of projects) cityCounts.set(p.city, (cityCounts.get(p.city) ?? 0) + 1);
  const regionCounts = [...cityCounts.entries()].map(([city, count]) => ({
    region: city,
    count,
    lng: REGION_LNG_LAT[city]?.lng ?? 106.0,
    lat: REGION_LNG_LAT[city]?.lat ?? 16.0,
    query: `khu-vuc=${citySlug(city)}`,
  }));

  const brandHeroAsset = assets.find((a) => a.verified) ?? null;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DED-PMH",
    description: settings.brandStatementVi,
    sameAs: projects.map((p) => p.officialUrl),
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Atmosphere — soft teal wash behind Hero only; fades out before
          the card sections so it reads as depth, not a colored background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70dvh] bg-[radial-gradient(ellipse_60%_50%_at_70%_0%,var(--color-primary)_0%,transparent_70%)] opacity-[0.07] dark:opacity-[0.12]"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />

      {source === "mock" ? (
        <p className="bg-amber-500/15 px-4 py-2 text-center text-xs text-amber-800 dark:text-amber-200">
          Library seed unavailable — using v0 mock-data fallback. Run from repo with{" "}
          <code>13_PROJECT_DATA_SCHEMA.json</code>.
        </p>
      ) : null}

      <Hero brandStatementVi={settings.brandStatementVi} heroAsset={brandHeroAsset} />
      <FeaturedCards projects={featuredFinal} heroAssetsBySlug={heroAssetsBySlug} />
      <ExplorerPreview projects={projects} heroAssetsBySlug={heroAssetsBySlug} />
      <VnMap regionCounts={regionCounts} />
      <Updates updates={updates} projects={projects} />
    </div>
  );
}
