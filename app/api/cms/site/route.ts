import { NextResponse } from "next/server";

import { CatalogPersistError, loadCatalog, saveCmsSettings } from "@/lib/catalog";
import type { CmsSiteSettings } from "@/lib/cms/types";
import { readCmsIdToken, readCmsSession } from "@/lib/firebase/session";

export async function GET() {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const catalog = await loadCatalog();
  return NextResponse.json({ settings: catalog.settings });
}

export async function PUT(request: Request) {
  try {
    const session = await readCmsSession();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const body = (await request.json()) as CmsSiteSettings;
    const saved = await saveCmsSettings(body, { idToken: await readCmsIdToken() });
    return NextResponse.json({ settings: saved });
  } catch (err) {
    const code = err instanceof CatalogPersistError ? err.code : "persist-failed";
    return NextResponse.json({ error: code }, { status: code === "firestore-unconfigured" ? 503 : 500 });
  }
}
