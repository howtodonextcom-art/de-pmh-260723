import type { Metadata } from "next";

import { SiteHeader } from "@/components/shared/site-header";
import { PrintButton } from "@/components/shared/print-button";
import { LegalPageClient } from "@/components/project/legal-page-client";
import { getCatalogFromLibrary, getCompareProjects } from "@/lib/library-bridge";
import { t } from "@/lib/i18n/t";

export const metadata: Metadata = {
  title: "Hồ sơ pháp lý — DED-PMH",
  description:
    "Hồ sơ pháp lý theo vùng / dự án — từng văn bản một dòng, xem nội dung text; bản scan ký số khi có trong kho.",
};

/** F5 — scoped legal dossiers (Variant A MVP): zone filter + per-document lines + viewer. */
export default async function LegalPage() {
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
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("legal.title")}
          </h1>
          <PrintButton />
        </div>
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{t("legal.pageIntro")}</p>

        <LegalPageClient projects={projects} />
      </main>
    </div>
  );
}
