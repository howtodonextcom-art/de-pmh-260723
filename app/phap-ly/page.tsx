import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CatalogPageShell } from "@/components/shared/catalog-page-shell";
import { PrintButton } from "@/components/shared/print-button";
import { LegalPageClient } from "@/components/project/legal-page-client";
import { getCatalogFromLibrary, getCompareProjects } from "@/lib/library-bridge";
import { buildTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: buildTitle(t("legalTitle")),
    description: t("legalDescription"),
  };
}

/** F5 — scoped legal dossiers (Variant A MVP): zone filter + per-document lines + viewer. */
export default async function LegalPage() {
  const t = await getTranslations();
  const [{ headerProjects, thumbBySlug }, { projects }] = await Promise.all([
    getCatalogFromLibrary(),
    getCompareProjects(),
  ]);

  return (
    <CatalogPageShell
      headerProjects={headerProjects}
      thumbBySlug={thumbBySlug}
      showMockBanner={false}
      mainClassName="max-w-5xl px-4"
    >
      <div className="mb-2 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("legal.title")}
        </h1>
        <PrintButton />
      </div>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{t("legal.pageIntro")}</p>

      <LegalPageClient projects={projects} />
    </CatalogPageShell>
  );
}
