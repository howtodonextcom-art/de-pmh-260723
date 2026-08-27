export const CMS_IMAGE_CATEGORIES = [
  "hero",
  "masterplan",
  "overview",
  "location",
  "amenities",
  "architecture",
  "completed-project",
  "interior",
  "floorplans",
  "logos",
  "product",
] as const;

export type CmsImageCategory = (typeof CMS_IMAGE_CATEGORIES)[number];

export const CMS_SESSION_COOKIE = "cms_session";
export const CMS_SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;
