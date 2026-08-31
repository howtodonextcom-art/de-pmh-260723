import "server-only";

import {
  type V0HeaderProject,
  type V0ImageAsset,
  type V0Project,
} from "@library/library/seed-adapter";
import type { Project as FullProject } from "@library/types/project";

import { loadCatalog } from "@/lib/catalog";
import type { CatalogSource, CmsAsset, CmsProjectDoc } from "@/lib/cms/types";

export type { V0HeaderProject, V0ImageAsset, V0Project, FullProject };
export type PublicCatalogSource = CatalogSource;

const STATUS_LABEL: Record<string, string> = {
  "dang-trien-khai": "Đang triển khai",
  "dang-ban": "Đang mở bán",
  "da-ban-giao": "Đã bàn giao",
  "sap-mo-ban": "Sắp mở bán",
};

function statusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}

function toAsset(asset: CmsAsset): V0ImageAsset {
  return {
    assetId: asset.assetId,
    projectSlug: asset.projectSlug,
    category: asset.category,
    description: asset.description,
    alt: asset.alt,
    sourcePageUrl: asset.sourcePageUrl,
    sourceFileUrl: asset.sourceFileUrl,
    isRender: asset.isRender,
    verified: asset.verified,
    resolvedUrl: asset.resolvedUrl ?? asset.sourceFileUrl,
  };
}

function toHeader(project: CmsProjectDoc): V0HeaderProject {
  return {
    slug: project.slug,
    displayNameVi: project.displayNameVi,
    region: project.region,
    status: statusLabel(project.status),
    alternateNames: project.alternateNames?.length ? project.alternateNames : undefined,
    navZone: project.navZone ?? null,
    namGroup: project.namGroup ?? null,
    navLabel: project.navLabel ?? null,
  };
}

function toSlimProject(project: CmsProjectDoc): V0Project {
  return {
    id: project.id || project.slug,
    slug: project.slug,
    displayNameVi: project.displayNameVi,
    region: project.region,
    status: statusLabel(project.status),
    alternateNames: project.alternateNames?.length ? project.alternateNames : undefined,
    legalDossier: project.legalDossier ?? null,
  };
}

function collectAssets(projects: CmsProjectDoc[]): V0ImageAsset[] {
  return projects.flatMap((project) => (project.assets ?? []).map(toAsset));
}

/**
 * Public catalog: Firestore first, then local runtime JSON.
 * Empty catalog is valid — never throw, never fall back to named mock projects.
 */
export async function getCatalogFromLibrary(): Promise<{
  source: PublicCatalogSource;
  headerProjects: V0HeaderProject[];
  projects: V0Project[];
  assets: V0ImageAsset[];
  thumbBySlug: Record<string, V0ImageAsset | null>;
}> {
  const catalog = await loadCatalog();
  const headerProjects = catalog.projects.map(toHeader);
  const projects = catalog.projects.map(toSlimProject);
  const assets = collectAssets(catalog.projects);
  return {
    source: catalog.source,
    headerProjects,
    projects,
    assets,
    thumbBySlug: buildThumbBySlug(headerProjects, assets),
  };
}

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

function buildThumbBySlug(
  headerProjects: { slug: string }[],
  assets: V0ImageAsset[],
): Record<string, V0ImageAsset | null> {
  return Object.fromEntries(
    headerProjects.map((p) => [
      p.slug,
      assets.find((a) => a.projectSlug === p.slug && a.verified) ??
        assets.find((a) => a.projectSlug === p.slug) ??
        null,
    ]),
  );
}

export async function getCompareProjects(): Promise<{
  source: PublicCatalogSource;
  projects: FullProject[];
}> {
  const catalog = await loadCatalog();
  return { source: catalog.source, projects: catalog.projects };
}

export async function getFullCatalog(): Promise<{
  source: PublicCatalogSource;
  projects: FullProject[];
  assets: V0ImageAsset[];
}> {
  const catalog = await loadCatalog();
  return {
    source: catalog.source,
    projects: catalog.projects,
    assets: collectAssets(catalog.projects),
  };
}

export async function getSiteCatalogSettings() {
  const catalog = await loadCatalog();
  return catalog.settings;
}
