# Independent browser review — MapLibre Wave-2 (third-party pass)

Date: 2026-07-21 (review session)  
Method: **Live Chromium via Playwright** against `http://localhost:3000` — not code-only.  
Script: `v0/scripts/indep-map-review.mjs`  
Artifacts: `v0/reports/assets/v0-wave2-indep-review-*.png` + `v0-wave2-indep-review-findings.json`

## Runtime evidence (this pass)

| ID | Check | Result | Measured |
|----|-------|--------|----------|
| Q1 | Canvas, not SVG squiggle | **PASS** | `svgCount: 0`, canvas visible |
| Q2 | ≥2 MapLibre markers | **PASS** | `markerCount: 2` |
| AC1 desktop | Stage ~100dvh | **PASS** | stage height **900px** on 900px viewport |
| AC1 mobile | Stage ≥70vh | **PASS** | stage height **568.4px** on 812px (≈70vh) |
| MAP-CHROME | canvas + zoom ctrl + attrib | **PASS** | attribution text `MapLibre` |
| GEOJSON | `/geo/portfolio-regions.geojson` | **PASS** | 2 features `bac-ninh`, `tp-hcm` HTTP OK |
| AC4 | HH CTA + UTM | **PASS** | href contains `sa-ban` + `utm_source=ded-pmh` |
| Q3 | List → filter | **PASS** | navigated to `/du-an?khu-vuc=bac-ninh` |
| AC2 | wheel scrolls page | **PASS** | `scrollY` 0 → **500** after `mouse.wheel` on map |
| AC8 | map-related console errors | **PASS** | `mapErrors: []`, `allErrors: []` |

Screenshots taken this pass:
- `v0-wave2-indep-review-desktop.png`
- `v0-wave2-indep-review-map-only.png`
- `v0-wave2-indep-review-mobile.png`

Visual (from screenshots): demotiles country colors; **teal halos** around BN + HCM pins readable at default national zoom; sidebar CTA **Sa bàn Hồng Hạc →** visible. Vietnam interior still one country fill (expected — not 63-province choropleth).

## Cross-check vs prior smoke claims

| Claim in polish-smoke | This independent pass |
|----------------------|------------------------|
| Height 100dvh / 70vh | **CONFIRMED** (900 / 568 measured) |
| scrollZoom false via real wheel | **CONFIRMED** |
| HH CTA UTM | **CONFIRMED** |
| Halo visible at default zoom | **CONFIRMED** in fresh screenshots |
| `voidMicrotask` fixed → `queueMicrotask` | **CONFIRMED in current file** (`queueMicrotask` present; no `voidMicrotask`) |
| `attributionControl: true` removed | **CONFIRMED** (option omitted; attrib still shows) |
| Full suite 23/23 | **Not re-run this pass** — only live browser probe + map interactions above |

## Honest caveats (not failures)

1. **AC3 spirit:** Halos make pins distinct; **true province AOI fill remains nearly invisible at default fitBounds** — only meaningful when zoomed. That matches prompt scope (halo carries national zoom; GeoJSON for zoom-in). Do not market as “tô màu theo tỉnh hành chính”.
2. **No MapLibre `queryRenderedFeatures` in this pass** — no `window` map handle exposed; layer presence inferred from GeoJSON 200 + visual halos + prior session’s debug (accepted with that limit).
3. Did **not** re-execute full `pnpm test:e2e` in this review minute — recommend one full run before commit if desired.

## Verdict

```
INDEPENDENT_REVIEW: PASS (runtime)
CONFIRMED: Q1 Q2 Q3 AC1 AC2 AC4 AC8 + map chrome + geo fetch
AC3: PASS with caveat (halo-led distinction; AOI fill secondary at z≈5–6)
PRIOR_BUGS (voidMicrotask / attributionControl): not present in current tree
```
