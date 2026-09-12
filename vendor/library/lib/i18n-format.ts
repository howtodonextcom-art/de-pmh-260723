/**
 * Locale-aware number formatting for this vendored data layer. Kept
 * self-contained inside vendor/library (no import from the app's own
 * `lib/`) — this package has never reached outside itself, and pulling
 * from the app's `/lib` would blur that vendoring boundary for one small
 * helper. Every caller passes its own resolved locale explicitly —
 * `locale` defaults to "vi" only so existing non-UI callers (CLI backup
 * scripts) keep their prior Vietnamese-only output unchanged, not because
 * "vi" is a silently-safe fallback for UI callers.
 */
export type NumberLocale = "vi" | "en";

const INTL_TAG: Record<NumberLocale, string> = {
  vi: "vi-VN",
  en: "en-US",
};

const UNIT_WORD: Record<NumberLocale, string> = {
  vi: "căn",
  en: "units",
};

export function formatNumber(
  value: number,
  locale: NumberLocale = "vi",
  options?: Intl.NumberFormatOptions,
): string {
  return value.toLocaleString(INTL_TAG[locale], options);
}

export function unitsWord(locale: NumberLocale = "vi"): string {
  return UNIT_WORD[locale];
}
