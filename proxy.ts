import { NextResponse, type NextRequest } from "next/server";

import { CMS_SESSION_COOKIE } from "@/lib/cms/constants";

const LOCALE_COOKIE = "NEXT_LOCALE";
type Locale = "vi" | "en";

function applyLocaleCookie(request: NextRequest, response: NextResponse) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing === "vi" || existing === "en") return response;
  const locale: Locale = "vi";
  request.cookies.set(LOCALE_COOKIE, locale);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

/**
 * F18 — locale cookie + CMS gate (`/cms/**` requires session cookie).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/cms")) {
    const session = request.cookies.get(CMS_SESSION_COOKIE)?.value;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return applyLocaleCookie(request, NextResponse.redirect(url));
    }
  }

  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing === "vi" || existing === "en") {
    return NextResponse.next();
  }

  const locale: Locale = "vi";
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
