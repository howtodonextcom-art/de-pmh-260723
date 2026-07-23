"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

/** vi ↔ en toggle — only affects components wired to `useLocale()`. See docs/I18N_EN.md. */
export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();

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
        onClick={() => setLocale("vi")}
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
        onClick={() => setLocale("en")}
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
