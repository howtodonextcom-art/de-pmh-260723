import { NextResponse } from "next/server";

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { CMS_IMAGE_CATEGORIES } from "@/lib/cms/constants";
import type { CmsAsset } from "@/lib/cms/types";
import { cmsStorageObjectPath, extOf } from "@/lib/cms/upload-ext";
import { getAdminStorage } from "@/lib/firebase/admin";
import { isFirebaseAdminConfigured } from "@/lib/config/env.server";
import { readCmsIdToken, readCmsSession } from "@/lib/firebase/session";
import { restUploadObject } from "@/lib/firebase/storage-rest";

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  try {
    const session = await readCmsSession();
    if (!session) return jsonError("unauthorized", 401);

    const form = await request.formData();
    const file = form.get("file");
    const slug = String(form.get("slug") ?? "").trim();
    const category = String(form.get("category") ?? "gallery").trim();
    const alt = String(form.get("alt") ?? "").trim();

    if (!(file instanceof File) || !slug) {
      return jsonError("missing-file", 400);
    }
    if (!CMS_IMAGE_CATEGORIES.includes(category as (typeof CMS_IMAGE_CATEGORIES)[number]) && category !== "gallery") {
      return jsonError("bad-category", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stamp = Date.now();
    const ext = extOf(file.name, file.type);
    const assetId = `${slug}-${category}-${stamp}`;
    const storagePath = cmsStorageObjectPath(slug, assetId, ext);
    const contentType = file.type || `image/${ext}`;
    const idToken = await readCmsIdToken();
    const adminConfigured = isFirebaseAdminConfigured();
    const isVercel = Boolean(process.env.VERCEL);

    let url = "";
    let branch = "none";

    const storage = getAdminStorage();
    if (storage) {
      try {
        const bucket = storage.bucket();
        const object = bucket.file(storagePath);
        await object.save(buffer, {
          metadata: { contentType },
          public: true,
        });
        await object.makePublic();
        url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
        branch = "admin";
      } catch {
        url = "";
      }
    }

    if (!url && idToken) {
      const uploaded = await restUploadObject(storagePath, buffer, contentType, idToken);
      if (uploaded.ok) {
        url = uploaded.url;
        branch = "rest";
      } else {
        branch = `rest-${uploaded.status}`;
      }
    }

    if (!url && !isVercel) {
      const dir = path.join(process.cwd(), "public", "cms-uploads", slug);
      mkdirSync(dir, { recursive: true });
      const filename = `${assetId}.${ext}`;
      writeFileSync(path.join(dir, filename), buffer);
      url = `/cms-uploads/${slug}/${filename}`;
      branch = "disk";
    }

    // #region agent log
    fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
      body: JSON.stringify({
        sessionId: "87c57b",
        runId: "post-fix",
        hypothesisId: url ? "B" : "A",
        location: "app/api/cms/upload/route.ts:POST",
        message: "cms-upload",
        data: {
          adminConfigured,
          hasAdminStorage: Boolean(storage),
          hasIdToken: Boolean(idToken),
          isVercel,
          branch,
          hasUrl: Boolean(url),
          uploaded: Boolean(url),
          fileCount: 1,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!url) {
      return jsonError(idToken ? "persist-failed" : "storage-unconfigured", idToken ? 500 : 503);
    }

    const asset: CmsAsset = {
      assetId,
      projectSlug: slug,
      category,
      description: alt || file.name,
      alt: alt || file.name,
      sourcePageUrl: "",
      sourceFileUrl: url,
      isRender: false,
      verified: true,
      resolvedUrl: url,
    };

    return NextResponse.json({ asset, branch });
  } catch {
    // #region agent log
    fetch("http://127.0.0.1:7413/ingest/850fced0-1d5d-4a0b-bc03-5e39fd9be8bf", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "87c57b" },
      body: JSON.stringify({
        sessionId: "87c57b",
        runId: "post-fix",
        hypothesisId: "A",
        location: "app/api/cms/upload/route.ts:catch",
        message: "cms-upload-throw",
        data: { isVercel: Boolean(process.env.VERCEL) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return jsonError("persist-failed", 500);
  }
}
