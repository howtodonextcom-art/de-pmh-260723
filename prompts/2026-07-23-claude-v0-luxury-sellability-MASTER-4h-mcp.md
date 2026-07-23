# CLAUDE CODE MULTI-AGENT MASTER PROMPT
# DED-PMH v0 — LUXURY SELLABILITY MASTER RUN (Section-locked P0–P2 + SHIP)
# Status: MASTER — supersedes draft megarun (that file was never landed) AND
#          upgrades prompts/2026-07-23-claude-v0-uiux-luxury-roadmap-score-mcp.md
#          from ROADMAP-ONLY → FULL IMPLEMENT of remaining sellability UI work
# Backlog + section findings (MUST close — not optional):
#   A) Hero — LCP / eager priority (even if `priority` prop exists, console warn must die)
#   B) VnMap / RegionMapCanvas — replace plain "Đang tải bản đồ…" grey box with shimmer/skeleton
#   C) FeaturedCards / ProjectCard / StatStrip — card lift + shadow motion on hover (not text-only)
#   D) /lab DemoShell H1 — font-display → Fraunces
#   Plus roadmap P0–P2 remainder: atmosphere, unify reveals, phap-ly polish, accent, pixelmatch, qa:auto, golden, deploy
# Evidence parents:
#   reports/2026-07-23-v0-uiux-luxury-roadmap.md (§7)
#   reports/260723-0305-project_valuation_audit.md (§3–§4 gaps only; ignore price hype)
#   Human section audit 2026-07-23: Hero 9/10 (−LCP), Map 8/10 (−loading), Cards (−hover lift)
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: IDEATE → VALIDATE → A/B PROMPT PICK → SEQUENTIAL FEATURE IMPLEMENT → TEST → FIX → SHIP
# Wall-clock: up to **4 hours**
# Human pre-authorization (THIS WAVE):
#   Do NOT pause for aesthetic OK, commit OK, or push OK.
#   BEFORE push: git config user.email MUST be howtodonext.com@gmail.com (set --local if needed; never --global).
#   If gh/credential is wrong account: finish local+report; document BLOCKED push; do not force wrong identity.
# Sub-agents: **7** minimum (all must run)
# Max repair loops / feature: 3
# Targets: LuxuryIndex ≥85 (prefer ≥88) · e2e green · prod parity after push
# Frozen: MapLibre Wave-2 ACs · PDF honesty · teal · Fraunces · --radius 0.5rem ·
#         NO purple/cream/glow rebrand · NO Firebase/Algolia/Enterprise · NO Mapbox rewrite

---

## 0. Coverage answer (read first)

| Human finding | Covered in MASTER? | Feature ID |
|---------------|--------------------|------------|
| Hero Ken Burns OK; LCP eager/priority warn | **YES — mandatory** | F1 |
| Map loading = grey + "Đang tải bản đồ…" thô | **YES — mandatory** | F7 (map-first) |
| FeaturedCards hover thiếu lift/shadow | **YES — mandatory** | F3 |
| /lab Inter H1 | **YES — mandatory** | F2 |
| Atmosphere / reveals / phap-ly / accent / tooling / deploy | YES — F5–F13 | |

Prior megarun draft named F1/F3/F7 but lacked **section-locked DoD + file paths + acceptance screenshots**. This MASTER binds DoD to concrete components.

---

## 1. How to use

You are the **DED-PMH v0 Luxury Sellability MASTER Orchestrator**.

1. Execute Phase 0→6 in order; features **sequential** (F1→F13).
2. Spawn all 7 agents; no conflicting parallel writes on same file.
3. `pnpm dev` webpack `:3000`. MCP browser preferred; else Playwright / `pnpm luxury:qa`.
4. No mid-run human questions.
5. Stop at smoke report + prod verify.

Scope:
```text
WRITE: app/**, components/** (esp. home/hero, vn-map, region-map-canvas, featured-cards,
       project/project-card, demo-shell, shared skeletons), lib/motion/**, app/globals.css,
       scripts/luxury/**, package.json (pixelmatch/pngjs + scripts only), e2e if needed,
       reports/2026-07-23-v0-luxury-master-smoke.md, reports/assets/luxury-post-*, luxury-golden/**
READ:  luxury roadmap, valuation gaps, indep §11
NO:    P3 Enterprise/Algolia/Firebase/full EN/PDF Function/Mapbox
NO:    force-push; --global git config
```

---

## 2. Pipeline

```text
Phase 0 IDEATE     — Variant A (minimal: F1–F4+F7 only+) vs Variant B (A + atmosphere/accent/phap-ly)
Phase 1 VALIDATE   — Browser confirm: LCP warn still? map loading text? card hover? lab font?
Phase 2 A/B PICK   — Rubric: sellability 40% · regression 30% · demo impact 20% · time 10%
                     Tie → Variant B if ≥2h left else A. Log in smoke (no human ask).
Phase 3 IMPLEMENT  — F1…F12 sequential; F7 MUST ship map shimmer before optional catalog shimmer
Phase 4 GATE       — tsc · build · e2e full · luxury:qa · MCP screenshots section trio
Phase 5 SHIP       — commit + push (identity) · prod check
Phase 6 CLOSE      — master smoke report + LuxuryIndex before/after
```

---

## 3. Section-locked DoD (NON-NEGOTIABLE)

### F1 — Hero LCP (components/home/hero.tsx ± project-card first image)
**Problem:** Next may still warn LCP despite `priority` (nested motion, wrong LCP candidate, or missing `fetchPriority`).
**DoD:**
- [ ] Cold load `/` : no console LCP “add loading=eager / priority” for the hero (or documented true LCP element fixed).
- [ ] Keep Ken Burns; `useReducedMotion` / MotionConfig respected.
- [ ] Evidence: MCP/script screenshot + console log snippet in smoke.

### F3 — Card lift (components/project/project-card.tsx + featured-cards / explorer-preview)
**Problem:** Hover ≈ text color only; need lift + shadow craft.
**DoD:**
- [ ] `group-hover:-translate-y-1` (or equiv) + shadow transition; duration ~200–300ms.
- [ ] Reduced-motion: no translate (CSS `motion-safe:` / `motion-reduce:transform-none`).
- [ ] Radius unchanged (rounded-2xl OK if already; don’t bump --radius).
- [ ] Evidence: before/after or hover screenshot note.

### F7 — Map loading shimmer (components/home/vn-map.tsx + region-map-canvas.tsx)
**Problem:** Grey void + `t("home.mapLoading")` only.
**DoD:**
- [ ] While map not ready: skeleton/shimmer panel (teal-tinted pulse OK), not empty muted box + text alone.
- [ ] Text may remain as sr-only or secondary caption.
- [ ] No change to MapLibre init, scrollZoom, pins, HH CTA UTM.
- [ ] Evidence: screenshot of loading state OR forced delay capture in script.

### F2 — /lab Fraunces
**DoD:** DemoShell H1 `font-display`; computed fontFamily includes `Fraunces`.

---

## 4. Remaining sequential features

| ID | Feature | DoD (short) |
|----|---------|-------------|
| F4 | Golden lock | baselines → `luxury-golden/` |
| F5 | Atmosphere | Soft teal wash home; no purple; dark OK |
| F6 | Unify reveals | Home sections → presets revealUp/stagger + reduced |
| F8 | /phap-ly polish | Jump bar clarity + table density; mobile OK |
| F9 | Secondary accent | Restrained accent for meta/badges; primary teal kept |
| F10 | pixelmatch diff | Real pixel report in luxury/diff.mjs |
| F11 | luxury:qa:auto | Fail if LuxuryIndex < 85 |
| F12 | Capture expand | dark phap-ly + detail mobile |
| F13 | Deploy | commit+push; prod: Fraunces, footer, no Transparency, robots 200 |

---

## 5. Sub-agents (7)

**A — Ideate / Validate / A/B** — confirm section gaps live; pick A vs B; write lock list F1/F3/F7/F2 first.  
**B — Section fixer P0** — exclusive F1, F2, F3, F7 (map shimmer), F4.  
**C — Visual P1** — F5, F8, F9.  
**D — Motion P1** — F6 (+ help F3 motion if needed).  
**E — Tooling P2** — F10–F12.  
**F — QA** — tsc/build/e2e/luxury:qa; verify section DoD checklist; ≤3 fix loops.  
**G — Ship** — commit/push identity gate; prod verify; `reports/2026-07-23-v0-luxury-master-smoke.md`.

---

## 6. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC-S1 | F1 Hero LCP warn resolved (evidence) |
| AC-S2 | F7 Map shimmer live (evidence) |
| AC-S3 | F3 Card lift+shadow on Featured/Project cards (evidence) |
| AC-S4 | F2 /lab Fraunces (computed style) |
| AC1 | A/B winner logged |
| AC2 | F4–F12 done or ≤2 CONDITIONAL residuals listed |
| AC3 | LuxuryIndex ≥85 local |
| AC4 | tsc 0 · build green · e2e full green |
| AC5 | Map Wave-2 / PDF / locale not regressed |
| AC6 | No purple/cream; radius ~0.5rem; teal primary |
| AC7 | Commit + push attempted; identity documented |
| AC8 | Prod PASS or auth-BLOCKED only |
| AC9 | Master smoke report with section trio evidence |
| AC10 | P3 untouched |

**PASS** iff AC-S1…S4 + AC3–AC6 + AC9–AC10 + (AC7–AC8 PASS|auth-BLOCK).  
**FAIL** if any of F1/F3/F7/F2 incomplete or LuxuryIndex <85 or e2e red after loops.

---

## 7. Deliverables

```text
Code for section-locked + P0–P2 features
reports/2026-07-23-v0-luxury-master-smoke.md
reports/assets/luxury-post-hero.png
reports/assets/luxury-post-map-loading.png  (or documented capture method)
reports/assets/luxury-post-cards.png
reports/assets/luxury-checklist-score.json (re-scored)
git commit + push (identity-gated)
```

---

## 8. Done when

Buyer demo on local (and prod if push OK) shows: Hero without LCP shame, map loading feels premium, cards respond with lift, lab matches Fraunces — plus P1/P2 craft — LuxuryIndex ≥85 — maximized Track A sellability without Enterprise creep.

---

## 9. Anti-patterns

- Declaring F1 done because `priority` already in source while console still warns
- Map loading = only restyle text color
- Card hover = only `hover:text-primary`
- Asking human mid-run
- Porting vault Firebase/Algolia
- force-push / wrong git email push
