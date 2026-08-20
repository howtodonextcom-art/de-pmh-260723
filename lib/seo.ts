/** Shared SEO helpers — see DD audit "SEO title suffix — 6 pages" duplication (F19). */

/** Site brand name used as the default `<title>` suffix across pages. */
export const SITE_NAME = "DED-PMH";

/**
 * Build a page `<title>` value using the site's `"{pageTitle} — {suffix}"` convention
 * (em dash, spaces on both sides — matches the pattern previously inlined per page).
 */
export function buildTitle(pageTitle: string, suffix: string = SITE_NAME): string {
  return `${pageTitle} — ${suffix}`;
}
