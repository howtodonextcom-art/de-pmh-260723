import Link from "next/link";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/shared/site-header";
import { getCatalogFromLibrary } from "@/lib/library-bridge";
import { t } from "@/lib/i18n/t";

export const metadata: Metadata = {
  title: "404 — DED-PMH",
};

/** W2 — branded 404, replaces Next.js's stock white error page. */
export default async function NotFound() {
  const { headerProjects, thumbBySlug } = await getCatalogFromLibrary();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-display text-sm font-medium tracking-wide text-primary">{t("notFound.kicker")}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("notFound.title")}
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">{t("notFound.body")}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("notFound.ctaHome")}
          </Link>
          <Link
            href="/du-an"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("notFound.ctaCatalog")}
          </Link>
        </div>
      </main>
    </div>
  );
}
