import "server-only";

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

import { DEFAULT_SITE_BRAND } from "@/lib/cms/empty-project";
import type { CmsProjectDoc, CmsSiteSettings } from "@/lib/cms/types";

const RUNTIME_DIR = path.join(process.cwd(), "data", "runtime");
const CATALOG_FILE = path.join(RUNTIME_DIR, "catalog.json");

type RuntimeFile = {
  projects: CmsProjectDoc[];
  settings: CmsSiteSettings;
};

function defaultSettings(): CmsSiteSettings {
  return { brandStatementVi: DEFAULT_SITE_BRAND, updates: [] };
}

export function readRuntimeCatalog(): RuntimeFile {
  if (!existsSync(CATALOG_FILE)) {
    return { projects: [], settings: defaultSettings() };
  }
  try {
    const raw = JSON.parse(readFileSync(CATALOG_FILE, "utf8")) as Partial<RuntimeFile>;
    return {
      projects: Array.isArray(raw.projects) ? raw.projects : [],
      settings: {
        brandStatementVi: raw.settings?.brandStatementVi || DEFAULT_SITE_BRAND,
        updates: Array.isArray(raw.settings?.updates) ? raw.settings.updates : [],
        updatedAt: raw.settings?.updatedAt,
      },
    };
  } catch {
    return { projects: [], settings: defaultSettings() };
  }
}

export function writeRuntimeCatalog(next: RuntimeFile): void {
  try {
    mkdirSync(RUNTIME_DIR, { recursive: true });
    writeFileSync(CATALOG_FILE, JSON.stringify(next, null, 2) + "\n", "utf8");
  } catch (err) {
    if (process.env.VERCEL) return;
    throw err;
  }
}

export function upsertRuntimeProject(doc: CmsProjectDoc): void {
  const current = readRuntimeCatalog();
  const index = current.projects.findIndex((p) => p.slug === doc.slug);
  if (index >= 0) current.projects[index] = doc;
  else current.projects.push(doc);
  writeRuntimeCatalog(current);
}

export function deleteRuntimeProject(slug: string): void {
  const current = readRuntimeCatalog();
  writeRuntimeCatalog({
    ...current,
    projects: current.projects.filter((p) => p.slug !== slug),
  });
}

export function writeRuntimeSettings(settings: CmsSiteSettings): void {
  const current = readRuntimeCatalog();
  writeRuntimeCatalog({ ...current, settings });
}
