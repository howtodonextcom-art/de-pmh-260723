import { test, expect } from "@playwright/test";

/**
 * R07 — /en locale switcher. Client-side dual-dictionary strategy (see
 * v0/docs/I18N_EN.md), NOT a route-segment `/en` — the switcher flips a
 * client Context, default locale stays `vi` on fresh load.
 */

test.describe("home — locale switcher", () => {
  test("default locale is vi; switching to EN renders English strings on home", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Khám phá 4 dự án" })).toBeVisible();

    await page.getByTestId("locale-switch-en").click();

    await expect(page.getByRole("link", { name: "Explore 4 projects" })).toBeVisible();
    await expect(page.getByText("Projects", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Regions", { exact: true }).first()).toBeVisible();
  });

  test("locale choice persists across reload via localStorage", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("locale-switch-en").click();
    await expect(page.getByRole("link", { name: "Explore 4 projects" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("link", { name: "Explore 4 projects" })).toBeVisible();
  });

  test("switching back to VI restores Vietnamese home copy", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("locale-switch-en").click();
    await expect(page.getByRole("link", { name: "Explore 4 projects" })).toBeVisible();

    await page.getByTestId("locale-switch-vi").click();

    await expect(page.getByRole("link", { name: "Khám phá 4 dự án" })).toBeVisible();
  });
});
