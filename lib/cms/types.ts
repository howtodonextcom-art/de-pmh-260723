import type { Project } from "@library/types/project";
import type { ProjectNamGroupId, ProjectNavZoneId } from "@/lib/project-nav-taxonomy";
import type { SiteContent } from "@/lib/types";

export type CatalogSource = "firestore" | "runtime" | "empty";

export type CmsNavZone = ProjectNavZoneId;
export type CmsNamGroup = ProjectNamGroupId;

export type CmsAsset = {
  assetId: string;
  projectSlug: string;
  category: string;
  description: string;
  alt: string;
  sourcePageUrl: string;
  sourceFileUrl: string;
  isRender: boolean;
  verified?: boolean;
  resolvedUrl?: string;
};

/** Canonical project document stored in Firestore `projects/{slug}` (and runtime fallback). */
export type CmsProjectDoc = Project & {
  plotCode?: string | null;
  navZone?: CmsNavZone | null;
  namGroup?: CmsNamGroup | null;
  navLabel?: string | null;
  saBanUrl?: string | null;
  assets: CmsAsset[];
  updatedAt?: string;
  updatedBy?: string | null;
};

export type CmsSiteSettings = SiteContent & {
  updatedAt?: string;
};

export type CatalogPayload = {
  source: CatalogSource;
  projects: CmsProjectDoc[];
  settings: CmsSiteSettings;
};
