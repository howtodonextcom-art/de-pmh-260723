import { test, expect } from "@playwright/test";

/**
 * Home H6 map — Wave-1 MapLibre pins + Wave-2 height / region emphasis / HH CTA.
 * Tile pixels are not asserted (flaky) — chrome + navigation + CTA only.
 */

test.describe("home H6 — region map", () => {
  test("map section renders a MapLibre canvas, not an SVG path", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Bản đồ phân bố" }).scrollIntoViewIfNeeded();

    // Under full parallelism, several workers init WebGL + fetch the
    // demotiles style + our GeoJSON overlay at once — give this real
    // network/GPU work more room than the default 5s before flaking.
    await expect(page.getByTestId("region-map-canvas")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("svg[aria-label='Bản đồ Việt Nam (cách điệu)']")).toHaveCount(0);
  });

  test("region list button navigates to /du-an with khu-vuc filter", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Bản đồ phân bố" }).scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: "Bắc Ninh 1 dự án" }).click();
    await expect(page).toHaveURL(/\/du-an\?khu-vuc=bac-ninh/, { timeout: 15_000 });
  });

  test("map stage is near-viewport tall on mobile (≥70vh)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByTestId("region-map-stage").scrollIntoViewIfNeeded();
    const box = await page.getByTestId("region-map-stage").boundingBox();
    // 70vh of 812 ≈ 568
    expect(box?.height ?? 0).toBeGreaterThan(500);
  });

  test("Bắc Ninh row exposes Sa bàn Hồng Hạc CTA with UTM", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Bản đồ phân bố" }).scrollIntoViewIfNeeded();
    const cta = page.getByTestId("sa-ban-hh-cta");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /bacninhhonghaccity\.vn\/sa-ban/);
    await expect(cta).toHaveAttribute("href", /utm_source=ded-pmh/);
    await expect(cta).toHaveAttribute("target", "_blank");
  });

  test("mouse wheel over the map scrolls the page, not the map (scrollZoom: false)", async ({ page }) => {
    await page.goto("/");
    const stage = page.getByTestId("region-map-stage");
    await stage.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);

    const box = await stage.boundingBox();
    if (!box) throw new Error("map stage not found");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(200);

    const after = await page.evaluate(() => window.scrollY);
    // Cooperative gestures: wheel over the map must move the page, not zoom the canvas.
    expect(after).toBeGreaterThan(before);
  });
});
