#!/usr/bin/env node
/**
 * Snapshot vendor seed + local mirrored logos so a future admin form
 * (Phase 1) can re-import project data without depending on live sites.
 *
 * Usage: npm run backup:seed
 * Output: backups/seed-YYYY-MM-DDTHHMMSS/
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "vendor/data/13_PROJECT_DATA_SCHEMA.json",
  "vendor/data/08_IMAGE_ASSET_MANIFEST.csv",
  "vendor/data/image-mirror-map.json",
  "vendor/data/scripts/image-verify-report.json",
];

const DIRS = ["public/vendor-images"];

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function main() {
  const id = `seed-${stamp()}`;
  const dest = path.join(ROOT, "backups", id);
  mkdirSync(dest, { recursive: true });

  const copied = [];
  const missing = [];

  for (const rel of FILES) {
    const src = path.join(ROOT, rel);
    if (!existsSync(src)) {
      missing.push(rel);
      continue;
    }
    const out = path.join(dest, rel);
    mkdirSync(path.dirname(out), { recursive: true });
    copyFileSync(src, out);
    copied.push(rel);
  }

  for (const rel of DIRS) {
    const src = path.join(ROOT, rel);
    if (!existsSync(src)) {
      missing.push(rel);
      continue;
    }
    cpSync(src, path.join(dest, rel), { recursive: true });
    copied.push(`${rel}/`);
  }

  const restore = [
    "Restore seed into a fresh checkout:",
    "  1. Copy vendor/data/* from this folder back to repo vendor/data/",
    "  2. Copy public/vendor-images/ back to repo public/vendor-images/",
    "  3. Restart `npm run dev` (library-bridge reads vendor/data at runtime).",
    "Later (Phase 1 admin form): import 13_PROJECT_DATA_SCHEMA.json + CSV rows",
    "as the first catalog, then edit via /lab/projects.",
  ].join("\n");

  writeFileSync(
    path.join(dest, "manifest.json"),
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        id,
        copied,
        missing,
        restore,
      },
      null,
      2,
    ),
  );
  writeFileSync(path.join(dest, "RESTORE.txt"), restore + "\n");

  if (copied.length === 0) {
    console.error("backup:seed — nothing copied");
    process.exit(1);
  }

  console.log(`backup:seed — ${copied.length} item(s) → backups/${id}/`);
  if (missing.length) console.warn("missing:", missing.join(", "));
}

main();
