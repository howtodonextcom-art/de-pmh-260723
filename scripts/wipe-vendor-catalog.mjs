#!/usr/bin/env node
/**
 * Strip every hardcoded catalog record from vendor seed + mirrored images.
 * Does not touch backups/. Run only after backup:seed / backup:views / backup:full.
 */
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const schema = {
  $comment:
    "DED-PMH project data model — schema only. Live catalog lives in Firebase/CMS, not git.",
  schemaVersion: "1.0",
  fieldStatusEnum: [
    "da-co-du-lieu",
    "chua-xac-thuc",
    "mau-thuan",
    "chua-co-du-lieu",
    "bao-mat",
  ],
  projects: [],
};

writeFileSync(
  path.join(ROOT, "vendor/data/13_PROJECT_DATA_SCHEMA.json"),
  JSON.stringify(schema, null, 2) + "\n",
  "utf8",
);

const csvHeader =
  "Asset ID,Dự án,Danh mục,Mô tả,Alt text đề xuất,URL trang nguồn,URL file,Kích thước,Tỷ lệ,Định dạng,Watermark,Quyền sử dụng,Chất lượng (0-10),Công năng đề xuất\n";
writeFileSync(path.join(ROOT, "vendor/data/08_IMAGE_ASSET_MANIFEST.csv"), csvHeader, "utf8");
writeFileSync(path.join(ROOT, "vendor/data/image-mirror-map.json"), "{}\n", "utf8");

const verifyPath = path.join(ROOT, "vendor/data/scripts/image-verify-report.json");
mkdirSync(path.dirname(verifyPath), { recursive: true });
writeFileSync(verifyPath, "[]\n", "utf8");

const imagesDir = path.join(ROOT, "public/vendor-images");
mkdirSync(imagesDir, { recursive: true });
let removed = 0;
for (const name of readdirSync(imagesDir)) {
  if (name === ".gitkeep") continue;
  unlinkSync(path.join(imagesDir, name));
  removed += 1;
}
writeFileSync(path.join(imagesDir, ".gitkeep"), "", "utf8");

console.log(`wipe-vendor-catalog — projects=[], csv header only, images removed: ${removed}`);
