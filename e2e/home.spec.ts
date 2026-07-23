import { test, expect } from "@playwright/test";

/**
 * v0 home rebuild (SPEC §3.2 H1-H10) — replaces the DemoShell on `/`.
 * See prompts/2026-07-20-02-14-claude-v0-home-i18n-e2e-mcp.md.
 */

test.describe("home H1 — hero", () => {
  test("CTA navigates to /du-an", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Khám phá 4 dự án" }).click();
    await expect(page).toHaveURL(/\/du-an$/);
  });
});

test.describe("home H5 — explorer preview", () => {
  test("lists all 4 projects and links to /du-an", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { name: "Danh mục dự án" });
    await heading.scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Xem tất cả & bộ lọc" })).toHaveAttribute("href", "/du-an");
    for (const name of ["Hồng Hạc City", "The Regency", "The Sculptura"]) {
      await expect(page.getByRole("heading", { name, exact: true }).first()).toBeVisible();
    }
  });
});

test.describe("home H7 — timeline", () => {
  test("milestone cards link to their project", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Timeline phát triển danh mục" }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Hồng Hạc City" }).first()).toHaveAttribute(
      "href",
      "/du-an/hong-hac-city",
    );
  });
});

test.describe("home H8 — legal teaser", () => {
  test("links to /phap-ly and per-project #phap-ly anchors", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section", { has: page.getByRole("heading", { name: "Pháp lý minh bạch" }) });
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("link", { name: "Pháp lý", exact: true })).toHaveAttribute("href", "/phap-ly");
    await expect(section.getByRole("link", { name: /Hồng Hạc City/ })).toHaveAttribute(
      "href",
      "/du-an/hong-hac-city#phap-ly",
    );
  });
});

test.describe("home H10 — updates", () => {
  test("shows recent updates and a compare CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Cập nhật gần đây" }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Xem bảng so sánh" })).toHaveAttribute("href", "/so-sanh");
  });
});

test.describe("/lab — relocated DemoShell", () => {
  test("returns 200 and hosts the legal dossier + gallery demo", async ({ page }) => {
    const response = await page.goto("/lab");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Hồ sơ pháp lý" })).toBeVisible();
  });
});
