import type { FlipbookAsset } from "@/lib/flipbook/types";

/** Width / height of one page. Landscape PMH gallery default (replaces portrait 923/1176). */
export const LANDSCAPE_PAGE_ASPECT = 3 / 2;

export const MOBILE_BREAKPOINT = 768;
export const TOOLBAR_RESERVE_PX = 64;
/** Total vertical inset around the book (split top/bottom). */
export const STAGE_PAD_PX = 8;
export const ASPECT_SAMPLE = 8;

export type PageSize = {
  width: number;
  height: number;
  spreadW: number;
  spreadH: number;
  columns: 1 | 2;
};

export function chevronWidth(isMobile: boolean): number {
  return isMobile ? 40 : 52;
}

export function pageAspectFromRatios(ratios: number[]): number {
  const valid = ratios.filter((ratio) => ratio > 0.2 && ratio < 8);
  if (valid.length === 0) return LANDSCAPE_PAGE_ASPECT;
  const sorted = [...valid].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid]!;
  return (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** Median intrinsic width/height of the first few pages; landscape fallback. */
export function pageAspectFromAssets(
  assets: ReadonlyArray<Pick<FlipbookAsset, "naturalWidth" | "naturalHeight">>,
  sample = ASPECT_SAMPLE,
): number {
  const ratios: number[] = [];
  for (const asset of assets.slice(0, sample)) {
    const w = asset.naturalWidth;
    const h = asset.naturalHeight;
    if (w && h && w > 0 && h > 0) ratios.push(w / h);
  }
  return pageAspectFromRatios(ratios);
}

/**
 * Fit a 1-page (mobile) or 2-page (desktop) spread into the stage.
 * Width-first, then clamp by height. Never exceeds stage.
 */
export function computePageSize(input: {
  stageW: number;
  stageH: number;
  isMobile: boolean;
  aspect: number;
}): PageSize {
  const aspect = input.aspect > 0.2 && input.aspect < 8 ? input.aspect : LANDSCAPE_PAGE_ASPECT;
  const columns: 1 | 2 = input.isMobile ? 1 : 2;
  const stageW = Math.max(input.stageW, 1);
  const stageH = Math.max(input.stageH, 1);

  let pageW = stageW / columns;
  let pageH = pageW / aspect;
  if (pageH > stageH) {
    pageH = stageH;
    pageW = pageH * aspect;
  }

  pageW = Math.max(1, Math.floor(pageW));
  pageH = Math.max(1, Math.floor(pageH));
  if (pageW * columns > stageW) pageW = Math.max(1, Math.floor(stageW / columns));
  if (pageH > stageH) pageH = Math.max(1, Math.floor(stageH));

  return {
    width: pageW,
    height: pageH,
    spreadW: pageW * columns,
    spreadH: pageH,
    columns,
  };
}

export function computeStageFromViewer(
  viewerW: number,
  viewerH: number,
  isMobile: boolean,
): { stageW: number; stageH: number } {
  const side = chevronWidth(isMobile);
  return {
    stageW: Math.max(viewerW - side * 2, 1),
    stageH: Math.max(viewerH - TOOLBAR_RESERVE_PX - STAGE_PAD_PX, 1),
  };
}

/** Prefer contain so maps/logos are not cropped; cover only when ratios nearly match would not help. */
export function resolveFitMode(input: {
  pageAspect: number;
  imageAspect?: number;
  category?: string;
}): "contain" | "cover" {
  if (input.category === "logos") return "contain";
  if (input.imageAspect == null || input.imageAspect <= 0) return "contain";
  const page = input.pageAspect;
  const image = input.imageAspect;
  const rel = Math.abs(page - image) / page;
  if (rel <= 0.12) return "contain";
  const bothLandscape = page >= 1.15 && image >= 1.15;
  const bothPortrait = page <= 0.9 && image <= 0.9;
  if ((bothLandscape || bothPortrait) && rel <= 0.22) return "contain";
  return "contain";
}
