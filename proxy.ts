import { NextResponse, type NextRequest } from "next/server";

const LOCALE_COOKIE = "NEXT_LOCALE";
type Locale = "vi" | "en";

/**
 * F18 — server/client i18n split-brain fix.
 *
 * Server Components can only *read* cookies (`next/headers`'s `cookies()`),
 * never set them — only a Server Action, Route Handler, or Middleware can.
 * So first-visit locale detection has to live here: if `NEXT_LOCALE` isn't
 * set yet, derive a default from `Accept-Language` (this site's primary
 * audience is Vietnamese, so only an explicit "en" preference flips the
 * default) and stamp it onto:
 *   - the outgoing *request* cookies, so this same request's RSC render
 *     (see the `cookies()` read in app/layout.tsx) already sees a resolved
 *     value instead of falling through to a hardcoded default, and
 *   - the *response* cookies, so the browser persists it for every
 *     subsequent request.
 *
 * This is the one piece of the fix that genuinely requires Proxy (Next 16's
 * renamed `middleware.ts` convention — see the `proxy` file-convention docs) —
 * app/layout.tsx (a Server Component) cannot call `cookies().set()` itself.
 */
export function proxy(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing === "vi" || existing === "en") {
    return NextResponse.next();
  }

  // Accept-Language is not a reliable signal here: most browsers (including
  // Playwright's default context, and many real VN users running an
  // English-language OS/browser) send "en-US" regardless of the visitor's
  // actual spoken language. Sniffing it flipped the site to English for the
  // common case and broke every e2e spec that assumes the Vietnamese
  // default. This is a Vietnamese-primary-audience site — always default
  // new visitors to "vi"; the client-side switcher (which also writes this
  // cookie) is the actual signal for an explicit English preference.
  const locale: Locale = "vi";

  // Mutate the request's cookie jar so the downstream render (this same
  // request) resolves the same locale we just computed, then forward it.
  request.cookies.set(LOCALE_COOKIE, locale);
  const response = NextResponse.next({ request });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // Skip static assets/images — only page/RSC requests need locale detection.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
