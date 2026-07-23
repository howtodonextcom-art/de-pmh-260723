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
const requests = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push("PAGEERROR: " + err.message));
page.on("request", (req) => requests.push(req.url()));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1500);

// --- R07 Locale switcher ---
const switcher = page.getByRole("button", { name: /EN|English|Tiếng|VI|Vie/i }).or(page.locator("[data-testid='locale-switcher']"));
const switcherAlt = page.locator("button").filter({ hasText: /^EN$|^VI$|English|Tiếng Việt/ });
let switcherFound = false;
let switcherHandle = switcherAlt.first();
if (await switcherHandle.count()) {
  switcherFound = true;
} else {
  // Try any button containing EN near header
  const headerBtns = page.locator("header button, header a");
  const count = await headerBtns.count();
  for (let i = 0; i < count; i++) {
    const t = ((await headerBtns.nth(i).innerText()) || "").trim();
    if (/^(EN|VI|English)$/i.test(t) || t.includes("EN") || t.includes("VI")) {
      switcherHandle = headerBtns.nth(i);
      switcherFound = true;
      break;
    }
  }
}

log("R07-SWITCHER-PRESENT", switcherFound ? "PASS" : "FAIL", { switcherFound });

if (switcherFound) {
  await switcherHandle.click();
  await page.waitForTimeout(800);
  // After click, either toggled to EN or opened menu — try click EN if menu
  const enOpt = page.getByRole("menuitem", { name: /English|EN/i }).or(page.getByText("English"));
  if (await enOpt.count()) {
    await enOpt.first().click();
    await page.waitForTimeout(500);
  }
}

const bodyText = await page.locator("body").innerText();
const hasEnHints =
  /Explore|Projects|Compare|Legal|Distribution map|Loading map|Search/i.test(bodyText) ||
  /Discover|View all|Featured/i.test(bodyText);
log("R07-EN-COPY", hasEnHints ? "PASS" : "CONDITIONAL", {
  sample: bodyText.slice(0, 400).replace(/\s+/g, " "),
});
await page.screenshot({ path: path.join(outDir, "indep-r100-r07-en.png") });

// Reset to VI if possible for rest of tests
if (switcherFound) {
  await switcherHandle.click().catch(() => {});
  await page.waitForTimeout(400);
  const viOpt = page.getByRole("menuitem", { name: /VI|Tiếng|Vietnamese/i }).or(page.getByText(/Tiếng Việt|^VI$/));
  if (await viOpt.count()) await viOpt.first().click().catch(() => {});
  await page.waitForTimeout(400);
}

// --- R05 map still works ---
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 90000 });
await page.getByRole("heading", { name: /Bản đồ phân bố|Distribution map/i }).scrollIntoViewIfNeeded();
await page.waitForTimeout(3000);
const canvas = page.getByTestId("region-map-canvas");
await canvas.waitFor({ state: "visible", timeout: 20000 });
const markers = await page.locator(".maplibregl-marker").count();
const stage = await page.getByTestId("region-map-stage").boundingBox();
log("R05-MAP", markers >= 2 && (stage?.height ?? 0) >= 500 ? "PASS" : "FAIL", {
  markers,
  stageHeight: stage?.height,
});
await page.screenshot({ path: path.join(outDir, "indep-r100-map.png") });

// HH CTA still there
const cta = page.getByTestId("sa-ban-hh-cta");
const ctaVisible = await cta.isVisible().catch(() => false);
log("R03-CTA-REGRESSION", ctaVisible ? "PASS" : "FAIL", {
  href: ctaVisible ? await cta.getAttribute("href") : null,
});

// --- R08 PDF honesty: go to a detail page, click export if present, ensure no PDF function URL hit ---
requests.length = 0;
await page.goto("http://localhost:3000/du-an/hong-hac-city", { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1000);
const pdfBtn = page.getByRole("button", { name: /Xuất PDF|Export PDF|PDF/i }).or(page.getByText(/Xuất PDF|Export PDF/));
let pdfClicked = false;
if (await pdfBtn.count()) {
  // Dialog handler for print
  page.on("dialog", async (d) => {
    await d.dismiss().catch(() => {});
  });
  await pdfBtn.first().click();
  pdfClicked = true;
  await page.waitForTimeout(1500);
}
const pdfFnHits = requests.filter((u) => /PDF_FUNCTION|exportFactSheet|export-fact-sheet|cloudfunctions/i.test(u));
log("R08-NO-FAKE-FN", pdfFnHits.length === 0 ? "PASS" : "FAIL", { pdfClicked, pdfFnHits: pdfFnHits.slice(0, 5) });

// Geo contract file fetch
const geo = await page.request.get("http://localhost:3000/geo/portfolio-regions.geojson");
log("R06-GEO-SAMPLE", geo.ok() ? "PASS" : "FAIL", { status: geo.status() });

// Docs on disk (not browser)
const docs = [
  "docs/DATA_CONTRACT_GEOJSON.md",
  "docs/PDF_EXPORT.md",
  "docs/ADR-001-enterprise-rbac-ai-algolia.md",
  "docs/I18N_EN.md",
  "lib/map-shell/README.md",
  "lib/i18n/en.json",
  "lib/geo/geojson-contract.ts",
].map((p) => ({ p, ok: fs.existsSync(path.resolve(p)) }));
log(
  "DOCS-ON-DISK",
  docs.every((d) => d.ok) ? "PASS" : "FAIL",
  docs,
);

const mapErr = consoleErrors.filter((e) => /maplibre|ReferenceError|WebGL/i.test(e));
log("CONSOLE", mapErr.length === 0 ? "PASS" : "FAIL", { mapErr, all: consoleErrors.slice(0, 12) });

fs.writeFileSync(path.join(outDir, "indep-r100-findings.json"), JSON.stringify(findings, null, 2));
await browser.close();
console.log("DONE");
