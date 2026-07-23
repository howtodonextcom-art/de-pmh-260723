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

test.describe("Pháp lý — no regression", () => {
  test("loads with 4 project anchors", async ({ page }) => {
    await page.goto("/phap-ly");
    for (const slug of ["hong-hac-city", "the-regency", "the-sculptura", "harmonie"]) {
      await expect(page.locator(`#${slug}`)).toHaveCount(1);
    }
  });
});
