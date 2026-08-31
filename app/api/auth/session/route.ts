import { NextResponse } from "next/server";

import { CMS_SESSION_COOKIE } from "@/lib/cms/constants";
import {
  getFirebaseAdminEnv,
  getFirebaseClientEnv,
  isFirebaseAdminConfigured,
  isFirebaseClientConfigured,
} from "@/lib/config/env.server";
import { createCmsSessionCookie, ensureBootstrapUser, sessionCookieOptions } from "@/lib/firebase/session";
import { getAdminAuth, getFirebaseAdminInitError } from "@/lib/firebase/admin";
import {
  CMS_ID_TOKEN_COOKIE_PREFIX,
  CMS_ID_TOKEN_MAX_AGE_SEC,
  lookupFirebaseIdToken,
} from "@/lib/firebase/verify-id-token";

function agentAdminSnapshot() {
  const env = getFirebaseAdminEnv();
  const client = getFirebaseClientEnv();
  return {
    hasProjectId: Boolean(env.projectId),
    hasClientEmail: Boolean(env.clientEmail),
    hasPrivateKey: Boolean(env.privateKey),
    hasPemPair: Boolean(env.clientEmail && env.privateKey),
    hasCredentialsPath: Boolean(env.credentialsPath),
    adminConfigured: isFirebaseAdminConfigured(),
    initError: getFirebaseAdminInitError(),
    hasPublicProjectId: Boolean(client.projectId),
    clientConfigured: isFirebaseClientConfigured(),
  };
}

export async function POST(request: Request) {
  try {
    await ensureBootstrapUser();
    const body = (await request.json()) as { idToken?: string };
    const idToken = body.idToken?.trim();
    if (!idToken) {
      return NextResponse.json({ error: "missing-token" }, { status: 400 });
    }
    const auth = getAdminAuth();
    const debug = agentAdminSnapshot();
    if (!auth) {
      const verified = await lookupFirebaseIdToken(idToken);
      // #region agent log
      fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
        body: JSON.stringify({
          sessionId: "87c57b",
          runId: "post-fix",
          hypothesisId: "F",
          location: "app/api/auth/session/route.ts:POST",
          message: verified ? "id-token-fallback-ok" : "id-token-fallback-fail",
          data: { ...debug, hasIdToken: Boolean(idToken), branch: "idt-fallback", verified: Boolean(verified) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
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
    // #region agent log
    fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
      body: JSON.stringify({
        sessionId: "87c57b",
        runId: "post-fix",
        hypothesisId: "D",
        location: "app/api/auth/session/route.ts:POST",
        message: "admin-auth-ready",
        data: { ...debug, hasIdToken: Boolean(idToken), branch: "admin-session" },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    await auth.verifyIdToken(idToken);
    const cookie = await createCmsSessionCookie(idToken);
    const response = NextResponse.json({ ok: true, mode: "admin" });
    response.cookies.set(CMS_SESSION_COOKIE, cookie, sessionCookieOptions());
    return response;
  } catch (err) {
    const code = typeof err === "object" && err && "code" in err ? String((err as { code?: string }).code) : "";
    // #region agent log
    fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
      body: JSON.stringify({
        sessionId: "87c57b",
        runId: "post-fix",
        hypothesisId: "C",
        location: "app/api/auth/session/route.ts:catch",
        message: "session-failed",
        data: { errorCode: code || "unknown", initError: getFirebaseAdminInitError() },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return NextResponse.json({ error: "session-failed" }, { status: 401 });
  }
}
