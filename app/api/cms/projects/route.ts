import { NextResponse } from "next/server";

import { CatalogPersistError, loadCatalog, saveCmsProject } from "@/lib/catalog";
import { createEmptyProject } from "@/lib/cms/empty-project";
import { isValidSlug, slugifyName } from "@/lib/cms/slug";
import { isFirebaseAdminConfigured } from "@/lib/config/env.server";
import { readCmsIdToken, readCmsSession } from "@/lib/firebase/session";

function jsonError(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status });
}

export async function GET() {
  const session = await readCmsSession();
  if (!session) return jsonError("unauthorized", 401);
  const catalog = await loadCatalog();
  return NextResponse.json({
    source: catalog.source,
    projects: catalog.projects,
  });
}

export async function POST(request: Request) {
  try {
    const session = await readCmsSession();
    if (!session) return jsonError("unauthorized", 401);
    const body = (await request.json()) as { displayNameVi?: string; slug?: string };
    const name = body.displayNameVi?.trim();
    if (!name) return jsonError("missing-name", 400);
    const slug = (body.slug?.trim() || slugifyName(name)).toLowerCase();
    if (!isValidSlug(slug)) return jsonError("invalid-slug", 400);
    const catalog = await loadCatalog();
    if (catalog.projects.some((p) => p.slug === slug)) {
      return jsonError("slug-taken", 409);
    }
    const idToken = await readCmsIdToken();
    const adminConfigured = isFirebaseAdminConfigured();
    // #region agent log
    fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
      body: JSON.stringify({
        sessionId: "87c57b",
        runId: "post-fix",
        hypothesisId: adminConfigured ? "A" : "B",
        location: "app/api/cms/projects/route.ts:POST",
        message: "create-project",
        data: {
          adminConfigured,
          hasIdToken: Boolean(idToken),
          isVercel: Boolean(process.env.VERCEL),
          slugOk: Boolean(slug),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const doc = await saveCmsProject(createEmptyProject(slug, name), session.email, { idToken });
    return NextResponse.json({ project: doc });
  } catch (err) {
    const code = err instanceof CatalogPersistError ? err.code : "persist-failed";
    // #region agent log
    fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
      body: JSON.stringify({
        sessionId: "87c57b",
        runId: "post-fix",
        hypothesisId: "B",
        location: "app/api/cms/projects/route.ts:POST:catch",
        message: "create-project-failed",
        data: { code, detail: err instanceof Error ? err.message : "unknown", isVercel: Boolean(process.env.VERCEL) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return jsonError(code, code === "firestore-unconfigured" ? 503 : 500);
  }
}
