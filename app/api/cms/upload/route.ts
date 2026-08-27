import { NextResponse } from "next/server";

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { CMS_IMAGE_CATEGORIES } from "@/lib/cms/constants";
import type { CmsAsset } from "@/lib/cms/types";
import { getAdminStorage } from "@/lib/firebase/admin";
import { readCmsSession } from "@/lib/firebase/session";

function extOf(name: string, type: string): string {
  const fromName = path.extname(name).replace(".", "").toLowerCase();
  if (fromName) return fromName.slice(0, 8);
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("svg")) return "svg";
  return "jpg";
}

export async function POST(request: Request) {
  const session = await readCmsSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const slug = String(form.get("slug") ?? "").trim();
  const category = String(form.get("category") ?? "gallery").trim();
  const alt = String(form.get("alt") ?? "").trim();

  if (!(file instanceof File) || !slug) {
    return NextResponse.json({ error: "missing-file" }, { status: 400 });
  }
  if (!CMS_IMAGE_CATEGORIES.includes(category as (typeof CMS_IMAGE_CATEGORIES)[number]) && category !== "gallery") {
    return NextResponse.json({ error: "bad-category" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stamp = Date.now();
  const ext = extOf(file.name, file.type);
  const assetId = `${slug}-${category}-${stamp}`;
  const storagePath = `projects/${slug}/${assetId}.${ext}`;

  let url = "";
  const storage = getAdminStorage();
  if (storage) {
    try {
      const bucket = storage.bucket();
      const object = bucket.file(storagePath);
      await object.save(buffer, {
        metadata: { contentType: file.type || `image/${ext}` },
        public: true,
      });
      await object.makePublic();
      url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
    } catch {
      url = "";
    }
  }

  if (!url) {
    const dir = path.join(process.cwd(), "public", "cms-uploads", slug);
    mkdirSync(dir, { recursive: true });
    const filename = `${assetId}.${ext}`;
    writeFileSync(path.join(dir, filename), buffer);
    url = `/cms-uploads/${slug}/${filename}`;
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

  return NextResponse.json({ asset });
}
