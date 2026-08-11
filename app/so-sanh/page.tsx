import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteHeader } from "@/components/shared/site-header";
import { CompareTable } from "@/components/project/compare-table";
import { getCatalogFromLibrary, getCompareProjects } from "@/lib/library-bridge";
import { t } from "@/lib/i18n/t";

export const metadata: Metadata = {
  title: "So sánh dự án — DED-PMH",
  description:
    "So sánh dự án Phú Mỹ Hưng theo vùng (Phía Bắc / Phía Nam), nhóm Site A / Outsite — tối đa 4 cột mỗi lần.",
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
        <Suspense fallback={<p className="text-sm text-muted-foreground">{t("compare.loading")}</p>}>
          <CompareTable projects={projects} />
        </Suspense>
      </main>
    </div>
  );
}
