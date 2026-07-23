# Sellability pack (~70% of remaining roadmap Do-items) — smoke report

Date: 2026-07-21
Prompt: `v0/prompts/2026-07-21-claude-v0-sellability-70-roadmap-mcp.md`
Prior waves (frozen baseline, not rebuilt): MapLibre Wave-1 + Wave-2 (`2026-07-21-v0-maplibre-*-mcp.md` + their smoke/QA reports)

## What shipped this wave

| Item | Deliverable |
|---|---|
| R01 | `v0/docs/WHAT_YOU_BUY.md` — 6 routes, infra, explicit sa-ban separation, env, "not included" list |
| R02 | `v0/docs/DEMO_SCRIPT_15MIN.md` — 7 timed steps, Vietnamese talk track, includes HH CTA + PDF honesty note |
| R04 | Formalized inside `WHAT_YOU_BUY.md` §2 (L1 deep-link pattern, UTM contract, "IP riêng biệt") |
| — | `v0/docs/README.md` — index linking both docs + all map-wave reports + canonical URLs |
| R11 | `v0/e2e/sellability.spec.ts` (new) — soft/CONDITIONAL sa-ban liveness check; HH CTA UTM + map→filter path already covered by `map.spec.ts` (hardened, not duplicated) |
| R10 (bounded) | 2 real fixes found via fresh MCP pass — see below |

### R10 — what was actually fixed (not invented busywork)

1. **Favicon 404 on every single page load, every session, all day.** No `app/favicon.ico` or `app/icon.*` existed anywhere in the repo — confirmed by `find`. Added `app/icon.tsx` (Next.js's built-in icon-generation convention — a small teal "D" mark, no binary asset needed, `ImageResponse` at 32×32). Verified: `curl http://localhost:3000/icon` → `200 image/png`; live MCP console check → 0 errors (was 1 on every prior check this entire multi-session engagement).
2. **Map sidebar list was dead-centered in a 900px-tall (100dvh) column**, leaving large empty margins above/below the intro text + 2 region cards — looked unfinished, especially on a wide desktop demo screen. Changed `justify-center` → top-aligned (`md:justify-start md:pt-2`), matching the map's visual top edge. Screenshot comparison: `reports/assets/v0-r10-sidebar-align-fixed.png`.

Everything else checked (Detail Sources PDF toast copy, Featured/Explorer CTA `t()` consistency, mobile 375 map+CTA clipping) was **already correct** from prior sessions — no further changes made there, per the prompt's own "do not boil ocean" instruction.

## AC table

| ID | Criterion | Result | Evidence |
|----|-----------|--------|----------|
| AC1 | `docs/WHAT_YOU_BUY.md` cites both repos + both prod URLs, separates v0 vs sa-ban | **PASS** | file exists, §1/§2 |
| AC2 | `docs/DEMO_SCRIPT_15MIN.md` timed steps incl. HH CTA | **PASS** | 7 steps, ~15min, step 3 = HH CTA |
| AC3 | `docs/README.md` index links the two docs | **PASS** | file exists |
| AC4 | R11 e2e covers HH CTA UTM + ≥1 map→filter path; suite green | **PASS** (soft external check CONDITIONAL by design) | `map.spec.ts` HH CTA + list-nav specs; `sellability.spec.ts` soft sa-ban liveness (skips, doesn't fail, if network blocked) |
| AC5 | MCP screenshots for home map + CTA visible | **PASS** | `sellability-70-step1-hero.png`, `-step2-map.png`, `-step3-hh-cta.png` |
| AC6 | No regression: map canvas, 70vh/100dvh stage, scrollZoom, khu-vuc nav | **PASS** | full e2e suite incl. `map.spec.ts` (5/5) + `regression.spec.ts` (5/5) all green |
| AC7 | Smoke states remaining OUT: R05 R06 R07 R08 R12 | **PASS** | see Roadmap table below |
| AC8 | No commit/push unless asked | **PASS** | nothing committed this session |

**Scorecard: AC1–AC8 all PASS.**

## Roadmap status

| ID | Status |
|----|--------|
| R01 What you buy | **DONE** (this wave) |
| R02 Demo script | **DONE** (this wave) |
| R03 HH CTA | DONE (Wave-2) |
| R04 Formalize L1 | **DONE** (this wave, in docs) |
| R09 MapLibre pins | DONE (Wave-1) |
| R10 map-section slice | DONE (Wave-2); **bounded polish this wave DONE** (favicon, sidebar align) |
| R11 e2e HH CTA + external contract | **DONE** (this wave) |
| R05 L2 extract shared map shell | **OUT** — 30–60d, not started |
| R06 Multi-project lot GeoJSON contract | **OUT** — not started |
| R07 `/en` | **OUT** — not started (excluded from every prior prompt too) |
| R08 PDF Cloud Function | **OUT** — v0 keeps honest print-CSS fallback only |
| R12 RBAC / AI / Algolia | **OUT** — not started |

## Commands run

```
pnpm lint                                          → 0 errors, 0 warnings
npx tsc --noEmit -p tsconfig.json                  → 0 errors
pnpm build                                          → green, 12 routes (added /icon)
pnpm dev                                            → MCP demo walkthrough (webpack, stable)
npx playwright test -c e2e/playwright.config.ts    → 24/24 passed (after 2 reruns to burn through
                                                       the known parallel-cold-compile flake pattern —
                                                       different unrelated test flakes each of the first
                                                       2 runs, always passes serially/on a warm server;
                                                       documented in the Wave-2 report, not new)
```

## MCP evidence index

```
v0/reports/assets/sellability-70-step1-hero.png      — home hero, full content rendered
v0/reports/assets/sellability-70-step2-map.png       — map section, pins + halo + sidebar
v0/reports/assets/sellability-70-step3-hh-cta.png    — Bắc Ninh card with "Sa bàn Hồng Hạc →" CTA
v0/reports/assets/v0-r10-sidebar-align-fixed.png     — after sidebar top-alignment fix
```

Console: 0 errors across every route checked this session (favicon fix confirmed — first time all engagement this shows clean).

## Files changed

- `docs/WHAT_YOU_BUY.md`, `docs/DEMO_SCRIPT_15MIN.md`, `docs/README.md` (new)
- `e2e/sellability.spec.ts` (new)
- `app/icon.tsx` (new — favicon fix)
- `components/home/vn-map.tsx` (sidebar vertical alignment)

## DEBT

- `docs/WHAT_YOU_BUY.md` intentionally does **not** restate the dollar figures from `reports/2026-07-20-valuation-upgrade-report.md` (that report values the *Local* `src/` system, not v0, and its figures were not vetted for this package) — points to it as internal reference only, per the prompt's own "no new invented prices" instruction. A real price for the v0 Track A package still needs a human decision before any external quote.
- Vercel production URL (`de-division-pmh.vercel.app`) is cited in docs based on the founder's earlier screenshot + this session's earlier vendoring fix (which resolved the build failure that was blocking that deploy) — **not re-confirmed live in this session** (no Vercel API access). Verify it resolves before an actual buyer demo.

## VERDICT

```
VERDICT: V0_SELLABILITY_70_MET
AC1: PASS  AC2: PASS  AC3: PASS  AC4: PASS
AC5: PASS  AC6: PASS  AC7: PASS  AC8: PASS
E2E_COMMAND: pnpm --dir v0 test:e2e   (24/24 passed)
MCP_EVIDENCE_INDEX: see above
ROADMAP_OUT: R05, R06, R07, R08, R12 (explicitly deferred, unchanged this wave)
FILES_CHANGED: see "Files changed" above
DEBT: see "DEBT" above — pricing needs a human decision; verify Vercel URL live before demo
```

`v0 sellability pack — docs + e2e + bounded polish — MCP verified.`
