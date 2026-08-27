import type { HeaderProject, ImageAsset, Project } from "@/lib/types";
import type { Project as FullProject } from "@library/types/project";

import { createEmptyProject } from "@/lib/cms/empty-project";

/** Empty catalog factory — named projects live in Firebase/CMS, not git. */
export function emptyCatalogProject(slug = "new-project", name = "Dự án mới"): FullProject {
  return createEmptyProject(slug, name);
}

export const MOCK_PROJECTS: Project[] = [];
export const MOCK_HEADER_PROJECTS: HeaderProject[] = [];
export const MOCK_ASSETS: ImageAsset[] = [];
export const MOCK_COMPARE_PROJECTS: FullProject[] = [];
