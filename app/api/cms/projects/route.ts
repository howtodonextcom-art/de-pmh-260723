import { NextResponse } from "next/server";

import { loadCatalog, saveCmsProject } from "@/lib/catalog";
import { createEmptyProject } from "@/lib/cms/empty-project";
import { isValidSlug, slugifyName } from "@/lib/cms/slug";
import { readCmsSession } from "@/lib/firebase/session";

export async function GET() {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const catalog = await loadCatalog();
  return NextResponse.json({
    source: catalog.source,
    projects: catalog.projects,
  });
}

export async function POST(request: Request) {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as { displayNameVi?: string; slug?: string };
  const name = body.displayNameVi?.trim();
  if (!name) return NextResponse.json({ error: "missing-name" }, { status: 400 });
  const slug = (body.slug?.trim() || slugifyName(name)).toLowerCase();
  if (!isValidSlug(slug)) return NextResponse.json({ error: "invalid-slug" }, { status: 400 });
  const catalog = await loadCatalog();
  if (catalog.projects.some((p) => p.slug === slug)) {
    return NextResponse.json({ error: "slug-taken" }, { status: 409 });
  }
  const doc = await saveCmsProject(createEmptyProject(slug, name), session.email);
  return NextResponse.json({ project: doc });
}
