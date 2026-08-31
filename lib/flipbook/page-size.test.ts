import { describe, expect, it } from "vitest";

import {
  LANDSCAPE_PAGE_ASPECT,
  chevronWidth,
  computePageSize,
  computeStageFromViewer,
  pageAspectFromAssets,
  pageAspectFromRatios,
  resolveFitMode,
} from "@/lib/flipbook/page-size";

describe("pageAspectFromRatios", () => {
  it("falls back to landscape when empty or invalid", () => {
    expect(pageAspectFromRatios([])).toBe(LANDSCAPE_PAGE_ASPECT);
    expect(pageAspectFromRatios([0, 99])).toBe(LANDSCAPE_PAGE_ASPECT);
  });

  it("returns the median of valid ratios", () => {
    expect(pageAspectFromRatios([1.6, 1.4, 1.5])).toBe(1.5);
    expect(pageAspectFromRatios([1, 2])).toBe(1.5);
  });
});

describe("pageAspectFromAssets", () => {
  it("falls back to landscape when assets have no intrinsic size", () => {
    expect(pageAspectFromAssets([])).toBe(LANDSCAPE_PAGE_ASPECT);
    expect(pageAspectFromAssets([{}])).toBe(LANDSCAPE_PAGE_ASPECT);
  });

  it("uses the median of sampled intrinsic ratios", () => {
    expect(
      pageAspectFromAssets([
        { naturalWidth: 1500, naturalHeight: 1000 },
        { naturalWidth: 1600, naturalHeight: 900 },
        { naturalWidth: 1200, naturalHeight: 800 },
      ]),
    ).toBe(1.5);
  });
});

describe("computePageSize", () => {
  it("desktop: two pages fit inside the stage (width-limited)", () => {
    const page = computePageSize({
      stageW: 1200,
      stageH: 800,
      isMobile: false,
      aspect: 1.5,
    });
    expect(page.columns).toBe(2);
    expect(page.spreadW).toBe(page.width * 2);
    expect(page.spreadW).toBeLessThanOrEqual(1200);
    expect(page.spreadH).toBeLessThanOrEqual(800);
    expect(page.width).toBe(600);
    expect(page.height).toBe(400);
    expect(page.width / page.height).toBeCloseTo(1.5, 1);
  });

  it("desktop: height-limited stage still stays inside", () => {
    const page = computePageSize({
      stageW: 1600,
      stageH: 400,
      isMobile: false,
      aspect: 1.5,
    });
    expect(page.spreadW).toBeLessThanOrEqual(1600);
    expect(page.spreadH).toBeLessThanOrEqual(400);
    expect(page.height).toBe(400);
    expect(page.width).toBe(600);
  });

  it("mobile: one page uses the full stage width when possible", () => {
    const page = computePageSize({
      stageW: 360,
      stageH: 640,
      isMobile: true,
      aspect: 1.5,
    });
    expect(page.columns).toBe(1);
    expect(page.spreadW).toBe(page.width);
    expect(page.width).toBeLessThanOrEqual(360);
    expect(page.height).toBeLessThanOrEqual(640);
    expect(page.width).toBe(360);
    expect(page.height).toBe(240);
  });

  it("fills most of a 1440-class stage on one axis", () => {
    const stage = computeStageFromViewer(1440, 900, false);
    const page = computePageSize({
      ...stage,
      isMobile: false,
      aspect: LANDSCAPE_PAGE_ASPECT,
    });
    const fillW = page.spreadW / stage.stageW;
    const fillH = page.spreadH / stage.stageH;
    expect(Math.max(fillW, fillH)).toBeGreaterThan(0.92);
    expect(page.spreadW).toBeLessThanOrEqual(stage.stageW);
    expect(page.spreadH).toBeLessThanOrEqual(stage.stageH);
  });

  it("is not clamped to the old 800px page cap on a wide stage", () => {
    const page = computePageSize({
      stageW: 1896,
      stageH: 828,
      isMobile: false,
      aspect: LANDSCAPE_PAGE_ASPECT,
    });
    expect(page.width).toBeGreaterThan(800);
    expect(page.spreadW).toBeLessThanOrEqual(1896);
  });

  it("never overflows a tiny stage (no min-size bump)", () => {
    const page = computePageSize({
      stageW: 100,
      stageH: 80,
      isMobile: true,
      aspect: 1.5,
    });
    expect(page.spreadW).toBeLessThanOrEqual(100);
    expect(page.spreadH).toBeLessThanOrEqual(80);
  });
});

describe("chevronWidth", () => {
  it("uses a tighter desktop rail than 72px", () => {
    expect(chevronWidth(true)).toBe(40);
    expect(chevronWidth(false)).toBe(52);
  });
});

describe("computeStageFromViewer", () => {
  it("subtracts chevrons and toolbar, not the old 72px rails", () => {
    const desktop = computeStageFromViewer(1440, 900, false);
    expect(desktop.stageW).toBe(1440 - 52 * 2);
    expect(desktop.stageH).toBe(900 - 64 - 8);
    const mobile = computeStageFromViewer(375, 812, true);
    expect(mobile.stageW).toBe(375 - 40 * 2);
    expect(mobile.stageH).toBe(812 - 64 - 8);
  });
});

describe("resolveFitMode", () => {
  it("keeps contain for logos and unmatched ratios", () => {
    expect(resolveFitMode({ pageAspect: 1.5, imageAspect: 1.5, category: "logos" })).toBe("contain");
    expect(resolveFitMode({ pageAspect: 1.5, imageAspect: 1.48 })).toBe("contain");
    expect(resolveFitMode({ pageAspect: 1.5 })).toBe("contain");
  });
});
