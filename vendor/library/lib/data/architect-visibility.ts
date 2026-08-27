import type { Project } from "../../types/project";

/**
 * Show concept architect when data exists, unless publicNameApproved is explicitly false.
 */
export function canShowConceptArchitect(project: Project): boolean {
  if (project.conceptArchitect?.status !== "da-co-du-lieu" || !project.conceptArchitect?.value) {
    return false;
  }
  if (project.conceptArchitect.publicNameApproved === false) {
    return false;
  }
  return true;
}
