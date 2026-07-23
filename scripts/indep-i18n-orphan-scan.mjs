/**
 * Rescan i18n leaf keys for orphans (independent review).
 */
import fs from "fs";
import path from "path";

const vi = JSON.parse(fs.readFileSync("lib/i18n/vi.json", "utf8"));
const en = JSON.parse(fs.readFileSync("lib/i18n/en.json", "utf8"));

function leaves(obj, p = "") {
  let out = [];
  for (const [k, v] of Object.entries(obj)) {
    const kp = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out = out.concat(leaves(v, kp));
    else out.push(kp);
  }
  return out;
}

const vl = leaves(vi);
const el = leaves(en);
const onlyVi = vl.filter((k) => !el.includes(k));
const onlyEn = el.filter((k) => !vl.includes(k));

const src = [];
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) {
      if (["node_modules", ".next", "vendor", "reports", "prompts", "scripts", "e2e"].includes(f.name)) continue;
      walk(p);
    } else if (/\.(tsx?|jsx?)$/.test(f.name)) src.push(p);
  }
}
walk("app");
walk("components");
walk("lib");

const blob = src.map((f) => fs.readFileSync(f, "utf8")).join("\n");

function used(k) {
  if (blob.includes(`"${k}"`) || blob.includes(`'${k}'`)) return true;
  if (blob.includes(`t("${k}")`) || blob.includes(`t('${k}')`)) return true;
  // nested access e.g. messages.home.titleWords / home.titleWords
  const parts = k.split(".");
  if (parts.length >= 2) {
    const tail2 = parts.slice(-2).join(".");
    if (blob.includes(tail2)) return true;
  }
  return false;
}

const possiblyUnused = vl.filter((k) => !used(k));
const inputGroupExists = fs.existsSync("components/ui/input-group.tsx");
const footerExists = fs.existsSync("components/shared/site-footer.tsx");
const fontsExists = fs.existsSync("app/fonts.ts");
const sitemapExists = fs.existsSync("app/sitemap.ts");
const robotsExists = fs.existsSync("app/robots.ts");
const archiveReadme = fs.existsSync("scripts/archive/README.md");

console.log(
  JSON.stringify(
    {
      viKeys: vl.length,
      enKeys: el.length,
      onlyVi,
      onlyEn,
      possiblyUnused,
      inputGroupExists,
      footerExists,
      fontsExists,
      sitemapExists,
      robotsExists,
      archiveReadme,
    },
    null,
    2,
  ),
);
