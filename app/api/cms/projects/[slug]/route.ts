import { NextResponse } from "next/server";

import { deleteCmsProject, getCmsProject, saveCmsProject } from "@/lib/catalog";
import type { CmsProjectDoc } from "@/lib/cms/types";
import { readCmsSession } from "@/lib/firebase/session";

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
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  const body = (await request.json()) as CmsProjectDoc;
  if (!body || body.slug !== slug) {
    return NextResponse.json({ error: "slug-mismatch" }, { status: 400 });
  }
  const saved = await saveCmsProject(body, session.email);
  return NextResponse.json({ project: saved });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  await deleteCmsProject(slug);
  return NextResponse.json({ ok: true });
}
