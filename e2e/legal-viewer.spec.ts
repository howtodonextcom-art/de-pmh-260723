import { test, expect } from "@playwright/test";

/**
 * Legal document viewer — Variant A (large dialog) gate.
 * Desktop: width ≥ 720px, text pane scrollable region, Esc closes.
 */
test.describe("legal document viewer — large dialog", () => {
  test("opens a large readable viewer with scroll pane and Esc close", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/phap-ly?zone=nam&nhom=site-a");

    const line = page.getByTestId("legal-doc-line").first();
    await expect(line).toBeVisible({ timeout: 20_000 });
    await line.click();

    const viewer = page.getByTestId("legal-doc-viewer");
    await expect(viewer).toBeVisible();

    const box = await viewer.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThanOrEqual(720);
    // Viewport-height driven: ~92% of 900px ≈ 828; allow small chrome slack.
    expect(box!.height).toBeGreaterThanOrEqual(Math.round(900 * 0.7));

    const textScroll = page.getByTestId("legal-doc-text-scroll");
    await expect(textScroll).toBeVisible();
    const scrollBox = await textScroll.boundingBox();
    expect(scrollBox).toBeTruthy();
    expect(scrollBox!.height).toBeGreaterThanOrEqual(280);

    const scanPane = page.getByTestId("legal-doc-scan-pane");
    await expect(scanPane).toBeVisible();
    const scanBox = await scanPane.boundingBox();
    expect(scanBox).toBeTruthy();
    expect(scanBox!.height).toBeGreaterThanOrEqual(280);

    // Overflow capability: scroll container exists (long docs scroll inside, not tiny modal).
    const overflowY = await textScroll.evaluate((el) => getComputedStyle(el).overflowY);
    expect(["auto", "scroll", "overlay"]).toContain(overflowY);

    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden({ timeout: 5_000 });
  });
});
