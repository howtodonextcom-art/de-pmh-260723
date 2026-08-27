import { NextResponse } from "next/server";

import { CMS_SESSION_COOKIE } from "@/lib/cms/constants";

export async function POST(request: Request) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url, { status: 303 });
  response.cookies.set(CMS_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
