import { NextResponse } from "next/server";

import { CatalogPersistError, loadCatalog, saveCmsProject } from "@/lib/catalog";
import { createEmptyProject } from "@/lib/cms/empty-project";
import { isValidSlug, slugifyName } from "@/lib/cms/slug";
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
    const doc = await saveCmsProject(createEmptyProject(slug, name), session.email, { idToken });
    return NextResponse.json({ project: doc });
  } catch (err) {
    const code = err instanceof CatalogPersistError ? err.code : "persist-failed";
    return jsonError(code, code === "firestore-unconfigured" ? 503 : 500);
  }
}
