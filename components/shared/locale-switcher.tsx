"use client";

import { useLocale as useNextIntlLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

/**
 * Writes the same cookie `i18n/request.ts` reads server-side, then
 * `router.refresh()` re-runs the Server Component tree (RootLayout
 * included) so `NextIntlClientProvider` gets fresh `locale`/`messages`
 * props — this is now the ONLY source of truth for locale (server and
 * client both read it from the same per-request resolution), replacing the
 * old split-brain between a cookie-unaware static `t()` and a client-only
 * reactive Context. See docs/ADR-002-i18n-strategy.md.
 */
function persistLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/** vi ↔ en toggle. */
export function LocaleSwitcher() {
  const locale = useNextIntlLocale() as Locale;
  const t = useTranslations();
  const router = useRouter();

  function handleSetLocale(next: Locale) {
    if (next === locale) return;
    persistLocaleCookie(next);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={t("nav.langSwitcherLabel")}
      className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5 text-xs font-medium"
    >
      <button
        type="button"
        data-testid="locale-switch-vi"
        aria-pressed={locale === "vi"}
        onClick={() => handleSetLocale("vi")}
        className={cn(
          "rounded-md px-2 py-1 transition-colors",
          locale === "vi" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        )}
      >
        VI
      </button>
      <button
        type="button"
        data-testid="locale-switch-en"
        aria-pressed={locale === "en"}
        onClick={() => handleSetLocale("en")}
        className={cn(
          "rounded-md px-2 py-1 transition-colors",
          locale === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
    </div>
  );
}
