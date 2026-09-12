import type { Locale } from "./locale";

export function asLocale(value: string | undefined | null): Locale {
  return value === "en" ? "en" : "vi";
}

export function localizedDisplayName(
  project: { displayNameVi: string; displayNameEn?: string | null },
  locale: string,
): string {
  const en = project.displayNameEn?.trim();
  if (locale === "en" && en) return en;
  return project.displayNameVi;
}

export function localizedShortDescription(
  project: { shortDescriptionVi?: string | null; shortDescriptionEn?: string | null },
  locale: string,
): string | null {
  const en = project.shortDescriptionEn?.trim();
  if (locale === "en" && en) return en;
  return project.shortDescriptionVi?.trim() ? project.shortDescriptionVi : null;
}

export function localizedLongDescription(
  project: { longDescriptionVi?: string | null; longDescriptionEn?: string | null },
  locale: string,
): string | null {
  const en = project.longDescriptionEn?.trim();
  if (locale === "en" && en) return en;
  return project.longDescriptionVi?.trim() ? project.longDescriptionVi : null;
}
