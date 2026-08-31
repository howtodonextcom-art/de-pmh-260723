import { describe, expect, it } from "vitest";

import { cmsStorageObjectPath, extOf, localCmsUploadRelPath } from "@/lib/cms/upload-ext";
import {
  firebaseStorageDownloadUrl,
  firebaseStorageObjectUrl,
  firebaseStorageUploadUrl,
  parseStorageObjectPath,
} from "@/lib/firebase/storage-urls";

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
    expect(firebaseStorageObjectUrl("bucket.appspot.com", "projects/a/b.jpg")).toBe(
      "https://firebasestorage.googleapis.com/v0/b/bucket.appspot.com/o/projects%2Fa%2Fb.jpg",
    );
  });

  it("parses a Storage object path from download URLs", () => {
    expect(
      parseStorageObjectPath(
        firebaseStorageDownloadUrl("bucket.appspot.com", "projects/hong-hac-city/x.jpg", "tok"),
      ),
    ).toBe("projects/hong-hac-city/x.jpg");
    expect(localCmsUploadRelPath("/cms-uploads/s/f.jpg")).toBe("cms-uploads/s/f.jpg");
  });
});
