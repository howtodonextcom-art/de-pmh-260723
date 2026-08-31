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
import {
  isFirestoreRestConfigured,
  restDeleteDocument,
  restGetDocument,
  restListDocuments,
  restSetDocument,
} from "@/lib/firebase/firestore-rest";

const PROJECTS = "projects";
const SITE_SETTINGS = "site/settings";

export class CatalogPersistError extends Error {
  code: string;
  constructor(code: string, message = code) {
    super(message);
    this.code = code;
    this.name = "CatalogPersistError";
  }
}

export type CatalogWriteOptions = {
  idToken?: string | null;
};

async function loadFromFirestoreRest(): Promise<{
  projects: CmsProjectDoc[];
  settings: CmsSiteSettings;
} | null> {
  if (!isFirestoreRestConfigured()) return null;
  try {
    const [projectDocs, settingsData] = await Promise.all([
      restListDocuments(PROJECTS),
      restGetDocument(SITE_SETTINGS),
    ]);
    const projects = projectDocs.map((doc) => asProject(doc.id, doc.data));
    const settings = settingsData
      ? ({ ...(settingsData as unknown as CmsSiteSettings) } satisfies CmsSiteSettings)
      : defaultSettings();
    if (!settings.brandStatementVi) settings.brandStatementVi = DEFAULT_SITE_BRAND;
    if (!Array.isArray(settings.updates)) settings.updates = [];
    return { projects, settings };
  } catch {
    return null;
  }
}

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
    // fall through
  }
  try {
    const rest = await loadFromFirestoreRest();
    if (rest) {
      return { source: "firestore", ...rest };
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

export async function saveCmsProject(
  doc: CmsProjectDoc,
  actor: string | null,
  options: CatalogWriteOptions = {},
): Promise<CmsProjectDoc> {
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
  } else {
    const token = options.idToken?.trim() || "";
    if (!token) throw new CatalogPersistError("firestore-unconfigured");
    const written = await restSetDocument(`${PROJECTS}/${next.slug}`, payload as unknown as Record<string, unknown>, token);
    if (!written.ok) throw new CatalogPersistError("persist-failed", `status-${written.status}`);
  }
  upsertRuntimeProject(payload);
  return payload;
}

export async function deleteCmsProject(slug: string, options: CatalogWriteOptions = {}): Promise<void> {
  const db = getAdminDb();
  if (db) {
    await db.collection(PROJECTS).doc(slug).delete();
  } else if (options.idToken?.trim()) {
    const deleted = await restDeleteDocument(`${PROJECTS}/${slug}`, options.idToken);
    if (!deleted.ok) throw new CatalogPersistError("persist-failed", `status-${deleted.status}`);
  }
  deleteRuntimeProject(slug);
}

export async function saveCmsSettings(
  settings: CmsSiteSettings,
  options: CatalogWriteOptions = {},
): Promise<CmsSiteSettings> {
  const next: CmsSiteSettings = { ...settings, updatedAt: new Date().toISOString() };
  const db = getAdminDb();
  if (db) {
    await db.doc(SITE_SETTINGS).set(next);
  } else {
    const token = options.idToken?.trim() || "";
    if (!token) throw new CatalogPersistError("firestore-unconfigured");
    const written = await restSetDocument(SITE_SETTINGS, next as unknown as Record<string, unknown>, token);
    if (!written.ok) throw new CatalogPersistError("persist-failed", `status-${written.status}`);
  }
  writeRuntimeSettings(next);
  return next;
}
