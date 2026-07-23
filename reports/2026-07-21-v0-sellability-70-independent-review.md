# Independent review — Sellability 70% pack

Date: 2026-07-21 (review session)  
Method: **Live Chromium (Playwright)** + HTTP checks — not code-only.  
Note on MCP: **No browser MCP** is available in this Cursor session (only Vercel MCP). Vercel `list_projects` for team `team_4tEDKoQhCTsRBYCsIhjavSID` returned **empty**; production checked via direct HTTP instead. Browser verification used `scripts/indep-sell70-review.mjs`.

Artifacts: `reports/assets/indep-sell70-*.png`, `indep-sell70-findings.json`

## Doc audit (existence + claims)

| Deliverable | Present | Spot-check |
|---|---|---|
| `docs/WHAT_YOU_BUY.md` | Yes | 6 routes, both repos, both prod URLs, sa-ban = separate IP, OUT list R05–R08/R12, no invented ask price |
| `docs/DEMO_SCRIPT_15MIN.md` | Yes | 7 timed steps, VN talk track, step 3 = HH CTA |
| `docs/README.md` | Yes | Links both docs + map reports + canonical URLs |
| `e2e/sellability.spec.ts` | Yes | Soft external sa-ban check (skip on network fail) |
| `app/icon.tsx` | Yes | Dynamic favicon |

## Live browser results (`localhost:3000`)

| ID | Check | Result | Measured |
|----|-------|--------|----------|
| FAVICON | `GET /icon` | **PASS** | 200 `image/png` |
| FAVICON-404 | no favicon.ico 404 on load | **PASS** | `favicon404: []` |
| DEMO-1 | Hero visible | **PASS** | |
| DEMO-2 | Map + 2 markers + ~100dvh | **PASS** | markers=2, stageHeight=**900** |
| R10 sidebar | Top-aligned (not vertically centered) | **PASS** | intro `topGap` vs stage = **8px** (≪ 80px threshold). Empty space *below* cards is expected when top-aligned in a tall column — not re-centering. |
| DEMO-3 CTA | HH link + UTM + `_blank` | **PASS** | href matches contract |
| MAP-FILTER | BN list → filter | **PASS** | `/du-an?khu-vuc=bac-ninh` |
| SA-BAN-LIVE | External sa-ban | **PASS** | HTTP **200** |
| PROD-URL | `de-division-pmh.vercel.app` | **PASS** | HTTP **200** (docs debt “not re-confirmed” is **cleared** this pass) |
| CONSOLE | map/favicon errors | **PASS** | `allErrors: []`, no 4xx of note |

e2e re-run this pass: `map.spec.ts` + `sellability.spec.ts` → **6/6 passed**.

## Cross-check vs smoke self-report

| Smoke claim | Independent |
|---|---|
| AC1–AC3 docs | **CONFIRMED** |
| AC4 e2e + soft sa-ban | **CONFIRMED** (sa-ban 200 live) |
| AC5 screenshots | Prior assets exist; **new** `indep-sell70-*` captured |
| AC6 map regressions | **CONFIRMED** via map e2e + live probe |
| Favicon fix | **CONFIRMED** (`/icon` 200, no 404) |
| Sidebar align | **CONFIRMED by measurement** (8px top gap) |
| Prod URL live | **CONFIRMED** (was listed as debt — now verified 200) |
| Full suite 24/24 | **Not re-run full suite** this minute — only map+sellability 6/6 |

## Caveats

1. Browser MCP unavailable — Playwright Chromium used as equivalent runtime evidence.
2. Vercel MCP could not list projects on the returned team (empty) — production still verified by HTTP GET.
3. Image “looks centered” is misleading: top-align leaves whitespace **under** the cards inside a 900px column; metric proves top alignment.

## Verdict

```
INDEPENDENT_REVIEW: PASS (runtime)
SELLABILITY_70: CONFIRMED for R01 R02 R04 R10-bounded R11
PROD + SA-BAN: both HTTP 200
REMAINING OUT (unchanged): R05 R06 R07 R08 R12
```
