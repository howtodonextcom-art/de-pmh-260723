/**
 * Independent verify for score-lift claim + Stretch S1 (prod).
 * Usage: node scripts/indep-scorelift-verify.mjs
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const LOCAL = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const PROD = process.env.PROD_BASE_URL || "https://de-division-pmh.vercel.app";
const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });

const findings = {
  capturedAt: new Date().toISOString(),
  toolPath: "playwright-script (MCP tried separately)",
  local: {},
  prod: {},
  checks: [],
};

function check(id, result, detail) {
  findings.checks.push({ id, result, detail });
  console.log(JSON.stringify({ id, result, detail }));
}

const browser = await chromium.launch({ headless: true });

async function probe(base, route, name, viewport = { width: 1440, height: 900 }, opts = {}) {
  const context = await browser.newContext({ viewport, colorScheme: opts.dark ? "dark" : "light" });
  const page = await context.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
  let status = null;
  try {
    const res = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    status = res?.status() ?? null;
  } catch (e) {
    await context.close();
    return { name, route, status: null, error: String(e), consoleErrors: errs };
  }
  await page.waitForTimeout(opts.waitMs ?? 1400);

  if (opts.scrollMap) {
    const mapH = page.getByRole("heading", { name: /Bản đồ phân bố/i });
    if (await mapH.count()) {
      await mapH.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
    }
  }

  const shot = path.join(outDir, `indep-lift-${name}.png`);
  await page.screenshot({ path: shot, fullPage: !!opts.fullPage });

  const bodyText = (await page.locator("body").innerText().catch(() => "")) || "";
  const entry = {
    name,
    route,
    base,
    status,
    screenshot: path.basename(shot),
    h1: await page.getByRole("heading", { level: 1 }).first().innerText().catch(() => null),
    h1FontFamily: await page
      .locator("h1")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily)
      .catch(() => null),
    hasFooter: (await page.locator("footer").count()) > 0,
    footerTextSample: await page.locator("footer").first().innerText().catch(() => null),
    hasMinhBach: (await page.locator("#minh-bach").count()) > 0 || bodyText.includes("Nguyên tắc minh bạch dữ liệu"),
    hasTransparencyCta: bodyText.includes("Cách chúng tôi xác minh dữ liệu"),
    hasLabBanner: bodyText.includes("nội bộ") || bodyText.toLowerCase().includes("internal"),
    robotsMeta: await page.locator('meta[name="robots"]').getAttribute("content").catch(() => null),
    phapLyIntro: route.includes("phap-ly")
      ? (await page.locator("main p, section p").first().innerText().catch(() => null))
      : null,
    phapLyJump: route.includes("phap-ly") ? (await page.locator("nav a, a[href^='#']").count()) : null,
    phapLyCards: route.includes("phap-ly")
      ? await page.locator("main section, main article, [data-project], .rounded-xl, .rounded-2xl").count()
      : null,
    mapCanvas: opts.scrollMap
      ? await page.getByTestId("region-map-canvas").isVisible().catch(() => false)
      : null,
    mapMarkers: opts.scrollMap ? await page.locator(".maplibregl-marker").count() : null,
    hhCtaHref: opts.scrollMap
      ? await page.getByTestId("sa-ban-hh-cta").getAttribute("href").catch(() => null)
      : null,
    consoleErrors: errs,
  };
  await context.close();
  return entry;
}

// LOCAL
findings.local.home = await probe(LOCAL, "/", "local-home-1440", { width: 1440, height: 900 }, { waitMs: 1600, scrollMap: true });
findings.local.homeMobile = await probe(LOCAL, "/", "local-home-375", { width: 375, height: 812 });
findings.local.duAn = await probe(LOCAL, "/du-an", "local-du-an-1440");
findings.local.detail = await probe(LOCAL, "/du-an/hong-hac-city", "local-detail-hh-1440", { width: 1440, height: 900 }, { waitMs: 1800 });
findings.local.soSanh = await probe(LOCAL, "/so-sanh", "local-so-sanh-1440");
findings.local.phapLy = await probe(LOCAL, "/phap-ly", "local-phap-ly-1440");
findings.local.phapLyMobile = await probe(LOCAL, "/phap-ly", "local-phap-ly-375", { width: 375, height: 812 });
findings.local.lab = await probe(LOCAL, "/lab", "local-lab-1440");

// sitemap / robots via page request
{
  const context = await browser.newContext();
  const page = await context.newPage();
  const sm = await page.request.get(`${LOCAL}/sitemap.xml`);
  const rb = await page.request.get(`${LOCAL}/robots.txt`);
  const robotsText = await rb.text();
  findings.local.seo = {
    sitemapStatus: sm.status(),
    robotsStatus: rb.status(),
    robotsText: robotsText.slice(0, 800),
    robotsDisallowLab: /Disallow:\s*\/lab/i.test(robotsText),
  };
  await context.close();
}

// PROD
findings.prod.home = await probe(PROD, "/", "prod-home-1440", { width: 1440, height: 900 }, { waitMs: 2000 });
findings.prod.phapLy = await probe(PROD, "/phap-ly", "prod-phap-ly-1440");

const routes = [
  findings.local.home,
  findings.local.duAn,
  findings.local.detail,
  findings.local.soSanh,
  findings.local.phapLy,
  findings.local.lab,
];

check(
  "H1-FRAUNCES-LOCAL",
  routes.every((r) => r.h1FontFamily && /Fraunces/i.test(r.h1FontFamily)) ? "PASS" : "FAIL",
  Object.fromEntries(routes.map((r) => [r.name, r.h1FontFamily])),
);
check(
  "H2-FOOTER-LOCAL",
  routes.every((r) => r.hasFooter) ? "PASS" : "FAIL",
  Object.fromEntries(routes.map((r) => [r.name, r.hasFooter])),
);
check(
  "H4-NO-MINH-BACH",
  !findings.local.home.hasMinhBach && !findings.local.home.hasTransparencyCta ? "PASS" : "FAIL",
  {
    hasMinhBach: findings.local.home.hasMinhBach,
    hasTransparencyCta: findings.local.home.hasTransparencyCta,
  },
);
check(
  "H5-SEO",
  findings.local.seo.sitemapStatus === 200 &&
    findings.local.seo.robotsStatus === 200 &&
    findings.local.seo.robotsDisallowLab
    ? "PASS"
    : "FAIL",
  findings.local.seo,
);
check(
  "H6-LAB",
  findings.local.lab.hasLabBanner || (findings.local.lab.robotsMeta || "").includes("noindex") ? "PASS" : "FAIL",
  { bannerish: findings.local.lab.hasLabBanner, robotsMeta: findings.local.lab.robotsMeta },
);
check(
  "H9-MAP",
  findings.local.home.mapCanvas &&
    (findings.local.home.mapMarkers ?? 0) >= 2 &&
    findings.local.home.hhCtaHref?.includes("utm_source=ded-pmh")
    ? "PASS"
    : "FAIL",
  {
    mapCanvas: findings.local.home.mapCanvas,
    markers: findings.local.home.mapMarkers,
    href: findings.local.home.hhCtaHref,
  },
);
check(
  "S1-PROD-PARITY",
  findings.prod.home.h1FontFamily && /Fraunces/i.test(findings.prod.home.h1FontFamily) && findings.prod.home.hasFooter && !findings.prod.home.hasMinhBach
    ? "PASS"
    : "FAIL",
  {
    prodFont: findings.prod.home.h1FontFamily,
    prodFooter: findings.prod.home.hasFooter,
    prodMinhBach: findings.prod.home.hasMinhBach,
    prodTransparencyCta: findings.prod.home.hasTransparencyCta,
    status: findings.prod.home.status,
  },
);

const jsonPath = path.join(outDir, "indep-lift-findings.json");
fs.writeFileSync(jsonPath, JSON.stringify(findings, null, 2));
console.log("Wrote", jsonPath);
await browser.close();
process.exit(findings.checks.some((c) => c.result === "FAIL") ? 1 : 0);
