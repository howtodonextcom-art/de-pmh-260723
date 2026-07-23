/**
 * Browser-first evidence for full maturity audit (2026-07-22).
 * Usage: node scripts/indep-maturity-audit.mjs
 * Requires: pnpm dev on http://localhost:3000
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });

const findings = {
  base: BASE,
  capturedAt: new Date().toISOString(),
  routes: {},
  checks: [],
  consoleErrors: [],
  failedRequests: [],
};

function check(id, result, detail) {
  findings.checks.push({ id, result, detail });
  console.log(JSON.stringify({ id, result, detail }));
}

const browser = await chromium.launch({ headless: true });

async function shoot(name, page) {
  const file = path.join(outDir, `maturity-audit-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function visit(route, viewport, name, opts = {}) {
  const context = await browser.newContext({
    viewport,
    colorScheme: opts.dark ? "dark" : "light",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failed = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push("PAGEERROR: " + err.message));
  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().includes("_next/static")) {
      failed.push({ url: res.url(), status: res.status() });
    }
  });

  const url = `${BASE}${route}`;
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(opts.waitMs ?? 1200);

  const bodyText = (await page.locator("body").innerText().catch(() => "")) || "";
  const shot = await shoot(name, page);

  const entry = {
    route,
    viewport,
    dark: !!opts.dark,
    status: res?.status() ?? null,
    screenshot: path.basename(shot),
    hasMinhBach: bodyText.includes("Nguyên tắc minh bạch dữ liệu") || (await page.locator("#minh-bach").count()) > 0,
    hasTransparencyCta: bodyText.includes("Cách chúng tôi xác minh dữ liệu"),
    h1: await page.getByRole("heading", { level: 1 }).first().innerText().catch(() => null),
    consoleErrors,
    failedRequests: failed.slice(0, 20),
  };

  if (opts.extra) await opts.extra(page, entry);

  findings.routes[name] = entry;
  findings.consoleErrors.push(...consoleErrors.map((t) => ({ name, t })));
  findings.failedRequests.push(...failed.map((f) => ({ name, ...f })));

  await context.close();
  return entry;
}

// Desktop routes
await visit("/", { width: 1440, height: 900 }, "home-desktop-1440", {
  waitMs: 1500,
  extra: async (page, entry) => {
    const mapHeading = page.getByRole("heading", { name: /Bản đồ phân bố/i });
    if (await mapHeading.count()) {
      await mapHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
      entry.mapCanvasVisible = await page.getByTestId("region-map-canvas").isVisible().catch(() => false);
      entry.mapMarkers = await page.locator(".maplibregl-marker").count();
      const stage = await page.getByTestId("region-map-stage").boundingBox();
      entry.mapStageHeight = stage?.height ?? null;
      const cta = page.getByTestId("sa-ban-hh-cta");
      entry.hhCtaHref = (await cta.getAttribute("href").catch(() => null)) || null;
      entry.hhCtaTarget = (await cta.getAttribute("target").catch(() => null)) || null;
      await shoot("home-map-desktop", page);
    }
    entry.brandInHero = /DED-PMH|DED ·/i.test(await page.locator("body").innerText());
  },
});

await visit("/du-an", { width: 1440, height: 900 }, "du-an-desktop-1440");
await visit("/du-an/hong-hac-city", { width: 1440, height: 900 }, "detail-hh-desktop-1440", { waitMs: 1800 });
await visit("/so-sanh", { width: 1440, height: 900 }, "so-sanh-desktop-1440");
await visit("/phap-ly", { width: 1440, height: 900 }, "phap-ly-desktop-1440");
await visit("/lab", { width: 1440, height: 900 }, "lab-desktop-1440");

// Mobile samples
await visit("/", { width: 375, height: 812 }, "home-mobile-375", { waitMs: 1500 });
await visit("/du-an", { width: 375, height: 812 }, "du-an-mobile-375");
await visit("/so-sanh", { width: 375, height: 812 }, "so-sanh-mobile-375");
await visit("/du-an/hong-hac-city", { width: 375, height: 812 }, "detail-hh-mobile-375", { waitMs: 1800 });

// Dark home
await visit("/", { width: 1440, height: 900 }, "home-dark-1440", { dark: true, waitMs: 1500 });

const home = findings.routes["home-desktop-1440"];
check(
  "NO-MINH-BACH",
  home && !home.hasMinhBach && !home.hasTransparencyCta ? "PASS" : "FAIL",
  { hasMinhBach: home?.hasMinhBach, hasTransparencyCta: home?.hasTransparencyCta },
);
check(
  "MAP-WAVE2",
  home?.mapCanvasVisible && (home?.mapMarkers ?? 0) >= 2 && (home?.mapStageHeight ?? 0) >= 500 ? "PASS" : "FAIL",
  {
    mapCanvasVisible: home?.mapCanvasVisible,
    mapMarkers: home?.mapMarkers,
    mapStageHeight: home?.mapStageHeight,
  },
);
check(
  "HH-CTA-UTM",
  home?.hhCtaHref?.includes("utm_source=ded-pmh") && home?.hhCtaTarget === "_blank" ? "PASS" : "FAIL",
  { href: home?.hhCtaHref, target: home?.hhCtaTarget },
);

const allOk = Object.values(findings.routes).every((r) => r.status === 200);
check("ALL-ROUTES-200", allOk ? "PASS" : "FAIL", {
  statuses: Object.fromEntries(Object.entries(findings.routes).map(([k, v]) => [k, v.status])),
});

const jsonPath = path.join(outDir, "maturity-audit-findings.json");
fs.writeFileSync(jsonPath, JSON.stringify(findings, null, 2));
console.log("Wrote", jsonPath);

await browser.close();
process.exit(findings.checks.some((c) => c.result === "FAIL") ? 1 : 0);
