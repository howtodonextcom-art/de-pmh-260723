import "server-only";

import { DEFAULT_SITE_BRAND } from "@/lib/cms/empty-project";
import {
  deleteRuntimeProject,
  readRuntimeCatalog,
  upsertRuntimeProject,
  writeRuntimeSettings,
} from "@/lib/cms/runtime-store";
import type { CatalogPayload, CatalogSource, CmsProjectDoc, CmsSiteSettings } from "@/lib/cms/types";
import { getAdminDb } from "@/lib/firebase/admin";

const PROJECTS = "projects";
const SITE_SETTINGS = "site/settings";

function defaultSettings(): CmsSiteSettings {
  return { brandStatementVi: DEFAULT_SITE_BRAND, updates: [] };
}

function asProject(id: string, data: Record<string, unknown>): CmsProjectDoc {
  return {
    ...(data as unknown as CmsProjectDoc),
    slug: typeof data.slug === "string" ? data.slug : id,
    assets: Array.isArray(data.assets) ? (data.assets as CmsProjectDoc["assets"]) : [],
  };
}

async function loadFromFirestore(): Promise<{
  projects: CmsProjectDoc[];
  settings: CmsSiteSettings;
} | null> {
  const db = getAdminDb();
  if (!db) return null;
  const [projectSnap, settingsSnap] = await Promise.all([
    db.collection(PROJECTS).get(),
    db.doc(SITE_SETTINGS).get(),
  ]);
  const projects = projectSnap.docs.map((doc) => asProject(doc.id, doc.data() as Record<string, unknown>));
  const settings = settingsSnap.exists
    ? ({ ...(settingsSnap.data() as CmsSiteSettings) } satisfies CmsSiteSettings)
    : defaultSettings();
  if (!settings.brandStatementVi) settings.brandStatementVi = DEFAULT_SITE_BRAND;
  if (!Array.isArray(settings.updates)) settings.updates = [];
  return { projects, settings };
}

export async function loadCatalog(): Promise<CatalogPayload> {
  try {
    const remote = await loadFromFirestore();
    if (remote) {
      return { source: "firestore", ...remote };
    }
  } catch {
    // fall through to runtime
  }
  const runtime = readRuntimeCatalog();
  const source: CatalogSource = runtime.projects.length > 0 || runtime.settings.updates.length > 0
    ? "runtime"
    : "empty";
  return { source, projects: runtime.projects, settings: runtime.settings };
}

export async function getCmsProject(slug: string): Promise<CmsProjectDoc | null> {
  const catalog = await loadCatalog();
  return catalog.projects.find((p) => p.slug === slug) ?? null;
}

export async function saveCmsProject(doc: CmsProjectDoc, actor: string | null): Promise<CmsProjectDoc> {
  const next: CmsProjectDoc = {
    ...doc,
    lastVerifiedAt: doc.lastVerifiedAt || new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
  };
  const payload = JSON.parse(JSON.stringify(next)) as CmsProjectDoc;
  const db = getAdminDb();
  if (db) {
    await db.collection(PROJECTS).doc(next.slug).set(payload);
  }
  upsertRuntimeProject(payload);
  return payload;
}

export async function deleteCmsProject(slug: string): Promise<void> {
  const db = getAdminDb();
  if (db) {
    await db.collection(PROJECTS).doc(slug).delete();
  }
  deleteRuntimeProject(slug);
}

export async function saveCmsSettings(
  settings: CmsSiteSettings,
): Promise<CmsSiteSettings> {
  const next: CmsSiteSettings = { ...settings, updatedAt: new Date().toISOString() };
  const db = getAdminDb();
  if (db) {
    await db.doc(SITE_SETTINGS).set(next);
  }
  writeRuntimeSettings(next);
  return next;
}
