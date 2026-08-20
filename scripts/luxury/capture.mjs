/**
 * Luxury baseline capture for UI/UX roadmap (vault-pattern inspired).
 * Usage: node scripts/luxury/capture.mjs
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const PROD = process.env.PROD_BASE_URL || "https://de-division-pmh.vercel.app";
const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });

const findings = { base: BASE, capturedAt: new Date().toISOString(), routes: {}, prod: null };

// F26 — CI-robustness: Playwright's default headless-shell download has been
// observed to reliably fail on this machine's network (see
// reports/2026-08-19-luxury-full-audit.md, "Tooling note"), requiring
// PW_CHANNEL=chrome as a manual workaround. A fresh CI runner can hit the
// same failure mode. Explicit env vars (PW_CHANNEL /
// PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) are always honored first; if neither
// is set and the default launch throws, fall back to the system Chrome
// channel once before giving up, so the gate doesn't hard-fail just because
// the headless shell wasn't downloadable.
async function launchBrowser() {
  const launchOpts = {
    headless: true,
    ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {}),
  };
  try {
    return await chromium.launch(launchOpts);
  } catch (err) {
    if (process.env.PW_CHANNEL || process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) throw err;
    console.warn(
      `[luxury:capture] default Chromium launch failed (${err.message}); retrying with channel: "chrome". ` +
        "Set PW_CHANNEL or PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH to control this explicitly.",
    );
    return chromium.launch({ headless: true, channel: "chrome" });
  }
}

const browser = await launchBrowser();

async function shot(page, name, fullPage = false) {
  const file = path.join(outDir, `luxury-baseline-${name}.png`);
  await page.screenshot({ path: file, fullPage });
  return path.basename(file);
}

async function visit(route, viewport, name, opts = {}) {
  const context = await browser.newContext({
    viewport,
    colorScheme: opts.dark ? "dark" : "light",
  });
  const page = await context.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));

  if (opts.throttleMapStyle) {
    // Delay the MapLibre style fetch so the shimmer/skeleton loading state
    // stays on screen long enough to screenshot (F7 evidence).
    await page.route("**/demotiles.maplibre.org/**", async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });
  }

  const res = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(opts.waitMs ?? 1400);
  if (opts.scrollMap) {
    const h = page.getByRole("heading", { name: /Bản đồ phân bố/i });
    if (await h.count()) {
      await h.scrollIntoViewIfNeeded();
      await page.waitForTimeout(opts.throttleMapStyle ? 400 : 2200);
    }
  }
  const file = await shot(page, name, !!opts.fullPage);
  const h1 = page.locator("h1").first();
  findings.routes[name] = {
    route,
    viewport,
    dark: !!opts.dark,
    status: res?.status() ?? null,
    screenshot: file,
    h1Font: await h1.evaluate((el) => getComputedStyle(el).fontFamily).catch(() => null),
    hasFooter: (await page.locator("footer").count()) > 0,
    radius: await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--radius").trim()),
    mapMarkers: opts.scrollMap ? await page.locator(".maplibregl-marker").count() : null,
    mapShimmerVisible: opts.throttleMapStyle
      ? await page.locator(".animate-shimmer-sweep").first().isVisible().catch(() => false)
      : null,
    noHorizontalBleed:
      viewport.width <= 480
        ? await page
            .evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)
            .catch(() => null)
        : null,
    consoleErrors: errs.filter((t) => !t.includes("Invalid or unexpected token")),
  };
  await context.close();
}

// F27 — bespoke capture for the flipbook gallery viewer. Unlike visit(),
// this needs an interaction step (click a gallery tile to open the
// fullscreen ProjectFlipbookViewer — see components/project/detail/gallery.tsx
// GalleryTile) before the screenshot, so it can't reuse the generic
// load-then-shoot flow.
async function visitFlipbookOpen(route, viewport, name, opts = {}) {
  const context = await browser.newContext({
    viewport,
    colorScheme: opts.dark ? "dark" : "light",
  });
  const page = await context.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));

  const res = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(opts.waitMs ?? 1800);

  const tile = page.locator('#gallery button[aria-label^="Mở ảnh"]').first();
  let dialogOpened = false;
  if (await tile.count()) {
    await tile.scrollIntoViewIfNeeded().catch(() => {});
    await tile.click();
    dialogOpened = await page
      .getByRole("dialog")
      .waitFor({ state: "visible", timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    // Let the flipbook engine finish its open animation / page render.
    await page.waitForTimeout(opts.flipbookSettleMs ?? 1200);
  }

  const file = await shot(page, name, !!opts.fullPage);
  findings.routes[name] = {
    route,
    viewport,
    dark: !!opts.dark,
    status: res?.status() ?? null,
    screenshot: file,
    dialogOpened,
    consoleErrors: errs.filter((t) => !t.includes("Invalid or unexpected token")),
  };
  await context.close();
}

await visit("/", { width: 1440, height: 900 }, "home-1440", { waitMs: 1600, scrollMap: true });
await visit("/", { width: 1440, height: 900 }, "home-dark-1440", { dark: true, waitMs: 1500 });
await visit("/", { width: 375, height: 812 }, "home-375", { waitMs: 1500 });
await visit("/", { width: 1440, height: 900 }, "map-loading-1440", { waitMs: 100, scrollMap: true, throttleMapStyle: true });
await visit("/du-an", { width: 1440, height: 900 }, "du-an-1440");
await visit("/du-an/hong-hac-city", { width: 1440, height: 900 }, "detail-hh-1440", { waitMs: 1800 });
await visit("/du-an/hong-hac-city", { width: 375, height: 812 }, "detail-hh-375", { waitMs: 1800 });
await visitFlipbookOpen("/du-an/hong-hac-city", { width: 1440, height: 900 }, "flipbook-open-1440", { waitMs: 1800 });
await visit("/so-sanh", { width: 1440, height: 900 }, "so-sanh-1440");
await visit("/so-sanh", { width: 375, height: 812 }, "so-sanh-375");
await visit("/phap-ly", { width: 1440, height: 900 }, "phap-ly-1440");
await visit("/phap-ly", { width: 1440, height: 900 }, "phap-ly-dark-1440", { dark: true });
await visit("/phap-ly", { width: 375, height: 812 }, "phap-ly-375");
await visit("/lab", { width: 1440, height: 900 }, "lab-1440", { waitMs: 1600 });

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    const res = await page.goto(PROD, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    const file = await shot(page, "prod-home-1440");
    findings.prod = {
      status: res?.status() ?? null,
      screenshot: file,
      h1Font: await page.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily).catch(() => null),
      hasFooter: (await page.locator("footer").count()) > 0,
      hasMinhBach: (await page.locator("#minh-bach").count()) > 0,
    };
  } catch (e) {
    findings.prod = { error: String(e) };
  }
  await context.close();
}

const jsonPath = path.join(outDir, "luxury-baseline-findings.json");
fs.writeFileSync(jsonPath, JSON.stringify(findings, null, 2));
console.log("Wrote", jsonPath);
console.log(
  "H1 fonts:",
  Object.fromEntries(Object.entries(findings.routes).map(([k, v]) => [k, v.h1Font?.split(",")[0]])),
);
await browser.close();
