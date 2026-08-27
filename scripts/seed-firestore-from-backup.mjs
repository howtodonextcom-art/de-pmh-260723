#!/usr/bin/env node
/**
 * Optional restore: import a full-catalog backup into Firestore.
 * Gated — does nothing without service.json / Admin credentials.
 *
 * Usage: node scripts/seed-firestore-from-backup.mjs --dir backups/full-catalog-YYYY-MM-DDTHHMMSS
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function arg(name) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : "";
}

async function main() {
  const rel = arg("--dir");
  if (!rel) {
    console.log("usage: node scripts/seed-firestore-from-backup.mjs --dir backups/full-catalog-<stamp>");
    process.exit(1);
  }
  const dir = path.resolve(ROOT, rel);
  const catalogFile = path.join(dir, "catalog-projects.json");
  if (!existsSync(catalogFile)) {
    console.error("missing catalog-projects.json in", rel);
    process.exit(1);
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service.json";
  const absCred = path.resolve(ROOT, credPath);
  if (!existsSync(absCred) && !process.env.FIREBASE_PRIVATE_KEY) {
    console.log("seed-firestore: skipped (no Admin credentials). Catalog stays in backups/ only.");
    process.exit(0);
  }

  const { initializeApp, cert, getApps } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const account = JSON.parse(readFileSync(absCred, "utf8"));
  const app = getApps()[0] ?? initializeApp({ credential: cert(account), projectId: account.project_id });
  const db = getFirestore(app);

  const projects = JSON.parse(readFileSync(catalogFile, "utf8"));
  if (!Array.isArray(projects) || projects.length === 0) {
    console.log("seed-firestore: backup has 0 projects");
    process.exit(0);
  }

  for (const project of projects) {
    const slug = project.slug;
    if (!slug) continue;
    await db.collection("projects").doc(slug).set(
      {
        ...project,
        assets: [],
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }
  console.log(`seed-firestore: wrote ${projects.length} project doc(s) (images not uploaded — use CMS or Storage separately)`);
}

main().catch((err) => {
  console.error("seed-firestore failed:", err instanceof Error ? err.message : "error");
  process.exit(1);
});
