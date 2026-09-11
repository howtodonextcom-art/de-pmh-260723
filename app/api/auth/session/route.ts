import { NextResponse } from "next/server";

import { CMS_SESSION_COOKIE } from "@/lib/cms/constants";
import { createCmsSessionCookie, ensureBootstrapUser, sessionCookieOptions } from "@/lib/firebase/session";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  CMS_ID_TOKEN_COOKIE_PREFIX,
  CMS_ID_TOKEN_MAX_AGE_SEC,
  lookupFirebaseIdToken,
} from "@/lib/firebase/verify-id-token";

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
      const verified = await lookupFirebaseIdToken(idToken);
      if (!verified) {
        return NextResponse.json({ error: "session-failed" }, { status: 401 });
      }
      const response = NextResponse.json({ ok: true, mode: "id-token" });
      response.cookies.set(
        CMS_SESSION_COOKIE,
        `${CMS_ID_TOKEN_COOKIE_PREFIX}${idToken}`,
        sessionCookieOptions(CMS_ID_TOKEN_MAX_AGE_SEC),
      );
      return response;
    }
    await auth.verifyIdToken(idToken);
    const cookie = await createCmsSessionCookie(idToken);
    const response = NextResponse.json({ ok: true, mode: "admin" });
    response.cookies.set(CMS_SESSION_COOKIE, cookie, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "session-failed" }, { status: 401 });
  }
}
