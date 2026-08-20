import "server-only";

import {
  loadLibraryCatalog,
  loadFullProjectsForV0,
  loadImagesForV0,
  ensureGalleryFloor,
  resolveRepoRoot,
  type V0HeaderProject,
  type V0ImageAsset,
  type V0Project,
} from "@library/library/seed-adapter";
import type { Project as FullProject } from "@library/types/project";

export type { V0HeaderProject, V0ImageAsset, V0Project, FullProject };

/**
 * Loads catalog from parent-repo library seeds (JSON + CSV).
 * Falls back to v0 mock-data if library files are missing.
 */
export async function getCatalogFromLibrary(): Promise<{
  source: "library" | "mock";
  headerProjects: V0HeaderProject[];
  projects: V0Project[];
  assets: V0ImageAsset[];
  thumbBySlug: Record<string, V0ImageAsset | null>;
}> {
  try {
    const { headerProjects, projects, assets } = loadLibraryCatalog();
    if (projects.length === 0) {
      throw new Error("library returned zero projects");
    }
    return { source: "library", headerProjects, projects, assets, thumbBySlug: buildThumbBySlug(headerProjects, assets) };
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Library catalog unavailable in production: " + (err instanceof Error ? err.message : String(err)),
      );
    }
    const mock = await import("@/lib/mock-data");
    return {
      source: "mock",
      headerProjects: mock.MOCK_HEADER_PROJECTS,
      projects: mock.MOCK_PROJECTS,
      assets: mock.MOCK_ASSETS,
      thumbBySlug: buildThumbBySlug(mock.MOCK_HEADER_PROJECTS, mock.MOCK_ASSETS),
    };
  }
}

/**
 * Maps each project's slug to its designated hero image asset — prefers the
 * project's `heroAssetId` when set, falling back to the first photo tagged
 * with that project's slug. Shared by `/`, `/du-an`, and `/du-an/[slug]` to
 * feed ProjectCard / DetailHero / DetailRelated.
 */
export function buildHeroAssetsBySlug(
  projects: Pick<FullProject, "slug" | "heroAssetId">[],
  assets: V0ImageAsset[],
): Record<string, V0ImageAsset | null> {
  return Object.fromEntries(
    projects.map((p) => [
      p.slug,
      p.heroAssetId
        ? (assets.find((a) => a.assetId === p.heroAssetId) ?? null)
        : (assets.find((a) => a.projectSlug === p.slug) ?? null),
    ]),
  );
}

/** Nav dropdown (R04) doesn't need the exact `heroAssetId` — any verified photo works for a 96×64 thumb. */
function buildThumbBySlug(
  headerProjects: { slug: string }[],
  assets: V0ImageAsset[],
): Record<string, V0ImageAsset | null> {
  return Object.fromEntries(
    headerProjects.map((p) => [
      p.slug,
      assets.find((a) => a.projectSlug === p.slug && a.verified) ?? assets.find((a) => a.projectSlug === p.slug) ?? null,
    ]),
  );
}

/**
 * Full canonical `Project[]` for /so-sanh — richer than `getCatalogFromLibrary`'s
 * `V0Project` (which the gallery/legal demo shell intentionally keeps slim).
 * Falls back to a compare-shaped mock (honest "chưa có dữ liệu" defaults, not
 * invented copy) if the parent repo's schema JSON isn't reachable.
 */
export async function getCompareProjects(): Promise<{
  source: "library" | "mock";
  projects: FullProject[];
}> {
  try {
    const projects = loadFullProjectsForV0();
    if (projects.length === 0) {
      throw new Error("library returned zero projects");
    }
    return { source: "library", projects };
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Library catalog unavailable in production: " + (err instanceof Error ? err.message : String(err)),
      );
    }
    const mock = await import("@/lib/mock-data");
    return { source: "mock", projects: mock.MOCK_COMPARE_PROJECTS };
  }
}

/**
 * Full canonical `Project[]` + gallery assets — for /du-an (list + detail),
 * which need both the compare-grade project fields and per-project photos.
 */
export async function getFullCatalog(): Promise<{
  source: "library" | "mock";
  projects: FullProject[];
  assets: V0ImageAsset[];
}> {
  try {
    const root = resolveRepoRoot();
    const projects = loadFullProjectsForV0(root);
    if (projects.length === 0) {
      throw new Error("library returned zero projects");
    }
    const assets = ensureGalleryFloor(loadImagesForV0(root), 4);
    return { source: "library", projects, assets };
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Library catalog unavailable in production: " + (err instanceof Error ? err.message : String(err)),
      );
    }
    const mock = await import("@/lib/mock-data");
    return { source: "mock", projects: mock.MOCK_COMPARE_PROJECTS, assets: mock.MOCK_ASSETS };
  }
}
