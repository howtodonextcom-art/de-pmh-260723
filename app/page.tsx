import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/shared/site-header";
import { Hero } from "@/components/home/hero";
import { FeaturedCards } from "@/components/home/featured-cards";
import { ExplorerPreview } from "@/components/home/explorer-preview";
import { VnMap } from "@/components/home/vn-map";
import {
  buildHeroAssetsBySlug,
  getCatalogFromLibrary,
  getFullCatalog,
  getSiteCatalogSettings,
} from "@/lib/library-bridge";
import { buildProjectPins, buildRegionGroups, buildSiteSettings } from "@/lib/home-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function HomePage() {
  const [{ headerProjects, thumbBySlug }, { projects, assets }, siteContent] = await Promise.all([
    getCatalogFromLibrary(),
    getFullCatalog(),
    getSiteCatalogSettings(),
  ]);

  const heroAssetsBySlug = buildHeroAssetsBySlug(projects, assets);
  const settings = buildSiteSettings(projects, siteContent);

  const featured = projects.filter((p) => p.featured).slice(0, 2);
  const featuredFinal = featured.length >= 2 ? featured : projects.slice(0, 2);

  const projectPins = buildProjectPins(projects);
  const regionGroups = buildRegionGroups(projects);

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

      <Hero heroAsset={brandHeroAsset} />
      <FeaturedCards projects={featuredFinal} heroAssetsBySlug={heroAssetsBySlug} />
      <VnMap projectPins={projectPins} regionGroups={regionGroups} />
      <ExplorerPreview projects={projects} heroAssetsBySlug={heroAssetsBySlug} />
    </div>
  );
}
