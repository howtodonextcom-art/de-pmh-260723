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

  test("a region card resolving to exactly one project (Bắc Ninh → Hồng Hạc) links straight to that project", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.getByTestId("region-card-bac-ninh");
    await card.scrollIntoViewIfNeeded();
    await card.getByRole("button").click();
    await page.waitForURL("**/du-an/hong-hac");
    await expect(page).toHaveURL(/\/du-an\/hong-hac$/);
  });

  test("a region card resolving to multiple projects (Tp. HCM) links to a non-empty catalog filter, never an empty result", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.getByTestId("region-card-tp-hcm");
    await card.scrollIntoViewIfNeeded();
    await card.getByRole("button").click();
    await page.waitForURL("**/du-an?khu-vuc=tp-hcm");
    await expect(page).toHaveURL(/khu-vuc=tp-hcm/);
    // Regression guard for the bug this fix closes: the Home slug and the
    // Explorer filter's slug used to diverge for every city except "Bắc
    // Ninh", so this exact click used to land on a 0-result catalog page.
    await expect(page.getByText("Không dự án nào khớp bộ lọc.")).toHaveCount(0);
  });
});
