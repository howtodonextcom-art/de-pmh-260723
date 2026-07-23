import type { Metadata } from "next";

import { SiteHeader } from "@/components/shared/site-header";
import { CompareTable } from "@/components/project/compare-table";
import { getCatalogFromLibrary, getCompareProjects } from "@/lib/library-bridge";
import { t } from "@/lib/i18n/t";

export const metadata: Metadata = {
  title: "So sánh 4 dự án — DED-PMH",
  description: "Bảng so sánh 7 trường cốt lõi và pháp lý tóm tắt của 4 dự án Phú Mỹ Hưng.",
};

export default async function ComparePage() {
  const [{ headerProjects, thumbBySlug }, { projects, source }] = await Promise.all([
    getCatalogFromLibrary(),
    getCompareProjects(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />

      {source === "mock" ? (
        <p className="bg-amber-500/15 px-4 py-2 text-center text-xs text-amber-800 dark:text-amber-200">
          Library seed unavailable — using v0 mock-data fallback. Run from repo with{" "}
          <code>13_PROJECT_DATA_SCHEMA.json</code>.
        </p>
      ) : null}

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <h1 className="mb-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("compare.title")}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">{t("compare.subtitle")}</p>
        <CompareTable projects={projects} />
      </main>
    </div>
  );
}
