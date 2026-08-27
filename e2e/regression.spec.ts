import { test, expect } from "@playwright/test";

test.describe("nav dropdown (desktop) — no regression from home rewrite", () => {
  test("Dự án dropdown opens zone shells", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Dự án", exact: true }).hover();
    const menu = page.getByRole("menu", { name: "Dự án" });
    await expect(menu).toBeVisible();
    await expect(menu.getByText("Phía Bắc")).toBeVisible();
  });
});

test.describe("mobile nav @375 — no regression from home rewrite", () => {
  test("hamburger opens a panel listing nav links", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu điều hướng" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("So sánh")).toBeVisible();
  });
});

test.describe("detail → gallery lightbox — no regression", () => {
  test("thumbnail click opens dialog when a project exists", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/du-an");
    const card = page.locator('a[href^="/du-an/"]').first();
    if ((await card.count()) === 0) test.skip(true, "empty catalog");
    await card.click();
    const firstThumb = page.getByRole("button", { name: /^Mở ảnh:/ }).first();
    if ((await firstThumb.count()) === 0) test.skip(true, "no gallery");
    await firstThumb.scrollIntoViewIfNeeded();
    await firstThumb.click();
    const dialog = page.getByRole("dialog", { name: "Xem ảnh lớn" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("Compare @375 — no regression", () => {
  test("renders compare heading without crashing", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/so-sanh");
    await expect(page.getByRole("heading", { name: "So sánh dự án" })).toBeVisible();
  });
});

test.describe("IA — /so-sanh is sole compare surface", () => {
  test("/du-an links to /so-sanh; ?xem=bang redirects", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/du-an");
    await expect(page.getByRole("link", { name: "So sánh dự án" })).toHaveAttribute("href", "/so-sanh");
    await expect(page.getByRole("button", { name: "Ẩn hàng giống nhau" })).toHaveCount(0);

    await page.goto("/du-an?xem=bang");
    await expect(page).toHaveURL(/\/so-sanh$/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "So sánh dự án" })).toBeVisible();
  });
});

test.describe("Pháp lý — single project panel", () => {
  test("legal page renders with empty or populated catalog", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/phap-ly");
    await expect(page.getByRole("heading", { name: "Hồ sơ pháp lý" })).toBeVisible();
  });
});
