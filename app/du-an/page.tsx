import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { CatalogPageShell } from "@/components/shared/catalog-page-shell";
import { ProjectExplorer } from "@/components/project/project-explorer";
import { buildHeroAssetsBySlug, getCatalogFromLibrary, getFullCatalog } from "@/lib/library-bridge";
import { buildTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: buildTitle(t("catalogTitle")),
    description: t("catalogDescription"),
  };
}

/** §3.3 — H1 + live count, toolbar (search/filter/sort + link to /so-sanh), 4 project cards. */
export default async function ProjectListPage() {
  const t = await getTranslations();
  const [{ headerProjects, thumbBySlug }, { projects, assets }] = await Promise.all([
    getCatalogFromLibrary(),
    getFullCatalog(),
  ]);

  const heroAssetsBySlug = buildHeroAssetsBySlug(projects, assets);

  return (
    <CatalogPageShell
      headerProjects={headerProjects}
      thumbBySlug={thumbBySlug}
      showMockBanner={false}
      mainClassName="max-w-7xl px-4 sm:px-6"
    >
      <div className="mb-8 flex items-baseline gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("duAn.pageTitle")}
        </h1>
        <span className="text-sm text-muted-foreground">
          {projects.length} {t("duAn.unit")}
        </span>
      </div>

      <Suspense>
        <ProjectExplorer projects={projects} heroAssetsBySlug={heroAssetsBySlug} />
      </Suspense>
    </CatalogPageShell>
  );
}
