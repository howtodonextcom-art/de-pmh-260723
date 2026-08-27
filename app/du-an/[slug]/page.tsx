import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SiteHeader } from "@/components/shared/site-header";
import { PdfExportTrigger } from "@/components/project/detail/pdf-export-trigger";
import { DetailHero } from "@/components/project/detail/hero";
import { SectionDivider } from "@/components/project/detail/section-divider";
import { DetailFactGrid } from "@/components/project/detail/fact-grid";
import { DetailStory } from "@/components/project/detail/story";
import { DetailLocation } from "@/components/project/detail/location";
import { DetailMasterplan } from "@/components/project/detail/masterplan";
import { DetailArchitecturePartners } from "@/components/project/detail/architecture-partners";
import { DetailProductLine } from "@/components/project/detail/product-line";
import { DetailAmenities } from "@/components/project/detail/amenities";
import { DetailGallery } from "@/components/project/detail/gallery";
import { DetailLegalTeaser } from "@/components/project/detail/legal-teaser";
import { DetailSalesStatus } from "@/components/project/detail/sales-status";
import { DetailRelated } from "@/components/project/detail/related";
import { DetailSources } from "@/components/project/detail/sources";
import { buildHeroAssetsBySlug, getCatalogFromLibrary, getFullCatalog } from "@/lib/library-bridge";
import { buildTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getFullCatalog();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: buildTitle("404") };
  return {
    title: buildTitle(project.displayNameVi),
    description: project.shortDescriptionVi ?? undefined,
  };
}

/** R03 complete — D1 Hero · D2 Fact grid · D3 Story · D4 Location · D5 Masterplan (HHC) ·
 *  D6 Architecture/partners · D7 Product line · D8 Amenities · D9 Gallery · D10 Legal teaser ·
 *  D11 Sales · D12 Related · D13 Sources. Each block hides itself when its data is empty. */
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ headerProjects, thumbBySlug }, { projects, assets }] = await Promise.all([
    getCatalogFromLibrary(),
    getFullCatalog(),
  ]);

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const projectAssets = assets.filter((a) => a.projectSlug === slug);
  const heroAsset = project.heroAssetId
    ? (assets.find((a) => a.assetId === project.heroAssetId) ?? null)
    : (projectAssets[0] ?? null);
  const masterplanAsset = projectAssets.find((a) => a.category === "masterplan") ?? null;
  const locationAsset = projectAssets.find((a) => a.category === "location") ?? null;
  const amenityAssets = projectAssets.filter((a) => a.category === "amenities" && a.verified);
  const hasGallery = projectAssets.filter((a) => a.verified).length >= 4;

  const others = projects.filter((p) => p.slug !== slug);
  const related = [...others]
    .sort((a, b) => {
      const aSame = a.region === project.region ? 0 : 1;
      const bSame = b.region === project.region ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, 3);
  const heroAssetsBySlug = buildHeroAssetsBySlug(related, assets);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />
      <Suspense>
        <PdfExportTrigger slug={project.slug} />
      </Suspense>
      <div className="print:hidden">
        <DetailHero project={project} heroAsset={heroAsset} />
      </div>
      <SectionDivider />
      <DetailFactGrid project={project} />
      <SectionDivider />
      <div className="print:hidden">
        <DetailStory project={project} />
        <DetailLocation project={project} locationAsset={locationAsset} />
        <DetailMasterplan project={project} masterplanAsset={masterplanAsset} />
        <DetailArchitecturePartners project={project} />
        <DetailProductLine project={project} />
        <DetailAmenities project={project} amenityAssets={amenityAssets} hasGallery={hasGallery} />
      </div>
      <SectionDivider />
      <div className="print:hidden">
        <DetailGallery assets={projectAssets} />
      </div>
      <SectionDivider />
      <DetailLegalTeaser project={project} />
      <DetailSalesStatus project={project} />
      <SectionDivider />
      <div className="print:hidden">
        <DetailRelated projects={related} heroAssetsBySlug={heroAssetsBySlug} />
      </div>
      <DetailSources project={project} />
    </div>
  );
}
