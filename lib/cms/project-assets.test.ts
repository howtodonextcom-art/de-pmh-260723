import { describe, expect, it } from "vitest";

import { createEmptyProject } from "@/lib/cms/empty-project";
import { appendCmsAsset, storageObjectPathFromAsset, stripCmsAsset } from "@/lib/cms/project-assets";
import type { CmsAsset } from "@/lib/cms/types";
import { cmsStorageObjectPath, localCmsUploadRelPath } from "@/lib/cms/upload-ext";
import {
  firebaseStorageDownloadUrl,
  firebaseStorageObjectUrl,
  parseStorageObjectPath,
} from "@/lib/firebase/storage-urls";

function asset(partial: Partial<CmsAsset> & Pick<CmsAsset, "assetId" | "category">): CmsAsset {
  return {
    projectSlug: "hong-hac-city",
    description: partial.assetId,
    alt: partial.assetId,
    sourcePageUrl: "",
    sourceFileUrl: partial.sourceFileUrl ?? "",
    isRender: false,
    verified: true,
    resolvedUrl: partial.resolvedUrl,
    ...partial,
  };
}

describe("appendCmsAsset / stripCmsAsset", () => {
  it("appends N assets and sets hero / gallery ids without dropping prior items", () => {
    let doc = createEmptyProject("hong-hac-city", "Hồng Hạc");
    const a = asset({ assetId: "a-hero", category: "hero" });
    const b = asset({ assetId: "b-product", category: "product" });
    const c = asset({ assetId: "c-product", category: "product" });
    doc = appendCmsAsset(doc, a, "hero");
    doc = appendCmsAsset(doc, b, "product");
    doc = appendCmsAsset(doc, c, "product");
    expect(doc.assets.map((x) => x.assetId)).toEqual(["a-hero", "b-product", "c-product"]);
    expect(doc.heroAssetId).toBe("a-hero");
    expect(doc.galleryAssetIds).toEqual(["b-product", "c-product"]);
  });

  it("does not overwrite an existing heroAssetId", () => {
    let doc = createEmptyProject("hong-hac-city", "Hồng Hạc");
    doc = appendCmsAsset(doc, asset({ assetId: "hero-1", category: "hero" }), "hero");
    doc = appendCmsAsset(doc, asset({ assetId: "hero-2", category: "hero" }), "hero");
    expect(doc.heroAssetId).toBe("hero-1");
    expect(doc.assets).toHaveLength(2);
  });

  it("strips the asset from assets, heroAssetId, and galleryAssetIds", () => {
    let doc = createEmptyProject("hong-hac-city", "Hồng Hạc");
    doc = appendCmsAsset(doc, asset({ assetId: "hero-1", category: "hero" }), "hero");
    doc = appendCmsAsset(doc, asset({ assetId: "g-1", category: "product" }), "product");
    doc = appendCmsAsset(doc, asset({ assetId: "g-2", category: "product" }), "product");
    const afterHero = stripCmsAsset(doc, "hero-1");
    expect(afterHero.heroAssetId).toBeNull();
    expect(afterHero.assets.map((x) => x.assetId)).toEqual(["g-1", "g-2"]);
    expect(afterHero.galleryAssetIds).toEqual(["g-1", "g-2"]);
    const afterOne = stripCmsAsset(doc, "g-1");
    expect(afterOne.heroAssetId).toBe("hero-1");
    expect(afterOne.galleryAssetIds).toEqual(["g-2"]);
    expect(afterOne.assets.map((x) => x.assetId)).toEqual(["hero-1", "g-2"]);
  });
});

describe("parseStorageObjectPath", () => {
  it("parses Firebase download URLs", () => {
    const url = firebaseStorageDownloadUrl("bucket.appspot.com", "projects/hong-hac-city/id.jpg", "tok");
    expect(parseStorageObjectPath(url)).toBe("projects/hong-hac-city/id.jpg");
    expect(firebaseStorageObjectUrl("bucket.appspot.com", "projects/a/b.jpg")).toContain(
      "/o/projects%2Fa%2Fb.jpg",
    );
  });

  it("parses storage.googleapis.com URLs", () => {
    expect(
      parseStorageObjectPath("https://storage.googleapis.com/my-bucket/projects/hong-hac-city/id.png"),
    ).toBe("projects/hong-hac-city/id.png");
  });

  it("returns null for local cms-uploads URLs", () => {
    expect(parseStorageObjectPath("/cms-uploads/hong-hac-city/id.jpg")).toBeNull();
  });
});

describe("storageObjectPathFromAsset", () => {
  it("prefers the URL path and falls back to cmsStorageObjectPath", () => {
    expect(
      storageObjectPathFromAsset(
        asset({
          assetId: "id",
          category: "hero",
          sourceFileUrl: firebaseStorageDownloadUrl("b.appspot.com", "projects/hong-hac-city/id.jpg"),
        }),
      ),
    ).toBe("projects/hong-hac-city/id.jpg");
    expect(
      storageObjectPathFromAsset(
        asset({
          assetId: "fallback-id",
          category: "hero",
          sourceFileUrl: "https://cdn.example/fallback-id.webp",
        }),
      ),
    ).toBe(cmsStorageObjectPath("hong-hac-city", "fallback-id", "webp"));
    expect(
      storageObjectPathFromAsset(
        asset({
          assetId: "local",
          category: "hero",
          sourceFileUrl: "/cms-uploads/hong-hac-city/local.jpg",
        }),
      ),
    ).toBeNull();
  });
});

describe("localCmsUploadRelPath", () => {
  it("accepts nested cms-uploads paths and rejects traversal", () => {
    expect(localCmsUploadRelPath("/cms-uploads/hong-hac-city/a.jpg")).toBe(
      "cms-uploads/hong-hac-city/a.jpg",
    );
    expect(localCmsUploadRelPath("/cms-uploads/../etc/passwd")).toBeNull();
    expect(localCmsUploadRelPath("/other/a.jpg")).toBeNull();
  });
});
