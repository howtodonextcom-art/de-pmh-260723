import type { Metadata } from "next";

import { SiteHeader } from "@/components/shared/site-header";
import { PrintButton } from "@/components/shared/print-button";
import { LegalDossierTable } from "@/components/project/legal-dossier-table";
import { getCatalogFromLibrary, getCompareProjects } from "@/lib/library-bridge";
import { t } from "@/lib/i18n/t";

export const metadata: Metadata = {
  title: "Hồ sơ pháp lý — DED-PMH",
  description: "Tổng hợp 7 nhóm hồ sơ pháp lý của 4 dự án Phú Mỹ Hưng — tra cứu số văn bản, ngày ban hành, cơ quan cấp.",
};

/** F5 §3.5 — 4 anchored sections, each a 7-group legal dossier table with copy + print. */
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

        <nav
          aria-label={t("legal.jumpTo")}
          className="sticky top-14 z-30 mb-10 -mx-4 flex flex-wrap gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6"
        >
          {projects.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:shadow-sm"
            >
              {p.displayNameVi}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {projects.map((p) => (
            <section
              key={p.slug}
              id={p.slug}
              className="scroll-mt-20 rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">{p.displayNameVi}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{p.region}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("legal.groupCount")} · {t("legal.updated")} {p.lastVerifiedAt}
                </p>
              </div>
              <LegalDossierTable project={p} />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
