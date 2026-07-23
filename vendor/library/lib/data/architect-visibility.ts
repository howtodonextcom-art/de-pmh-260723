import type { Project } from "../../types/project";

/**
 * Acceptance checklist (SPEC): "Surbana Jurong chỉ hiển thị khi publicNameApproved
 * = true". Hồng Hạc City's conceptArchitect is the one entry in schema 13 whose
 * note explicitly says the name is pending PM sign-off before public display,
 * regardless of its `status` being `da-co-du-lieu`. Every other project's
 * architect entry comes from an official page with no such caveat.
 */
export function canShowConceptArchitect(project: Project): boolean {
  if (project.conceptArchitect?.status !== "da-co-du-lieu" || !project.conceptArchitect?.value) {
    return false;
  }
  if (project.slug === "hong-hac-city") {
    return project.conceptArchitect.publicNameApproved === true;
  }
  return true;
}
