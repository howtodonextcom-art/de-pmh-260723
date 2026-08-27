import { NextResponse } from "next/server";

import { CMS_SESSION_COOKIE } from "@/lib/cms/constants";
import { createCmsSessionCookie, ensureBootstrapUser, sessionCookieOptions } from "@/lib/firebase/session";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    await ensureBootstrapUser();
    const body = (await request.json()) as { idToken?: string };
    const idToken = body.idToken?.trim();
    if (!idToken) {
      return NextResponse.json({ error: "missing-token" }, { status: 400 });
    }
    const auth = getAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: "admin-unconfigured" }, { status: 503 });
    }
    await auth.verifyIdToken(idToken);
    const cookie = await createCmsSessionCookie(idToken);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(CMS_SESSION_COOKIE, cookie, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "session-failed" }, { status: 401 });
  }
}
