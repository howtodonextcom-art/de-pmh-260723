import { NextResponse } from "next/server";

import { CatalogPersistError, deleteCmsProject, getCmsProject, saveCmsProject } from "@/lib/catalog";
import type { CmsProjectDoc } from "@/lib/cms/types";
import { readCmsIdToken, readCmsSession } from "@/lib/firebase/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  const project = await getCmsProject(slug);
  if (!project) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await readCmsSession();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const { slug } = await params;
    const body = (await request.json()) as CmsProjectDoc;
    if (!body || body.slug !== slug) {
      return NextResponse.json({ error: "slug-mismatch" }, { status: 400 });
    }
    const saved = await saveCmsProject(body, session.email, { idToken: await readCmsIdToken() });
    return NextResponse.json({ project: saved });
  } catch (err) {
    const code = err instanceof CatalogPersistError ? err.code : "persist-failed";
    return NextResponse.json({ error: code }, { status: code === "firestore-unconfigured" ? 503 : 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await readCmsSession();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const { slug } = await params;
    await deleteCmsProject(slug, { idToken: await readCmsIdToken() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const code = err instanceof CatalogPersistError ? err.code : "persist-failed";
    return NextResponse.json({ error: code }, { status: code === "firestore-unconfigured" ? 503 : 500 });
  }
}
