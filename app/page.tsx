import type { Metadata } from "next";

import { SiteHeader } from "@/components/shared/site-header";
import { Hero } from "@/components/home/hero";
import { FeaturedCards } from "@/components/home/featured-cards";
import { ExplorerPreview } from "@/components/home/explorer-preview";
import { VnMap } from "@/components/home/vn-map";
import { Updates } from "@/components/home/updates";
import {
  buildHeroAssetsBySlug,
  getCatalogFromLibrary,
  getFullCatalog,
  getSiteCatalogSettings,
} from "@/lib/library-bridge";
import { buildSiteSettings, buildUpdates, citySlug, REGION_LNG_LAT } from "@/lib/home-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DED-PMH — Trung tâm Thông tin Dự án",
  description: "Tra cứu, so sánh và xác minh dữ liệu công khai của các dự án từ một nguồn duy nhất.",
};

export default async function HomePage() {
  const [{ headerProjects, thumbBySlug }, { projects, assets }, siteContent] = await Promise.all([
    getCatalogFromLibrary(),
    getFullCatalog(),
    getSiteCatalogSettings(),
  ]);

  const heroAssetsBySlug = buildHeroAssetsBySlug(projects, assets);
  const settings = buildSiteSettings(projects, siteContent);
  const updates = buildUpdates(siteContent);

  const featured = projects.filter((p) => p.featured).slice(0, 2);
  const featuredFinal = featured.length >= 2 ? featured : projects.slice(0, 2);

  const saBanByCity = new Map<string, string>();
  for (const p of projects) {
    if (p.saBanUrl && p.city && !saBanByCity.has(p.city)) saBanByCity.set(p.city, p.saBanUrl);
  }

  const cityCounts = new Map<string, number>();
  for (const p of projects) cityCounts.set(p.city || p.region, (cityCounts.get(p.city || p.region) ?? 0) + 1);
  const regionCounts = [...cityCounts.entries()]
    .filter(([city]) => city)
    .map(([city, count]) => ({
      region: city,
      count,
      lng: REGION_LNG_LAT[city]?.lng ?? 106.0,
      lat: REGION_LNG_LAT[city]?.lat ?? 16.0,
      query: `khu-vuc=${citySlug(city)}`,
      saBanUrl: saBanByCity.get(city) ?? null,
    }));

  const brandHeroAsset = assets.find((a) => a.verified) ?? null;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DED-PMH",
    description: settings.brandStatementVi,
    sameAs: projects.map((p) => p.officialUrl).filter(Boolean),
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70dvh] bg-[radial-gradient(ellipse_60%_50%_at_70%_0%,var(--color-primary)_0%,transparent_70%)] opacity-[0.07] dark:opacity-[0.12]"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />

      <Hero brandStatementVi={settings.brandStatementVi} heroAsset={brandHeroAsset} />
      <FeaturedCards projects={featuredFinal} heroAssetsBySlug={heroAssetsBySlug} />
      <VnMap regionCounts={regionCounts} />
      <ExplorerPreview projects={projects} heroAssetsBySlug={heroAssetsBySlug} />
      <Updates updates={updates} projects={projects} />
    </div>
  );
}
