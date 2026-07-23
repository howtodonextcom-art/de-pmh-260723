# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — v0 Track A SCORE LIFT 85→~100 + CLEAN SWEEP
# Source of truth: v0/reports/2026-07-22-v0-full-maturity-audit.md (§3 pillars, §4 01–08, §7 orphans, §8 P0–P2)
# Packages: P0 deploy/docs sync · orphan i18n+UI delete · Footer decision · display font · /phap-ly hierarchy · sitemap/robots · LCP eager · script archive · lab hygiene · re-score MCP
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: MULTI-WAVE IMPLEMENT + BROWSER-VERIFIED RE-SCORE + SMOKE REPORT
# Structural parents (form ONLY):
#   v0/prompts/2026-07-21-claude-v0-sellability-70-roadmap-mcp.md
#   v0/prompts/2026-07-21-claude-v0-remaining-100-closure-mcp.md
#   v0/prompts/2026-07-22-claude-v0-full-maturity-audit-8ux-mcp.md
# Frozen: MapLibre Wave-2 ACs · PDF honesty · R12 ADR-defer · no Enterprise build
# Max repair loops / wave: 3
# Sub-agents: **8** (Wave 1: 3 · Wave 2: 3 · Wave 3: 2 — Orchestrator runs all; merge + re-score)
# Target: Close audit backlog so Track A scoreboard reaches **≥95**, prefer **100/100** under honest ceiling (not Enterprise)

---

## 0. How to use

1. Treat audit report as backlog contract — do not re-audit from zero; **verify then fix**.
2. Execute **Wave 1 → Wave 2 → Wave 3** (Wave 1 clean must finish before design so diffs stay reviewable).
3. Spawn agents per §3; Orchestrator merges, keeps e2e green, re-runs maturity evidence, writes lift report.
4. Prefer `pnpm dev` (webpack). Evidence: Playwright script and/or MCP browser on `http://localhost:3000`; spot-check prod after deploy **only if human approved push/deploy**.
5. Do not commit/push/deploy unless human explicitly asks (P0 “deploy” = prepare checklist + local parity; actual push is human-gated).

**Scope lock:**
```text
WRITE: v0/app/**, v0/components/**, v0/lib/i18n/**, v0/docs/** (honesty only),
       v0/scripts/** (archive move OK), v0/e2e/** if needed,
       v0/reports/2026-07-23-v0-score-lift-clean-smoke.md (+ assets)
READ:  reports/2026-07-22-v0-full-maturity-audit.md (mandatory)
NO:    Firebase/auth/RBAC/AI/Algolia, Mapbox, sa-ban lot inventory, MapLibre rebuild
NO:    Full-site EN rewrite (P2#10) unless score still <95 after Waves 1–2 and Orchestrator justifies CONDITIONAL slice
NO:    Mass-deleting historical reports/; archive scripts only
NO:    Inventing fake APIs to “raise backend score”
```

---

## 1. Score math (from audit — climb path)

```text
Baseline 2026-07-22:  85 = A28 + B22 + C13 + D22
Ceiling Track A 100:  A30 + B25 + C15 + D30

Lift plan (expected if DoD met):
  Wave 1 Clean     → +A≈2 (ship/docs parity locally; deploy gated) +B≈2 (orphans) +C≈1–2  ⇒ ~90–91
  Wave 2 Design    → +D≈6–8 (font, footer, /phap-ly, sitemap|robots decision)           ⇒ ~96–99
  Wave 3 Polish    → +B/D remainder (LCP, lab, archive) + re-score honesty               ⇒ ≥95, aim 100

Honest OUT (do NOT score-fail for these):
  Enterprise backend, live PDF Function, full EN, sa-ban L2 embed, unit-test platform (P2#11 optional)
```

**Re-score rule:** After waves, re-run `scripts/indep-maturity-audit.mjs` (or successor), update pillar table with **same formula** as audit §1.1/§3. Browser evidence wins.

---

## 2. Non-negotiables

1. No regression: map Wave-2, HH CTA UTM, PDF honesty e2e, locale switcher home scope.
2. Orphan deletes only after ripgrep proves zero imports; keep `vi.json`/`en.json` key trees in sync.
3. Design lift must stay on-brand (teal tokens); **no purple gradient / cream-serif cliché / glassmorphism redo**.
4. Font: add **one** expressive display family for H1/section titles; keep Inter (or equivalent) for body — document choice in smoke report.
5. Footer: **one decision** — build minimal Footer **or** delete footer i18n keys; no half-state.
6. `/phap-ly`: improve hierarchy/visual break — not a new product route.
7. Historical reports stay; only living `docs/` stay accurate.
8. No commit/push/deploy without human OK.

---

## 3. Sub-agents (8)

### WAVE 1 — Clean sweep (Agents A–C)

#### Agent A — Orphan i18n + dead UI
From audit §7.2:
- Delete unused keys (both `vi.json` + `en.json`):  
  `brand.internalBadge`, `nav.duAn`, `nav.trangChu`, `nav.langVi`, `nav.langEn`, `home.statHeading`,  
  `footer.*` **only if Agent B chooses “no Footer”**, else keep for Footer wiring,  
  `common.xemTatCa`, `common.nguon`, `common.capNhat`
- Delete `components/ui/input-group.tsx` if still unimported; prove with grep + `pnpm build` / tsc
- Wire `nav.langVi`/`langEn` **only if** keeping keys by connecting `locale-switcher` (prefer delete for clean score)

#### Agent B — Footer decision (must pick ONE)
**Option F1 (prefer for D/08 lift):** Minimal site Footer — brand line + disclaimer + optional copyright; use/adapt `footer.*` keys; locale-reactive on home at least.  
**Option F2:** No footer — delete footer keys; document “internal hub, no footer” in `docs/` one-liner.  
Do not leave orphan footer strings.

#### Agent C — Docs / SEO honesty + deploy checklist
- `app/sitemap.ts` + `app/robots.ts` **or** ADR/docs note: intentional noindex for internal hub (pick one; default: **add sitemap+robots allowing index of public demo** if site is already public on Vercel — match buyer reality).
- `/lab`: add `noindex` metadata and/or small “internal lab” banner — audit P2#12.
- Write **deploy checklist** in smoke report (commands + confirm prod lacks Transparency); **do not push** unless human asks.
- Fix any remaining living-doc drift found during work.

### WAVE 2 — Design score lift (Agents D–F)

#### Agent D — Typography (02 → target ≥9)
- Introduce one display font via `next/font` for H1 + major section headings (home + key routes).
- Do not restyle entire type scale; preserve rhythm.
- MCP/screenshots: home hero desktop + dark.

#### Agent E — `/phap-ly` hierarchy (04 → target ≥8.5)
- Reduce “pure dense table” feel: section intro, grouping, spacing, optional summary strip — **no fake charts**.
- Mobile 375 must not regress (no horizontal bleed).
- Screenshot before/after in assets.

#### Agent F — Imagery LCP + motion sanity
- Hero above-fold `loading="eager"` / priority where Next Image applies (audit P2#9).
- Confirm `MotionConfig reducedMotion="user"` still present; no new motion noise.

### WAVE 3 — Polish + gate (Agents G–H)

#### Agent G — Housekeeping
- Move historical `scripts/indep-*-review.mjs` (+ keep `indep-maturity-audit.mjs` usable **or** document canonical path) into `scripts/archive/` with short README — audit P2#8.
- e2e: adjust only if selectors/copy changed; suite must stay green.

#### Agent H — Re-score + smoke report
- Re-run maturity capture; new PNGs `reports/assets/score-lift-*.png`
- Write `reports/2026-07-23-v0-score-lift-clean-smoke.md`:
  - Pillar A/B/C/D + total vs baseline 85
  - 01–08 re-table (brief)
  - Orphan remaining = 0 (or listed debt)
  - AC table
  - Explicit OUT still deferred (EN full, unit tests, Enterprise, PDF Function)

**Optional (only if total <95 after G):** thin EN expansion on 1–2 more home sections — not full site.

---

## 4. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | 11 orphan i18n keys resolved (deleted or wired); `input-group.tsx` gone or justified |
| AC2 | Footer: F1 built **or** F2 deleted+documented — no orphan footer keys |
| AC3 | Display font live on H1/section titles; evidence screenshot |
| AC4 | `/phap-ly` visual hierarchy improved; mobile OK; evidence screenshot |
| AC5 | sitemap+robots **or** documented noindex policy; `/lab` hygiene done |
| AC6 | Hero LCP eager/priority applied where applicable |
| AC7 | `pnpm exec playwright test -c e2e/playwright.config.ts` green; tsc/build green |
| AC8 | Re-score report: total **≥95**, aspire **100**; formula shown; baseline 85 cited |
| AC9 | No map/PDF/locale regressions; no commit/push unless asked |
| AC10 | Historical reports untouched; scripts archived cleanly if moved |

**Scorecard:** PASS if AC1–AC10 met. CONDITIONAL only for production deploy pending human push.

---

## 5. Deliverables

```text
Code/docs fixes per Waves 1–3
v0/reports/2026-07-23-v0-score-lift-clean-smoke.md
v0/reports/assets/score-lift-*.png
optional: scripts/archive/ + README
```

---

## 6. Done when

PM opens smoke report and sees: orphans gone, design gaps (Inter-only, /phap-ly thô, no footer/SEO silence) closed, Track A scoreboard **≥95 (aim 100)**, e2e green — without Enterprise scope creep.

---

## 7. Anti-patterns

- Re-running full audit without fixing
- Raising “backend” score by inventing APIs
- Purple/cream AI-default rebrand
- Deleting `reports/` history
- Full EN or unit-test platform as blocker for AC8
- Pushing to GitHub/Vercel without human OK (identity rules still apply when push is requested)
