import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const outDir = path.resolve("reports/assets");
fs.mkdirSync(outDir, { recursive: true });
const findings = [];
const log = (id, result, detail) => {
  findings.push({ id, result, detail });
  console.log(JSON.stringify({ id, result, detail }));
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
const failedRequests = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push("PAGEERROR: " + err.message));
page.on("response", (res) => {
  if (res.status() >= 400) failedRequests.push({ url: res.url(), status: res.status() });
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1500);

// Favicon / icon
const iconRes = await page.request.get("http://localhost:3000/icon");
log("FAVICON", iconRes.ok() && iconRes.headers()["content-type"]?.includes("image") ? "PASS" : "FAIL", {
  status: iconRes.status(),
  type: iconRes.headers()["content-type"],
});

const favicon404 = failedRequests.filter((r) => /favicon\.ico$/i.test(r.url) && r.status === 404);
log("FAVICON-404-CONSOLE-PATH", favicon404.length === 0 ? "PASS" : "FAIL", { favicon404 });

// Step 1 hero
const heroVisible = await page.getByRole("heading", { level: 1 }).first().isVisible().catch(() => false);
await page.screenshot({ path: path.join(outDir, "indep-sell70-step1-hero.png") });
log("DEMO-1-HERO", heroVisible ? "PASS" : "FAIL", { heroVisible });

// Step 2 map
await page.getByRole("heading", { name: "Bản đồ phân bố" }).scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
const canvas = page.getByTestId("region-map-canvas");
await canvas.waitFor({ state: "visible", timeout: 20000 });
const markers = await page.locator(".maplibregl-marker").count();
const stage = await page.getByTestId("region-map-stage").boundingBox();
const sidebar = page.locator('[data-testid="home-map-section"] .md\\:col-span-4, [data-testid="home-map-section"] .lg\\:col-span-3').first();
// Measure sidebar card top vs stage top for alignment
const listIntro = page.getByText("Chọn khu vực để lọc danh mục dự án.");
const introBox = await listIntro.boundingBox();
const stageBox = await page.getByTestId("region-map-stage").boundingBox();
const topGap = introBox && stageBox ? introBox.y - stageBox.y : null;
log("DEMO-2-MAP", markers >= 2 && (stage?.height ?? 0) >= 850 ? "PASS" : "FAIL", {
  markers,
  stageHeight: stage?.height,
  sidebarTopGapPx: topGap,
});
// Top-aligned: intro should be near top of stage (gap < 80px), not vertically centered (~400px)
log("R10-SIDEBAR-ALIGN", topGap !== null && topGap < 80 ? "PASS" : "FAIL", { topGap });

await page.screenshot({ path: path.join(outDir, "indep-sell70-step2-map.png") });
await page.getByTestId("region-map-stage").screenshot({
  path: path.join(outDir, "indep-sell70-map-only.png"),
});

// Step 3 HH CTA
const cta = page.getByTestId("sa-ban-hh-cta");
await expectVisible(cta);
const href = await cta.getAttribute("href");
const target = await cta.getAttribute("target");
log(
  "DEMO-3-CTA",
  href?.includes("utm_source=ded-pmh") && href.includes("sa-ban") && target === "_blank" ? "PASS" : "FAIL",
  { href, target },
);
await page.locator('[data-testid="region-card-bac-ninh"]').screenshot({
  path: path.join(outDir, "indep-sell70-step3-hh-cta.png"),
});

// Map → filter
await page.getByRole("button", { name: "Bắc Ninh 1 dự án" }).click();
await page.waitForURL(/khu-vuc=bac-ninh/, { timeout: 15000 });
log("MAP-FILTER", page.url().includes("khu-vuc=bac-ninh") ? "PASS" : "FAIL", { url: page.url() });

// Soft sa-ban
try {
  const saban = await page.request.get(
    "https://www.bacninhhonghaccity.vn/sa-ban?utm_source=ded-pmh&utm_medium=home-map&utm_campaign=map-cta",
    { timeout: 15000 },
  );
  log("SA-BAN-LIVE", saban.status() < 400 ? "PASS" : "FAIL", { status: saban.status() });
} catch (e) {
  log("SA-BAN-LIVE", "CONDITIONAL", { error: String(e) });
}

// Production URL cited in docs
try {
  const prod = await page.request.get("https://de-division-pmh.vercel.app/", { timeout: 20000 });
  log("PROD-URL", prod.status() < 400 ? "PASS" : "FAIL", { status: prod.status() });
} catch (e) {
  log("PROD-URL", "FAIL", { error: String(e) });
}

const mapErr = consoleErrors.filter((e) => /maplibre|favicon|WebGL|ReferenceError/i.test(e));
log("CONSOLE", mapErr.length === 0 ? "PASS" : "FAIL", {
  mapErr,
  allErrors: consoleErrors.slice(0, 15),
  failed4xx: failedRequests.filter((r) => !r.url.includes("favicon")).slice(0, 10),
});

fs.writeFileSync(path.join(outDir, "indep-sell70-findings.json"), JSON.stringify(findings, null, 2));
await browser.close();
console.log("DONE");

async function expectVisible(locator) {
  await locator.waitFor({ state: "visible", timeout: 10000 });
}
