import { test, expect } from "@playwright/test";

/**
 * Regression pass over surfaces the home rebuild (Package A) could have
 * disturbed: nav dropdown/mobile nav, gallery lightbox, Compare @375,
 * Pháp lý anchors. These were already 100% MCP-verified in
 * prompts/2026-07-20-01-52-claude-v0-lightbox-dropdown-100-mcp.md — this
 * suite guards against a future regression, it does not re-litigate them.
 */

test.describe("nav dropdown (desktop) — no regression from home rewrite", () => {
  test("Dự án dropdown shows 4 projects", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Dự án", exact: true }).hover();
    const menu = page.getByRole("menu", { name: "Dự án" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem")).toHaveCount(5);
  });
});

test.describe("mobile nav @375 — no regression from home rewrite", () => {
  test("hamburger opens a panel listing nav links + 4 projects", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu điều hướng" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("So sánh")).toBeVisible();
    await expect(dialog.getByText("Hồng Hạc City")).toBeVisible();
  });
});

test.describe("detail → gallery lightbox — no regression", () => {
  test("thumbnail click opens dialog; Escape closes it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/du-an/hong-hac-city");
    const firstThumb = page.getByRole("button", { name: /^Mở ảnh:/ }).first();
    await firstThumb.scrollIntoViewIfNeeded();
    await firstThumb.click();
    const dialog = page.getByRole("dialog", { name: "Xem ảnh lớn" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("Compare @375 — no regression", () => {
  test("renders Accordion triggers, not a crushed table", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/so-sanh");
    for (const name of ["Hồng Hạc City", "The Regency", "The Sculptura"]) {
      await expect(page.getByRole("button", { name })).toBeVisible();
    }
    await expect(page.locator("table")).toBeHidden();
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
    await expect(page.getByRole("button", { name: "Ẩn hàng giống nhau" })).toBeVisible();
  });
});

test.describe("Pháp lý — single project panel", () => {
  test("shows one dossier at a time and switches via slug tabs", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/phap-ly?zone=nam&nhom=site-a");

    const active = page.getByTestId("legal-active-project");
    await expect(active).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId("legal-active-project")).toHaveCount(1);

    await page.getByTestId("legal-project-tab-the-sculptura").click();
    await expect(page).toHaveURL(/slug=the-sculptura/);
    await expect(active).toHaveAttribute("data-slug", "the-sculptura");
    await expect(page.getByRole("heading", { name: "The Sculptura", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Regency", exact: true })).toHaveCount(0);

    await page.getByTestId("legal-project-tab-the-regency").click();
    await expect(page).toHaveURL(/slug=the-regency/);
    await expect(active).toHaveAttribute("data-slug", "the-regency");
    await expect(page.getByRole("heading", { name: "The Regency", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Sculptura", exact: true })).toHaveCount(0);
  });
});
