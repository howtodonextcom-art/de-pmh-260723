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
const browser = await chromium.launch({ headless: true });

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

await visit("/", { width: 1440, height: 900 }, "home-1440", { waitMs: 1600, scrollMap: true });
await visit("/", { width: 1440, height: 900 }, "home-dark-1440", { dark: true, waitMs: 1500 });
await visit("/", { width: 375, height: 812 }, "home-375", { waitMs: 1500 });
await visit("/", { width: 1440, height: 900 }, "map-loading-1440", { waitMs: 100, scrollMap: true, throttleMapStyle: true });
await visit("/du-an", { width: 1440, height: 900 }, "du-an-1440");
await visit("/du-an/hong-hac-city", { width: 1440, height: 900 }, "detail-hh-1440", { waitMs: 1800 });
await visit("/du-an/hong-hac-city", { width: 375, height: 812 }, "detail-hh-375", { waitMs: 1800 });
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
