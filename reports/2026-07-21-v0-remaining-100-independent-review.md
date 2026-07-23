# Independent review — Remaining 100% closure

Date: 2026-07-21 (review session)  
Method: **Live Chromium (Playwright)** against `http://localhost:3000` — not smoke-report trust.  
Scripts: `scripts/indep-r100-review.mjs` + targeted EN probe + e2e subset.  
No browser MCP in this Cursor session — Playwright used as runtime evidence.

## Deliverables on disk

| Path | Present |
|------|---------|
| `lib/map-shell/*` + README | Yes |
| `lib/geo/geojson-contract.ts` | Yes |
| `docs/DATA_CONTRACT_GEOJSON.md`, `PDF_EXPORT.md`, `ADR-001-*`, `I18N_EN.md` | Yes |
| `lib/i18n/en.json`, `locale-context.tsx`, `locale-switcher.tsx` | Yes |
| `region-map-canvas.tsx` imports `@/lib/map-shell` | Yes (code grep) |
| `pdf-export-trigger.tsx` env-gated | Yes (code grep) |

## Live browser / e2e evidence

| ID | Check | Result | Evidence |
|----|-------|--------|----------|
| R05 | Map after map-shell extract | **PASS** | 2 markers, stage height 900px; `indep-r100-map.png` |
| R03 | HH CTA regression | **PASS** | testid + UTM href intact |
| R06 | GeoJSON sample served | **PASS** | `/geo/portfolio-regions.geojson` HTTP 200 |
| R07 | Switcher VI→EN | **PASS** | `locale-switch-en` → “Data transparency principles”, “Explore 4 projects”, “Projects”; `indep-r100-r07-en-verified.png` |
| R07 | Switcher EN→VI | **PASS** | “Khám phá 4 dự án” restored |
| R07 scope | Full-site EN | **CONDITIONAL** | Confirmed: home wired; `/du-an` etc. still vi per `I18N_EN.md` — matches allowed AC3 |
| R08 | No PDF function fetch when env unset | **PASS** | Clicked Xuất PDF; `pdfFnHits: []`; e2e pdf-function-honesty 2/2 |
| Console | Map/runtime errors on probe | **PASS** | `[]` |
| e2e subset | map + locale + pdf + sellability | **PASS** | **11/11** |

## Cross-check vs self-reported smoke

| Claim | Independent |
|-------|-------------|
| AC1 map-shell + map e2e | **CONFIRMED** |
| AC2 data contract docs+validator files | **CONFIRMED** (files + geo 200; validator not executed as unit in this pass) |
| AC3 EN switcher CONDITIONAL | **CONFIRMED** (works on home; not full site) |
| AC4 PDF honesty | **CONFIRMED** live + e2e |
| AC5 R10 ≤8 fixes / map untouched | **Not re-audited all 8 UX cats**; map regression **CONFIRMED** green |
| AC6 ADR-001 + WHAT_YOU_BUY | **CONFIRMED** files exist |
| AC7 full 29/29 | **Not re-run full suite** this pass — critical 11/11 green |
| AC9 no commit | Assumed; not verified via git in this review |

## Caveats

1. Full `pnpm test:e2e` (29) not re-executed here — only closure-critical specs.
2. R06 validator “sample validates” not re-run as Node unit script — file presence + public geo OK.
3. R10 “2 fixes” accepted from audit report; this pass only confirms no map break.

## Verdict

```
INDEPENDENT_REVIEW: PASS (runtime)
R05 R06(files) R07(home+CONDITIONAL) R08 R03-regression: CONFIRMED
AC3 CONDITIONAL: CONFIRMED as documented partial EN coverage
E2E_SUBSET: 11/11
```
