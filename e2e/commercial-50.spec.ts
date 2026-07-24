import { test, expect } from "@playwright/test";

/**
 * Commercial audit closure wave (2026-07-24) — W2 branded 404 + W3 nav EN
 * i18n. Source: reports/2026-07-24-v0-commercial-audit-50pct-smoke.md
 */

test.describe("W2 — branded 404", () => {
  test("unknown project slug shows branded not-found, not stock Next 404", async ({ page }) => {
    const res = await page.goto("/du-an/khong-ton-tai-123");
    expect(res?.status()).toBe(404);
    await expect(page).toHaveTitle("404 — DED-PMH");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("link", { name: "Về trang chủ" })).toBeVisible();
  });
});

test.describe("W3 — nav i18n follows EN switcher", () => {
  test("desktop 'Dự án' dropdown translates to 'Projects'", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => window.localStorage.setItem("ded-pmh-locale", "en"));
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Projects", exact: true })).toBeVisible();
  });

  test("mobile drawer translates to EN (Navigation / Projects / N projects)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addInitScript(() => window.localStorage.setItem("ded-pmh-locale", "en"));
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Navigation")).toBeVisible();
    await expect(dialog.getByText("4 projects")).toBeVisible();
  });
});
