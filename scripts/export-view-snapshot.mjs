#!/usr/bin/env node
/**
 * Export /phap-ly + /so-sanh view-models (runs via vitest so TS path aliases work).
 * Usage: npm run backup:views
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vitest = path.join(root, "node_modules", "vitest", "vitest.mjs");

const result = spawnSync(
  process.execPath,
  [vitest, "run", "lib/view-snapshot.test.ts"],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, BACKUP_VIEWS: "1" },
  },
);

process.exit(result.status ?? 1);
