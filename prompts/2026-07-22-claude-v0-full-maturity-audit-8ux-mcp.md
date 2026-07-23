# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v2 — v0 Track A FULL MATURITY + UI/UX 01–08 AUDIT (score /100)
# Packages: Feature completeness · Frontend · Backend honesty · UI/UX Design 8-checklist · Orphan/dead-code hunt · Browser-first evidence · Ranked backlog (NO auto-redesign)
# Primary workspace: Z:\Coding\260719-DE\v0
# Surface: **v0/ ONLY** (reports under v0/reports/; optional notes in v0/docs/)
# Mode: AUDIT-FIRST (BROWSER → CODEBASE) + REPORT + SCORECARD — **no feature build / no visual rebrand**
# Structural parents (form ONLY):
#   v0/prompts/2026-07-21-claude-v0-sellability-70-roadmap-mcp.md
#   v0/prompts/2026-07-21-claude-v0-remaining-100-closure-mcp.md
# Frozen baselines (READ — do not re-litigate DoD claims; VERIFY against live UI):
#   docs/WHAT_YOU_BUY.md · DEMO_SCRIPT_15MIN.md · I18N_EN.md · PDF_EXPORT.md · ADR-001
#   reports/2026-07-21-v0-r10-uiux-audit.md  ← STALE in places (Transparency/#minh-bach REMOVED 2026-07-22)
#   prompts/2026-07-22-claude-v0-remove-transparency-minh-bach.md
# Max repair loops: 0 for product code (audit-only). Max 1 loop only if evidence scripts fail.
# Sub-agents: **7** (all must run; Orchestrator merges)
# Target: One honest maturity score /100 + full 01–08 checklist + orphan inventory + prioritized upgrade backlog

---

## 0. How to use

You are Claude Code / Cursor Agent. You MUST:

1. **Browser / live surface FIRST** — do not score UI from code alone.
2. Spawn **all 7** agents with exclusive ownership; Orchestrator merges contradictions (browser evidence wins over stale reports).
3. Prefer `pnpm dev` (webpack) on Windows if Turbopack hangs; base URL `http://localhost:3000`. Also spot-check production `https://de-division-pmh.vercel.app` if reachable (mark CONDITIONAL if down).
4. Evidence tools (use whatever is available; do not invent MCP that is missing):
   - Cursor/Playwright MCP browser if present
   - Else: Playwright (`pnpm exec playwright test` or a one-off `scripts/indep-maturity-audit.mjs` using `@playwright/test`) for viewport screenshots + a11y-ish snapshots
   - Console: zero/ unexplained errors must be logged
5. Then deep codebase pass: `app/`, `components/`, `lib/`, `e2e/`, `vendor/`, `public/`, `docs/`, `scripts/`, `reports/` — hunt orphans, dead imports, stale docs claiming removed UI.
6. Do **not** commit/push unless human asks.
7. Stop at §4 AC + scorecard + deliverable report path.

**Scope lock:**
```text
WRITE: v0/reports/2026-07-22-v0-full-maturity-audit.md
       v0/reports/assets/maturity-audit-*.png (and optional findings.json)
       v0/scripts/indep-maturity-audit.mjs  (ONLY if needed to capture evidence reproducibly)
READ:  entire v0/ tree; prior reports/prompts/docs (treat Transparency section claims as obsolete)
NO:    redesign, new fonts, new color theme, new sections, MapLibre rebuild
NO:    deleting “orphan” files in this wave (inventory only; propose deletes in backlog)
NO:    src/ Local app, Firebase deploy, sa-ban lot inventory, inventing backend that does not exist
NO:    updating WHAT_YOU_BUY home bullet about Transparency unless Orchestrator adds a one-line “doc drift” note in the audit report (fix docs is OUT of this wave unless human asks a follow-up)
```

---

## 1. Orchestrator identity + scoring model

You are the **DED-PMH v0 Full Maturity Auditor**.

### 1.1 What “100” means (honest ceiling)

```text
100 = Track A demo package as defined in WHAT_YOU_BUY + remaining-100 DoD
      (6 routes, MapLibre home, compare, legal, gallery, CMDK, e2e, docs honesty)
      — NOT infinite Enterprise (RBAC/AI/Algolia), NOT full EN site, NOT live PDF Function,
        NOT sa-ban L2 embedded inventory.
```

Score **four pillars** (weights sum 100), then map to /100:

| Pillar | Weight | What “full marks” means |
|--------|--------|-------------------------|
| A. Feature completeness (Track A DoD) | 30 | Routes + map Wave-2 + compare/legal/gallery/CMDK/i18n switcher (CONDITIONAL EN ok) + PDF honesty + docs/ADR present |
| B. Frontend engineering | 25 | App Router quality, types, i18n wiring, e2e coverage, no critical console errors, map lazy/WebGL fallback |
| C. Backend / data / ops honesty | 15 | Seed/vendor data path clear; no fake APIs; PDF/env gates honest; deploy story accurate; **missing real BFF/auth is not a fail if documented as OUT** |
| D. UI/UX Design (01–08 average) | 30 | See §1.2; each item scored 0–10, average × 3.0 |

**Sub-scores required** inside the report (do not only give one number).

### 1.2 Design checklist 01–08 (each 0–10)

Score each with evidence (screenshot path + route + viewport). Vietnamese labels OK in report.

| # | Item | Rubric focus (must address explicitly) |
|---|------|----------------------------------------|
| 01 | Point of view | Brand-first first viewport? Internal hub vs marketing? After removing Transparency/#minh-bach, does POV still hold? |
| 02 | Typography | Expressive vs default **Inter**; scale/weight hierarchy; orphan headings |
| 03 | Color | Teal brand tokens; contrast light/dark; “ugly / muddy / generic shadcn?”; status label palette |
| 04 | Hierarchy | One job per section; CTA competition; card clutter; sidebar/header balance |
| 05 | Imagery | Real project photos vs abstract; LCP/eager above-fold; empty/broken images; aspect consistency |
| 06 | Motion | Intentional 2–3 motions vs noise; `MotionConfig` / reduced-motion; map scrollZoom honesty |
| 07 | Mobile | 375×812: header, map 100dvh, compare accordion, gallery, no horizontal bleed |
| 08 | Invisible expensive stuff | Focus rings, a11y labels, empty states, loading, print/PDF honesty, SEO metadata, favicon, dead `#` anchors |

**Mandatory qualitative verdicts** (Orchestrator section, not optional):

1. UI có **cân đối** hay **thô / lệch nhịp**?
2. Màu sắc: **ổn / xấu / cần nâng cấp** (nêu 1–3 ví dụ cụ thể)?
3. Cảm giác **sang trọng** hay **template/shadcn mặc định**?
4. Có **lạm dụng bo tròn** (`rounded-*`, `--radius`, pills) không? Đếm/ước lượng pattern + verdict.

### 1.3 Routes to visit (minimum)

```text
/  /du-an  /du-an/hong-hac-city  /so-sanh  /phap-ly  /lab
Viewports: 1440×900 desktop · 375×812 mobile · at least one dark-mode pass on /
```

---

## 2. Non-negotiables

1. **Browser evidence before score.** If live browse fails, mark UI pillar CONDITIONAL and explain — do not invent scores.
2. Prior R10 audit claiming Transparency cards / `#minh-bach` is **obsolete** — re-verify current home composition (`Hero → StatStrip → FeaturedCards → …`).
3. Backend pillar must state clearly: v0 is **Next.js + vendor seed data**, not a custom API/Firebase app in this repo — score honesty, not fantasy backends.
4. Orphan hunt must list **file path + why suspected + safe delete? (Y/N/Needs human)** — no mass deletion.
5. No Mapbox; no claiming sa-ban inventory inside v0.
6. Vietnamese report body preferred for buyer/PM readability; keep AC table bilingual or VI.

---

## 3. Sub-agents (7)

### Agent A — Live browser / visual capture (MUST GO FIRST)
- Ensure dev server up (`pnpm dev`); capture screenshots for every route × (desktop, and mobile for `/` + `/du-an` + `/so-sanh` + one detail).
- Dark mode: `/` hero + header.
- Note console errors/warnings (LCP eager hint counts as note, not auto-fail).
- Confirm **absence** of `#minh-bach` / “Nguyên tắc minh bạch dữ liệu” / Hero secondary transparency CTA.
- Map: canvas visible, HH CTA UTM still present, stage height behavior.
- Output: `reports/assets/maturity-audit-*.png` + short capture log for Orchestrator.

### Agent B — Feature completeness (Pillar A /30)
- Map live routes ↔ WHAT_YOU_BUY / remaining-100 DoD.
- Mark DONE / CONDITIONAL / DEFER / MISSING for: map Wave-2, EN switcher scope, PDF Function gate, R12 ADR, e2e suites, docs drift (Transparency bullet in WHAT_YOU_BUY).
- Output: feature matrix + proposed Pillar A score with rationale.

### Agent C — Frontend engineering (Pillar B /25)
- App Router structure, client/server boundaries, `dynamic(ssr:false)` map, i18n (`locale-context` vs static `t()`), Playwright coverage gaps, TypeScript/lint smell if quick.
- Flaky patterns, dead `"use client"` , duplicate components.
- Output: FE score + top 5 engineering risks.

### Agent D — Backend / data / ops honesty (Pillar C /15)
- Trace data: `vendor/data` → `library-bridge` → pages.
- Env gates (`NEXT_PUBLIC_PDF_FUNCTION_URL`), Analytics, deploy story.
- Explicit “what is NOT a backend here.”
- Output: Pillar C score + one-paragraph honesty statement.

### Agent E — UI/UX 01–08 + radius/luxury critique (Pillar D /30)
- Score each 01–08 with screenshot citations.
- Answer the four qualitative verdicts (§1.2).
- Quantify rounding: sample `rounded-full` / `rounded-2xl` / `--radius` usage; verdict overuse Y/N.
- Flag Inter-as-brand-font vs “expressive type” expectation.
- Output: table 01–08 + Pillar D score.

### Agent F — Orphan / dead / stale hunt (all folders)
Search and classify:
- Unimported components (esp. after Transparency delete)
- Unused i18n keys
- Stale docs/reports claiming removed UI (list only)
- `lib/mock-data.ts` vs library-bridge dual paths
- `/lab` DemoShell relevance
- Empty scripts, duplicate e2e asserts
Output: inventory table (path | type | confidence | recommend).

### Agent G — Scorecard merge + ranked backlog
- Resolve conflicts (browser > code > old reports).
- Compute total /100 with pillar breakdown.
- Backlog: **P0 / P1 / P2** (max 12 items), each: problem, evidence, suggested fix type (design token / copy / code delete / doc), effort S/M/L — **no implementation**.
- Write final markdown report.

---

## 4. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | Browser-first evidence exists for all 6 routes (desktop) + mobile samples; PNGs under `reports/assets/maturity-audit-*` |
| AC2 | Report states Pillar A/B/C/D scores + **total /100** with formula visible |
| AC3 | Full 01–08 table with 0–10 each + evidence refs |
| AC4 | Qualitative verdicts: cân đối/thô · màu · sang trọng · bo tròn (explicit) |
| AC5 | Orphan/stale inventory ≥5 rows OR explicit “none found” with search method |
| AC6 | Ranked backlog P0–P2 (no silent implementation) |
| AC7 | Notes Transparency removal + any WHAT_YOU_BUY drift |
| AC8 | No product code changes; no commit/push unless asked |

**Scorecard:** PASS if AC1–AC8 met. CONDITIONAL allowed only for production URL unreachable or WebGL map soft-fail — must not hide scoring.

---

## 5. Deliverables

```text
v0/reports/2026-07-22-v0-full-maturity-audit.md
v0/reports/assets/maturity-audit-*.png
optional: v0/reports/assets/maturity-audit-findings.json
optional: v0/scripts/indep-maturity-audit.mjs
```

Report outline (required headings):
1. Executive verdict (2–4 sentences + **điểm /100**)
2. Phương pháp (browser tool used, viewports, date)
3. Pillar scores (A–D)
4. Checklist 01–08
5. Qualitative design verdicts (4 câu hỏi)
6. Feature / FE / Backend matrices
7. Orphan & doc-drift inventory
8. Ranked backlog
9. AC table

---

## 6. Done when

A PM can open the report and know: (1) honest maturity /100 vs Track A ceiling, (2) whether UI feels balanced/luxury/rough and if radius is overused, (3) what to fix next in priority order — without another exploratory pass.

---

## 7. Anti-patterns

- Scoring from `globals.css` alone
- Treating Enterprise gaps as Track A failures without labeling OUT
- Re-praising deleted Transparency section as current POV proof
- “Looks fine” without screenshot paths
- Implementing a redesign “while we’re here”
