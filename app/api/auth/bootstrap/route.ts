import { NextResponse } from "next/server";

import { getCmsBootstrapEnv, isFirebaseAdminConfigured } from "@/lib/config/env.server";
import { getFirebaseAdminInitError } from "@/lib/firebase/admin";
import { ensureBootstrapUser } from "@/lib/firebase/session";

export async function POST() {
  const result = await ensureBootstrapUser();
  const bootstrap = getCmsBootstrapEnv();
  // #region agent log
  fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
    body: JSON.stringify({
      sessionId: "87c57b",
      runId: "post-fix",
      hypothesisId: "E",
      location: "app/api/auth/bootstrap/route.ts:POST",
      message: "bootstrap-result",
      data: {
        result,
        adminConfigured: isFirebaseAdminConfigured(),
        initError: getFirebaseAdminInitError(),
        hasBootstrapEmail: Boolean(bootstrap.email),
        hasBootstrapPassword: Boolean(bootstrap.password),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return NextResponse.json({ ok: true, result });
}
