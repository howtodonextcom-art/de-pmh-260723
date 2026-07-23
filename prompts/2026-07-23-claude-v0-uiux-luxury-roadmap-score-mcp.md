# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v0 — UI/UX LUXURY UPGRADE ROADMAP + checklist_score (browser-first)
# Reference pattern (NOT merge product): personal-data-cloud-vault package.json
#   scripts: luxury:capture | luxury:diff | luxury:score | luxury:qa | luxury:qa:auto
#   tools path (if present): ../tools/260528-codex/{capture_reference,screenshot_diff,checklist_score,luxury_qa_auto}.mjs
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: AUDIT-FIRST (MCP/browser) + SCORECARD + ROADMAP — NO full visual rebrand wave
# Parents (form):
#   prompts/2026-07-22-claude-v0-full-maturity-audit-8ux-mcp.md
#   prompts/2026-07-23-claude-v0-indep-r3-absolute-200-mcp.md
# Frozen: MapLibre Wave-2 · PDF honesty · teal brand · Fraunces display · --radius 0.5rem
#   Absolute context: ~119/200 (S5 Design stretch is the primary lift target of THIS wave’s roadmap)
# Sub-agents: **6** · Max repair loops: 0 for product (roadmap-only). Optional: adapt score scripts only.
# Target: Browser-verified baseline + detailed checklist_score + phased UI/UX upgrade roadmap

---

## 0. How to use

1. **Browser FIRST** on `http://localhost:3000` (webpack `pnpm dev`). MCP Playwright preferred; fallback Playwright scripts.
2. Also spot-check prod `https://de-division-pmh.vercel.app` — note lag (do not score local polish as shipped).
3. Read reference `luxury:*` tooling IF discoverable on disk (search `260528-codex`, `checklist_score.mjs`, cloud-vault repo). If missing: **reconstruct** a v0-native checklist_score schema inspired by those script names (capture → diff vs baseline → numeric score) — do not block.
4. Do **not** port Algolia/Firebase/Motion-vs-framer swap wholesale. v0 keeps current stack; roadmap may *suggest* library choices with effort.
5. No commit/push unless human asks.
6. Deliver roadmap + scores; **do not implement** large UI redesign in this wave (except optional tiny score-script scaffolding under `v0/scripts/luxury/`).

Scope lock:
```text
WRITE: v0/reports/2026-07-23-v0-uiux-luxury-roadmap.md
       v0/reports/assets/luxury-baseline-*.png
       v0/reports/assets/luxury-checklist-score.json (detailed)
       optional: v0/scripts/luxury/{capture,diff,score}.mjs + package.json script hooks
READ:  v0 app/components; prior indep §11; reference tools IF found
NO:    Firebase/Algolia into v0, MapLibre rebuild, purple/cream AI rebrand, Enterprise scope
NO:    Claiming Absolute 200 after roadmap alone
```

---

## 1. Orchestrator + scoring model

You are the **DED-PMH v0 UI/UX Luxury Roadmap Orchestrator**.

### 1.1 checklist_score (DETAILED — mandatory artifact)

Produce `luxury-checklist-score.json` + mirrored tables in the markdown report.

**Dimension A — Design 01–08** (each 0–10, evidence path required):
01 POV · 02 Typography · 03 Color · 04 Hierarchy · 05 Imagery · 06 Motion · 07 Mobile · 08 Invisible  

Sub-bullets per item (min 3 criteria), e.g. Typography: display vs body · scale rhythm · VN glyph coverage · weight hierarchy.

**Dimension B — Effects / presence** (each 0–10):
B1 Hero presence (brand-first, motion intentional)  
B2 Scroll reveal quality (stagger vs noise; reduced-motion)  
B3 Micro-interactions (hover/focus/press)  
B4 Page transitions / continuity  
B5 Map section craft (halo/pins/CTA hierarchy — no MapLibre rewrite)  
B6 Empty/loading/error luxury (not raw)  

**Dimension C — “Luxury gap vs vault pattern”** (each 0–10, qualitative vs reference package.json intent):
C1 Capture/regression tooling readiness  
C2 Diff-against-baseline discipline  
C3 Score automation repeatability  
C4 Visual density / whitespace craft  
C5 Depth (atmosphere without purple-glow cliché)  

**Aggregates:**
```text
Design01_08 = avg(01..08)           # /10
Effects     = avg(B1..B6)           # /10
ToolingGap  = avg(C1..C5)           # /10
LuxuryIndex = round( (Design*0.45 + Effects*0.35 + Tooling*0.20) * 10 )  # /100
```

Also map to Absolute Stretch **S5** estimate: if roadmap fully executed (not this wave), projected S5 /15.

### 1.2 Qualitative verdicts (required)
Cân đối vs thô · màu · sang trọng vs template · bo tròn (confirm 0.5rem) · hiệu ứng đủ/thiếu/ồn.

---

## 2. Non-negotiables

1. Browser evidence before scores (screenshot paths).
2. Keep teal + Fraunces + existing radius; no Inter-only regression; no cream-serif / purple gradient defaults.
3. Roadmap phased: P0 quick wins · P1 craft · P2 tooling (luxury:qa) · P3 out-of-scope (Algolia etc.).
4. Each roadmap item: problem · evidence · fix type · effort S/M/L · expected checklist_score delta.
5. Honest: local vs prod lag.
6. Vietnamese PM-readable report.

---

## 3. Sub-agents (6)

### Agent A — Browser baseline (FIRST)
Routes: `/` `/du-an` `/du-an/hong-hac-city` `/so-sanh` `/phap-ly` (+ `/lab` note only).  
Viewports 1440×900 + 375×812 (`/`, `/phap-ly`, `/so-sanh`) + dark `/`.  
Capture `luxury-baseline-*.png`. Log console (ignore known dev-load flake).

### Agent B — Reference tooling recon
Locate `checklist_score.mjs` / cloud-vault; summarize scoring categories. If absent, document reconstructed schema.

### Agent C — checklist_score detailed
Fill all A/B/C criteria with evidence; emit JSON + markdown tables; compute LuxuryIndex /100.

### Agent D — Motion/effects audit
Framer usage, MotionConfig, hero ken-burns, whileInView, map scrollZoom; compare to “luxury presence” bar (2–3 intentional motions, not noise).

### Agent E — Upgrade roadmap
Phased backlog max 15 items. Must include: atmosphere/depth, micro-interactions, `/phap-ly` residual, imagery LCP, optional lab Fraunces, **port luxury:qa scripts into v0** as P2. Exclude Enterprise/Algolia unless “later packaging”.

### Agent F — Merge report
Write `reports/2026-07-23-v0-uiux-luxury-roadmap.md` + optional `scripts/luxury/*` stubs that can run capture/score against localhost.

---

## 4. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | Browser baseline PNGs for required routes/viewports |
| AC2 | `luxury-checklist-score.json` with A/B/C detailed criteria + LuxuryIndex /100 |
| AC3 | Markdown report with 01–08, Effects, Tooling, qualitative verdicts |
| AC4 | Phased roadmap P0–P3 with effort + expected score deltas |
| AC5 | Reference vault pattern cited; no Firebase/Algolia merge |
| AC6 | Map/PDF/locale non-regression called out as constraints |
| AC7 | No large product redesign; no commit/push unless asked |
| AC8 | Links Absolute S5 projection if roadmap executed |

---

## 5. Deliverables

```text
v0/reports/2026-07-23-v0-uiux-luxury-roadmap.md
v0/reports/assets/luxury-baseline-*.png
v0/reports/assets/luxury-checklist-score.json
optional: v0/scripts/luxury/*.mjs + package.json luxury:* scripts
```

---

## 6. Done when

PM can read LuxuryIndex, see exact gaps vs “vault-style luxury QA”, and follow a phased UI/UX upgrade path without another exploratory pass.

---

## 7. Anti-patterns

- Scoring from CSS only
- Porting Cloud Vault stack into v0
- Purple/glow/cream rebrand
- Promising Absolute 200 from UI polish alone
- Implementing full redesign “while documenting”
