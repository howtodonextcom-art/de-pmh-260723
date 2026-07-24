/**
 * R1 (commercial audit Wave-2) — durable local mirror of project images.
 *
 * Downloads every unique "URL file" in vendor/data/08_IMAGE_ASSET_MANIFEST.csv
 * into public/vendor-images/<assetId>.<ext>, then writes
 * vendor/data/image-mirror-map.json (assetId -> local /vendor-images/... path).
 * loadImagesForV0() in vendor/library/library/seed-adapter.ts reads that map
 * and prefers the local path over the live honghacphumyhung.vn/phumyhung.vn
 * URL — so the UI stops depending on a third party staying online.
 *
 * Does NOT clear copyright/usage rights (see "Quyền sử dụng" column — all
 * rows are "permission-review-required" or "cần tạo mới") — this only fixes
 * the *availability* risk (dead link if the source site changes), not the
 * *licensing* risk. Documented honestly in docs/WHAT_YOU_BUY.md.
 *
 * Usage: node scripts/mirror-project-images.mjs
 */
import fs from "node:fs";
import path from "node:path";

const CSV_PATH = path.resolve("vendor/data/08_IMAGE_ASSET_MANIFEST.csv");
const OUT_DIR = path.resolve("public/vendor-images");
const MAP_PATH = path.resolve("vendor/data/image-mirror-map.json");
const REPORT_PATH = path.resolve("reports/assets/commercial-rem-mirror-report.json");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCsv(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean);
  return ext && ext.length <= 5 ? ext : ".jpg";
}

const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf-8"));
console.log(`Manifest rows: ${rows.length}`);

const map = fs.existsSync(MAP_PATH) ? JSON.parse(fs.readFileSync(MAP_PATH, "utf-8")) : {};
const results = { downloaded: [], skippedExisting: [], failed: [] };

for (const row of rows) {
  const assetId = row["Asset ID"];
  const url = row["URL file"];
  if (!assetId || !url) continue;

  const ext = extFromUrl(url);
  const filename = `${assetId}${ext}`;
  const localPath = path.join(OUT_DIR, filename);
  const publicPath = `/vendor-images/${filename}`;

  if (fs.existsSync(localPath) && map[assetId] === publicPath) {
    results.skippedExisting.push(assetId);
    continue;
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DED-PMH-image-mirror/1.0)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(localPath, buf);
    map[assetId] = publicPath;
    results.downloaded.push({ assetId, url, bytes: buf.length });
    console.log(`OK  ${assetId}  (${buf.length} bytes)  <- ${url}`);
  } catch (e) {
    results.failed.push({ assetId, url, error: String(e) });
    console.log(`FAIL ${assetId}  <- ${url}  (${String(e)})`);
  }
}

fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
fs.writeFileSync(
  REPORT_PATH,
  JSON.stringify(
    {
      ranAt: new Date().toISOString(),
      totalRows: rows.length,
      downloaded: results.downloaded.length,
      skippedExisting: results.skippedExisting.length,
      failed: results.failed.length,
      failures: results.failed,
    },
    null,
    2,
  ),
);

console.log("\n--- Summary ---");
console.log(`Downloaded:       ${results.downloaded.length}`);
console.log(`Already mirrored: ${results.skippedExisting.length}`);
console.log(`Failed:           ${results.failed.length}`);
console.log(`Map written to ${MAP_PATH}`);
console.log(`Report written to ${REPORT_PATH}`);
