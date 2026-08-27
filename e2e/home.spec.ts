import { test, expect } from "@playwright/test";

test.describe("home H1 — hero", () => {
  test("CTA navigates to /du-an", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Khám phá dự án" }).click();
    await expect(page).toHaveURL(/\/du-an$/);
  });
});

test.describe("home H5 — explorer preview", () => {
  test("lists catalog heading and links to /du-an", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { name: "Danh mục dự án" });
    await heading.scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Xem tất cả & bộ lọc" })).toHaveAttribute("href", "/du-an");
  });
});

test.describe("home H10 — updates", () => {
  test("shows a compare CTA", async ({ page }) => {
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
