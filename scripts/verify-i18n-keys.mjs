#!/usr/bin/env node
/**
 * F17 — static i18n key-usage verifier.
 *
 * Scans app/, components/, and lib/ for `t("some.key")` call patterns (both
 * the static server-side `t()` from `lib/i18n/t.ts` and the client-side
 * `useLocale().t()` from `lib/i18n/locale-context.tsx` — both share the same
 * `t("dot.path")` call shape, so one scan covers both), collects every
 * referenced key, then checks each one resolves against both
 * `lib/i18n/vi.json` and `lib/i18n/en.json`.
 *
 * Exit 0 — every referenced key resolves in both locale files.
 * Exit 1 — one or more referenced keys are missing from vi.json and/or
 *          en.json ("orphan" keys — referenced in code but undefined in
 *          messages).
 *
 * This does NOT flag keys that exist in the JSON files but are never
 * referenced in source (unused keys) — that is a different, noisier check
 * and out of scope for F17.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { globSync } from "node:fs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const SCAN_DIRS = ["app", "components", "lib"];
const SCAN_EXTENSIONS = [".ts", ".tsx"];

// Matches t("some.key"), t('some.key'), t(`some.key`) — including optional
// leading whitespace/newlines inside the parens, and ignores a second
// argument (interpolation vars) if present, since we only need the key.
const T_CALL_RE = /\bt\(\s*["'`]([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)["'`]/g;

/** Recursively collect files with the given extensions under a directory. */
function collectFiles(dir) {
  const pattern = path.join(dir, "**/*{" + SCAN_EXTENSIONS.join(",") + "}");
  return globSync(pattern, { cwd: ROOT, absolute: true, windowsPathsNoEscape: true }).filter(
    (f) => !f.includes(`${path.sep}node_modules${path.sep}`) && !f.includes(`${path.sep}.next${path.sep}`),
  );
}

/** Flatten a nested messages object into a Set of dot-path keys (leaf strings only). */
function flattenKeys(obj, prefix = "", out = new Set()) {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const nextPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenKeys(value, nextPath, out);
    } else {
      out.add(nextPath);
    }
  }
  return out;
}

function main() {
  const viPath = path.join(ROOT, "lib/i18n/vi.json");
  const enPath = path.join(ROOT, "lib/i18n/en.json");

  const vi = JSON.parse(readFileSync(viPath, "utf8"));
  const en = JSON.parse(readFileSync(enPath, "utf8"));

  const viKeys = flattenKeys(vi);
  const enKeys = flattenKeys(en);

  /** @type {Map<string, Set<string>>} key -> set of files referencing it */
  const usedKeys = new Map();

  for (const dir of SCAN_DIRS) {
    const files = collectFiles(path.join(ROOT, dir));
    for (const file of files) {
      const relFile = path.relative(ROOT, file);
      const content = readFileSync(file, "utf8");
      for (const match of content.matchAll(T_CALL_RE)) {
        const key = match[1];
        if (!usedKeys.has(key)) usedKeys.set(key, new Set());
        usedKeys.get(key).add(relFile);
      }
    }
  }

  const missingInVi = [];
  const missingInEn = [];

  for (const [key, files] of [...usedKeys.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!viKeys.has(key)) missingInVi.push({ key, files: [...files] });
    if (!enKeys.has(key)) missingInEn.push({ key, files: [...files] });
  }

  if (missingInVi.length === 0 && missingInEn.length === 0) {
    console.log(
      `verify:i18n — OK. ${usedKeys.size} distinct key(s) referenced across source, all resolve in both vi.json (${viKeys.size} keys) and en.json (${enKeys.size} keys).`,
    );
    process.exit(0);
  }

  console.error("verify:i18n — FAILED. Orphan key(s) referenced in source but missing from locale file(s):\n");

  const report = (label, list) => {
    if (list.length === 0) return;
    console.error(`Missing in ${label}:`);
    for (const { key, files } of list) {
      console.error(`  - "${key}"  (used in: ${files.join(", ")})`);
    }
    console.error("");
  };

  report("lib/i18n/vi.json", missingInVi);
  report("lib/i18n/en.json", missingInEn);

  process.exit(1);
}

main();
