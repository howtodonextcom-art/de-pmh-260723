/** Client-safe locale constants — separate from i18n/request.ts so importing
 *  these from a Client Component (e.g. locale-switcher.tsx) doesn't drag
 *  next/headers into the client bundle and crash the build. */
export type Locale = "vi" | "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";
