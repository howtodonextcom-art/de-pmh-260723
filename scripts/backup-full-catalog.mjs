#!/usr/bin/env node
/**
 * Full catalog backup: vendor seed + images + remaining source hardcode
 * (home-content, site-nav, mock-data) as JSON so CMS restore does not depend
 * on git history after the catalog wipe.
 *
 * Usage: node scripts/backup-full-catalog.mjs
 * Output: backups/full-catalog-YYYY-MM-DDTHHMMSS/
 */
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "vendor/data/13_PROJECT_DATA_SCHEMA.json",
  "vendor/data/08_IMAGE_ASSET_MANIFEST.csv",
  "vendor/data/image-mirror-map.json",
  "vendor/data/scripts/image-verify-report.json",
  "lib/mock-data.ts",
  "lib/home-content.ts",
  "lib/config/site-nav.ts",
];

const DIRS = ["public/vendor-images"];

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function latestDir(prefix) {
  const backups = path.join(ROOT, "backups");
  if (!existsSync(backups)) return null;
  const names = readdirSync(backups)
    .filter((name) => name.startsWith(prefix))
    .map((name) => ({ name, mtime: statSync(path.join(backups, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  return names[0] ? path.join("backups", names[0].name) : null;
}

function extractHomeContent(src) {
  const brand =
    src.match(/brandStatementVi:\s*\n?\s*"((?:\\.|[^"\\])*)"/)?.[1]?.replace(/\\"/g, '"') ?? null;
  const updates = [];
  const re =
    /\{\s*id:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*projectSlug:\s*"([^"]+)",\s*textVi:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
  let m;
  while ((m = re.exec(src))) {
    updates.push({
      id: m[1],
      date: m[2],
      projectSlug: m[3],
      textVi: m[4].replace(/\\"/g, '"'),
    });
  }
  return { brandStatementVi: brand, updates };
}

function main() {
  const id = `full-catalog-${stamp()}`;
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

  const schemaPath = path.join(ROOT, "vendor/data/13_PROJECT_DATA_SCHEMA.json");
  let slugs = [];
  if (existsSync(schemaPath)) {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
    slugs = (schema.projects ?? []).map((p) => p.slug).filter(Boolean);
    writeFileSync(
      path.join(dest, "catalog-projects.json"),
      JSON.stringify(schema.projects ?? [], null, 2) + "\n",
      "utf8",
    );
    copied.push("catalog-projects.json");
  }

  const homeSrc = path.join(ROOT, "lib/home-content.ts");
  if (existsSync(homeSrc)) {
    const extracted = extractHomeContent(readFileSync(homeSrc, "utf8"));
    writeFileSync(
      path.join(dest, "home-content.json"),
      JSON.stringify(extracted, null, 2) + "\n",
      "utf8",
    );
    copied.push("home-content.json");
  }

  const navSrc = path.join(ROOT, "lib/config/site-nav.ts");
  if (existsSync(navSrc)) {
    writeFileSync(
      path.join(dest, "site-nav.source.ts"),
      readFileSync(navSrc, "utf8"),
      "utf8",
    );
    copied.push("site-nav.source.ts");
  }

  const latestViews = latestDir("view-snapshot-");
  if (latestViews) {
    const from = path.join(ROOT, latestViews);
    const to = path.join(dest, "view-snapshot");
    cpSync(from, to, { recursive: true });
    copied.push(`view-snapshot/ (from ${latestViews})`);
  }

  const runtimeSnap = path.join(ROOT, "data/runtime/snapshots");
  if (existsSync(runtimeSnap)) {
    cpSync(runtimeSnap, path.join(dest, "runtime-snapshots"), { recursive: true });
    copied.push("runtime-snapshots/");
  }

  const restore = [
    "Restore this full catalog backup:",
    "  1. Vendor seed: copy vendor/data/* back to repo vendor/data/",
    "  2. Images: copy public/vendor-images/ back to repo public/vendor-images/",
    "  3. Firestore (preferred after CMS): node scripts/seed-firestore-from-backup.mjs --dir backups/" +
      id,
    "  4. Do not commit this folder. Catalog must live in Firebase, not git.",
  ].join("\n");

  writeFileSync(
    path.join(dest, "manifest.json"),
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        id,
        slugs,
        projectCount: slugs.length,
        copied,
        missing,
        latestViewSnapshot: latestViews,
        restore,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(path.join(dest, "RESTORE.txt"), restore + "\n", "utf8");

  if (copied.length === 0) {
    console.error("backup:full — nothing copied");
    process.exit(1);
  }

  console.log(
    `backup:full — ${slugs.length} project(s) [${slugs.join(", ")}] → backups/${id}/`,
  );
  if (missing.length) console.warn("missing:", missing.join(", "));
}

main();
