import { test, expect } from "@playwright/test";

/**
 * Locale switcher writes the NEXT_LOCALE cookie (see locale-switcher.tsx +
 * i18n/request.ts), then router.refresh() re-renders the Server Component tree.
 * Persistence is cookie-based, not localStorage.
 */

test.describe("home — locale switcher", () => {
  test("default locale is vi; switching to EN renders English chrome", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Xem danh mục dự án" })).toBeVisible();

    await page.getByTestId("locale-switch-en").click();

    await expect(page.getByRole("link", { name: "View project catalog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Compare" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Legal" })).toBeVisible();
  });

  test("locale choice persists across reload via cookie", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("locale-switch-en").click();
    await expect(page.getByRole("link", { name: "View project catalog" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("link", { name: "View project catalog" })).toBeVisible();
  });

  test("switching back to VI restores Vietnamese home copy", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("locale-switch-en").click();
    await expect(page.getByRole("link", { name: "View project catalog" })).toBeVisible();

    await page.getByTestId("locale-switch-vi").click();

    await expect(page.getByRole("link", { name: "Xem danh mục dự án" })).toBeVisible();
  });
});

test.describe("public chrome — EN labels", () => {
  test("project card status and fact-grid labels translate on detail", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("locale-switch-en").click();
    await expect(page.getByRole("link", { name: "View project catalog" })).toBeVisible();

    await page.goto("/du-an/hong-hac");
    await expect(page.getByText("In development").first()).toBeVisible();
    await expect(page.getByText("Location", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Site area", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Has data").first()).toBeVisible();
    await expect(page).toHaveTitle(/Hồng Hạc|Hong Hac|DED-PMH/);
  });

  test("passcode page exposes a locale switcher and English copy", async ({ page }) => {
    await page.goto("/passcode");
    await expect(page.getByTestId("locale-switch-en")).toBeVisible();
    await page.getByTestId("locale-switch-en").click();
    await expect(page.getByRole("heading", { name: /Enter access code|This browser is locked/ })).toBeVisible();
  });
});
