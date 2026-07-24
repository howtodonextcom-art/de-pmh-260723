"use client";

import * as React from "react";
import Link from "next/link";

import { useLocale } from "@/lib/i18n/locale-context";

/**
 * W2 — branded error boundary. Next.js requires this file to be a Client
 * Component, so unlike not-found.tsx it can't fetch `headerProjects` for the
 * full SiteHeader (project dropdown needs catalog data) — minimal branded
 * chrome (wordmark only) instead, per the wave's scope lock.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale();

  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-3">
          <Link href="/" className="text-sm font-semibold tracking-tight text-foreground select-none">
            {t("brand.wordmark")}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("errorPage.title")}</h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">{t("errorPage.body")}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("errorPage.ctaRetry")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("errorPage.ctaHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
