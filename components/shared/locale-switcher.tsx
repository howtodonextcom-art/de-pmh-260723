"use client";

import { useLocale, type Locale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * F18 — client→server half of the locale split-brain fix. `setLocale` only
 * updates React state + `localStorage` (client-reactive components); without
 * also writing the `NEXT_LOCALE` cookie here, a reload or a fresh RSC
 * navigation would fall back to whatever app/layout.tsx last resolved
 * server-side, ignoring the pick the visitor just made. `document.cookie` is
 * enough — no Server Action needed just to persist a preference cookie.
 */
function persistLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/** vi ↔ en toggle — only affects components wired to `useLocale()`. See docs/I18N_EN.md. */
export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();

  const handleSetLocale = (next: Locale) => {
    setLocale(next);
    persistLocaleCookie(next);
  };

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
