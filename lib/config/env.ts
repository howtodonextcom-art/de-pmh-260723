/**
 * Public (NEXT_PUBLIC_*) site env. Safe to import from Client Components.
 * Secrets live in `lib/config/env.server.ts` (server-only).
 *
 * White-label: set these in `.env.local` (see `.env.example`).
 */

function readPublic(key: string, fallback: string): string {
  const value = process.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export const publicEnv = {
  siteName: readPublic("NEXT_PUBLIC_SITE_NAME", "DED-PMH"),
  siteUrl: readPublic("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  brandShort: readPublic("NEXT_PUBLIC_BRAND_SHORT", "DED · Phú Mỹ Hưng"),
  pdfFunctionUrl: readPublic("NEXT_PUBLIC_PDF_FUNCTION_URL", ""),
} as const;

export type PublicEnv = typeof publicEnv;

/** True when the optional PDF Cloud Function URL is configured. */
export function hasPdfFunctionUrl(): boolean {
  return publicEnv.pdfFunctionUrl.length > 0;
}
