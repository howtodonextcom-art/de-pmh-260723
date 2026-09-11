import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";

import { CatalogPersistError, getCmsProject, saveCmsProject } from "@/lib/catalog";
import { storageObjectPathFromAsset, stripCmsAsset } from "@/lib/cms/project-assets";
import { localCmsUploadRelPath } from "@/lib/cms/upload-ext";
import { isFirebaseAdminConfigured } from "@/lib/config/env.server";
import { getAdminStorage } from "@/lib/firebase/admin";
import { readCmsIdToken, readCmsSession } from "@/lib/firebase/session";
import { restDeleteObject } from "@/lib/firebase/storage-rest";

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

async function readBody(request: Request): Promise<{ slug: string; assetId: string }> {
  const url = new URL(request.url);
  let slug = (url.searchParams.get("slug") ?? "").trim();
  let assetId = (url.searchParams.get("assetId") ?? "").trim();
  if (slug && assetId) return { slug, assetId };
  const raw = await request.text();
  if (!raw) return { slug, assetId };
  try {
    const body = JSON.parse(raw) as { slug?: unknown; assetId?: unknown };
    if (!slug) slug = String(body.slug ?? "").trim();
    if (!assetId) assetId = String(body.assetId ?? "").trim();
  } catch {
    return { slug, assetId };
  }
  return { slug, assetId };
}

async function deleteStorageObject(objectPath: string, idToken: string | null): Promise<{
  ok: boolean;
  branch: string;
}> {
  const storage = getAdminStorage();
  if (storage) {
    try {
      await storage.bucket().file(objectPath).delete({ ignoreNotFound: true });
      return { ok: true, branch: "admin" };
    } catch {
      // fall through to REST
    }
  }
  if (idToken) {
    const deleted = await restDeleteObject(objectPath, idToken);
    if (deleted.ok) return { ok: true, branch: deleted.status === 404 ? "rest-404" : "rest" };
    return { ok: false, branch: `rest-${deleted.status}` };
  }
  return { ok: false, branch: storage || isFirebaseAdminConfigured() ? "admin-failed" : "unconfigured" };
}

async function unlinkLocalUpload(url: string): Promise<boolean> {
  if (process.env.VERCEL) return false;
  const rel = localCmsUploadRelPath(url);
  if (!rel) return false;
  const abs = path.join(process.cwd(), "public", ...rel.split("/"));
  try {
    await unlink(abs);
    return true;
  } catch (err) {
    const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
    if (code === "ENOENT") return true;
    return false;
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await readCmsSession();
    if (!session) return jsonError("unauthorized", 401);

    const { slug, assetId } = await readBody(request);
    if (!slug || !assetId) return jsonError("missing-fields", 400);

    const project = await getCmsProject(slug);
    if (!project) return jsonError("not-found", 404);

    const asset = (project.assets ?? []).find((item) => item.assetId === assetId);
    if (!asset) return jsonError("asset-not-found", 404);

    const objectPath = storageObjectPathFromAsset(asset);
    const sourceUrl = asset.resolvedUrl || asset.sourceFileUrl || "";
    const idToken = await readCmsIdToken();

    if (objectPath) {
      const result = await deleteStorageObject(objectPath, idToken);
      if (!result.ok) {
        if (result.branch === "unconfigured") return jsonError("storage-unconfigured", 503);
        return jsonError("storage-delete-failed", 500);
      }
    }

    const localRel = localCmsUploadRelPath(sourceUrl);
    if (localRel) {
      await unlinkLocalUpload(sourceUrl);
    }

    const saved = await saveCmsProject(stripCmsAsset(project, assetId), session.email, { idToken });
    return NextResponse.json({ project: saved, deleted: true });
  } catch (err) {
    const code = err instanceof CatalogPersistError ? err.code : "persist-failed";
    return jsonError(code, code === "firestore-unconfigured" ? 503 : 500);
  }
}
