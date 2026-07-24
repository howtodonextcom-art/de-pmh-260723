import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteHeader } from "@/components/shared/site-header";
import { ProjectExplorer } from "@/components/project/project-explorer";
import { getCatalogFromLibrary, getFullCatalog } from "@/lib/library-bridge";
import { t } from "@/lib/i18n/t";

export const metadata: Metadata = {
  title: "Danh mục dự án — DED-PMH",
  description: "Tra cứu, lọc và so sánh nhanh 4 dự án Phú Mỹ Hưng theo khu vực, loại hình và trạng thái dữ liệu.",
};

/** §3.3 — H1 + live count, toolbar (search/filter/sort + link to /so-sanh), 4 project cards. */
export default async function ProjectListPage() {
  const [{ headerProjects, thumbBySlug }, { projects, assets, source }] = await Promise.all([
    getCatalogFromLibrary(),
    getFullCatalog(),
  ]);

  const heroAssetsBySlug = Object.fromEntries(
    projects.map((p) => [
      p.slug,
      p.heroAssetId ? (assets.find((a) => a.assetId === p.heroAssetId) ?? null) : (assets.find((a) => a.projectSlug === p.slug) ?? null),
    ]),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />

      {source === "mock" ? (
        <p className="bg-amber-500/15 px-4 py-2 text-center text-xs text-amber-800 dark:text-amber-200">
          Library seed unavailable — using v0 mock-data fallback. Run from repo with{" "}
          <code>13_PROJECT_DATA_SCHEMA.json</code>.
        </p>
      ) : null}

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
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
      </main>
    </div>
  );
}
