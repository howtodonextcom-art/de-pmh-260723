import { describe, expect, it } from "vitest";

import { cmsStorageObjectPath, extOf } from "@/lib/cms/upload-ext";
import { firebaseStorageDownloadUrl, firebaseStorageUploadUrl } from "@/lib/firebase/storage-urls";

describe("upload helpers", () => {
  it("picks a safe extension", () => {
    expect(extOf("hero.PNG", "image/png")).toBe("png");
    expect(extOf("x", "image/webp")).toBe("webp");
    expect(extOf("evil.exe", "application/octet-stream")).toBe("exe");
    expect(extOf("no-ext", "image/jpeg")).toBe("jpg");
  });

  it("builds the Storage object path under projects/{slug}", () => {
    expect(cmsStorageObjectPath("hong-hac-city", "hong-hac-city-hero-1", "jpg")).toBe(
      "projects/hong-hac-city/hong-hac-city-hero-1.jpg",
    );
  });

  it("builds Firebase Storage URLs", () => {
    expect(firebaseStorageUploadUrl("bucket.appspot.com", "projects/a/b.jpg")).toContain(
      "name=projects%2Fa%2Fb.jpg",
    );
    expect(firebaseStorageDownloadUrl("bucket.appspot.com", "projects/a/b.jpg", "tok")).toContain(
      "alt=media",
    );
    expect(firebaseStorageDownloadUrl("bucket.appspot.com", "projects/a/b.jpg", "tok")).toContain(
      "token=tok",
    );
  });
});
