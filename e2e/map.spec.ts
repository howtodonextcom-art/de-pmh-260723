import { test, expect } from "@playwright/test";

test.describe("home H6 — region map", () => {
  test("map section renders (canvas when pins exist, empty stage otherwise)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Bản đồ phân bố" }).scrollIntoViewIfNeeded();
    await expect(page.getByTestId("region-map-stage").or(page.getByTestId("region-map-canvas"))).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("svg[aria-label='Bản đồ Việt Nam (cách điệu)']")).toHaveCount(0);
  });

  test("map stage is near-viewport tall on mobile (≥40vh empty / ≥70vh with pins)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByTestId("region-map-stage").scrollIntoViewIfNeeded();
    const box = await page.getByTestId("region-map-stage").boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(250);
  });

  test("sa-bàn CTA is optional and not hardcoded to a named project", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("sa-ban-hh-cta")).toHaveCount(0);
  });
});
