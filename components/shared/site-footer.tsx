"use client";

import { useLocale } from "@/lib/i18n/locale-context";

/** Minimal site chrome — brand line + honesty disclaimer + copyright. No nav duplication (header already has it). */
export function SiteFooter() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-medium text-foreground">{t("brand.wordmark")}</p>
          <p className="mt-1 max-w-md">{t("footer.brandStatementFallback")}</p>
        </div>
        <div className="text-xs sm:text-right">
          <p>{t("footer.disclaimer")}</p>
          <p className="mt-1">{t("footer.copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
