import { NextResponse } from "next/server";

import { loadCatalog, saveCmsSettings } from "@/lib/catalog";
import type { CmsSiteSettings } from "@/lib/cms/types";
import { readCmsSession } from "@/lib/firebase/session";

export async function GET() {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const catalog = await loadCatalog();
  return NextResponse.json({ settings: catalog.settings });
}

export async function PUT(request: Request) {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json()) as CmsSiteSettings;
  const saved = await saveCmsSettings(body);
  return NextResponse.json({ settings: saved });
}
