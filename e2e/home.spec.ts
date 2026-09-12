import { test, expect } from "@playwright/test";

test.describe("home H1 — hero", () => {
  test("CTA navigates to /du-an", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Xem danh mục dự án" }).click();
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

test.describe("home H10 — updates hidden on public Home", () => {
  test("does not render Tra cứu nhanh / empty-updates band", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Tra cứu nhanh" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Quick lookup" })).toHaveCount(0);
    await expect(page.getByText("Chưa có cập nhật gần đây")).toHaveCount(0);
    await expect(page.getByText("No recent updates yet.")).toHaveCount(0);
  });
});

test.describe("/lab — relocated DemoShell", () => {
  test("returns 200 and hosts the legal dossier + gallery demo", async ({ page }) => {
    const response = await page.goto("/lab");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Hồ sơ pháp lý" })).toBeVisible();
  });
});
