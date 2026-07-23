/**
 * Real perceptual pixel diff (vault-pattern inspired) using pixelmatch/pngjs.
 * Compares reports/assets/luxury-baseline-*.png against reports/assets/luxury-golden/*.png.
 * Usage: node scripts/luxury/diff.mjs
 */
import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const assets = path.resolve("reports/assets");
const golden = path.join(assets, "luxury-golden");
const diffDir = path.join(assets, "luxury-diff");
const baselines = fs
  .readdirSync(assets)
  .filter((f) => f.startsWith("luxury-baseline-") && f.endsWith(".png"));

if (!fs.existsSync(golden)) {
  console.log(
    JSON.stringify(
      {
        status: "NO_GOLDEN",
        message: "Create reports/assets/luxury-golden/ and copy approved baseline PNGs to enable pixel diff.",
        baselinesFound: baselines.length,
        next: "After UI polish, copy luxury-baseline-*.png → luxury-golden/ then re-run diff.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

fs.mkdirSync(diffDir, { recursive: true });

function readPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

const results = [];
for (const f of baselines) {
  const goldenNamed = path.join(golden, f.replace("luxury-baseline-", "luxury-golden-"));
  const goldenSame = path.join(golden, f);
  const target = fs.existsSync(goldenNamed) ? goldenNamed : fs.existsSync(goldenSame) ? goldenSame : null;
  if (!target) {
    results.push({ file: f, status: "MISSING_GOLDEN" });
    continue;
  }

  const a = readPng(path.join(assets, f));
  const b = readPng(target);

  if (a.width !== b.width || a.height !== b.height) {
    results.push({
      file: f,
      status: "DIMENSION_MISMATCH",
      baseline: { width: a.width, height: a.height },
      golden: { width: b.width, height: b.height },
    });
    continue;
  }

  const { width, height } = a;
  const outPng = new PNG({ width, height });
  const mismatchedPixels = pixelmatch(a.data, b.data, outPng.data, width, height, {
    threshold: 0.1,
  });
  const totalPixels = width * height;
  const diffPct = Math.round((mismatchedPixels / totalPixels) * 10000) / 100;

  const diffFile = path.join(diffDir, f.replace("luxury-baseline-", "diff-"));
  fs.writeFileSync(diffFile, PNG.sync.write(outPng));

  results.push({
    file: f,
    status: diffPct === 0 ? "IDENTICAL" : diffPct < 1 ? "MATCH" : diffPct < 5 ? "MINOR_DIFF" : "MAJOR_DIFF",
    mismatchedPixels,
    totalPixels,
    diffPct,
    diffImage: path.basename(diffFile),
  });
}

const out = path.join(assets, "luxury-diff-report.json");
fs.writeFileSync(
  out,
  JSON.stringify({ comparedAt: new Date().toISOString(), engine: "pixelmatch@7", threshold: 0.1, results }, null, 2),
);
console.log("Wrote", out);
console.log(JSON.stringify(results, null, 2));
