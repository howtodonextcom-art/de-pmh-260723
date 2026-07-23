## 0. How to use

You are Claude Code (or Cursor Agent with equivalent sub-agents) in this monorepo. You MUST:

1. Read locked sources in §2.
2. Treat **§4 live defects** as ground truth — do not mark fixed from reading code alone.
3. Spawn **all five** agents in §7 with exclusive file ownership; Orchestrator merges.
4. **Hard requirement:** every wave ends with **MCP browser evidence** (Playwright MCP / project `playwright` MCP). Screenshots + dialog/menu counts + console filter. **Code inspection ≠ PASS.**
5. If MCP browser unavailable: repair install (`@playwright/mcp`, Chromium / chrome-for-testing), retry. Still blocked → `BLOCKED_TRUTH` + AC **FAIL** — never invent PASS.
6. Stop only at §9 AC table + evidence index. Both features must be **100%** (all ACs PASS).

**Scope lock (CRITICAL):**
- Edit **only under `v0/`** (+ `reports/` evidence). Do **not** change `src/` Local production shell in this prompt.
- Parent `src/` / `@library` may be **read** for patterns; do not port fixes into Local here.

Do not return only a plan.
Do not expand into home H1–H10, admin, PDF Cloud Function, i18n, or Track B.
Do not commit/push unless the human explicitly asks in-session.

---

## 1. Orchestrator identity

You are the **DED-PMH v0 Interaction Surgeon**.

Mission: Bring these two items from broken/unproven → **100% MCP-verified** on `http://127.0.0.1:3000` (or the live v0 port):

```text
ITEM A — Gallery lightbox (SPEC §3.4 D9)
  FAIL today: click “Mở ảnh: …” → [role=dialog] count = 0
  DONE: open + next + prev + Esc/close; body scroll-lock; screenshot trail

ITEM B — Nav “Dự án” dropdown (SPEC §3.1)
  FAIL today: chevron exists; hover/click does not yield 4× project links with 96×64 thumbs
  DONE: desktop popup opens (hover and/or click); 4 items; thumb box h-16 w-24 (96×64);
        “Xem tất cả → /du-an”; optional @375 mobile menu still lists projects (no regression)
```

Architecture (LOCKED for this prompt):
```text
v0/     = ONLY write surface
src/    = library / Local — READ ONLY
reports/= MCP evidence only
```

**100% definition:** AC1–AC8 all PASS with MCP proof. No CONDITIONAL allowed on Item A or Item B.

---

## 2. Source documents (read first)

```text
SPEC_DED_PMH_V2.md                 # §3.1 nav dropdown · §3.4 D9 Gallery lightbox
prompts/2026-07-20-01-52-claude-v0-lightbox-dropdown-100-mcp.md   # this file
prompts/2026-07-20-00-06-claude-final-mile-85-to-99-mcp.md        # process sibling

# Hotspots (v0 only)
v0/components/project/detail/gallery.tsx      # GalleryTile + Lightbox + DetailGallery
v0/components/shared/project-nav-dropdown.tsx # Base UI Menu, openOnHover, LinkItem
v0/components/shared/site-header.tsx
v0/components/shared/mobile-nav.tsx           # regression only @375
v0/app/du-an/[slug]/page.tsx                 # hosts DetailGallery
```

Learn multi-agent form from structural parents — do not copy FTMO product rules.

---

## 3. Canonical locks

- Four projects: `hong-hac-city`, `the-regency`, `the-sculptura`, `harmonie`
- Thumb size: **exactly** `h-16 w-24` (96×64 CSS px)
- Lightbox: `role="dialog"`, `aria-modal="true"`, keyboard ←/→/Esc
- Teal/quiet header language — no purple SaaS chrome
- Keep masonry thumbs (no return to `aspect-square`)

Runtime:
```text
v0: http://127.0.0.1:3000   # confirm port; record if different
```

---

## 4. Baseline defects (independent MCP audit 2026-07-20)

| ID | Finding | Target |
|----|---------|--------|
| L1 | Gallery click → `lightboxDialog: 0` | Must become ≥1 with aria “Xem ảnh lớn” (or equivalent) |
| L2 | Dropdown → `dropdownLinks: []` after hover+click | Must list 4 `/du-an/{slug}` (+ optional “Xem tất cả”) |
| OK | Compare @375 Accordion works | Do not regress |
| OK | Library data, no mock banner | Do not regress |

**Investigate (do not assume single cause):**
- Lightbox: `motion.button` + React 19 click; `TabsContent` remount; `AnimatePresence` conditional; wrong index into `visible`; overlay/`pointer-events`; state set but Lightbox returns null.
- Dropdown: Base UI `Menu` + `openOnHover` + portal; `LinkItem`/`render={<Link/>}`; z-index under sticky header; empty `projects` / `thumbBySlug`; click steals focus to CMDK.

---

## 5. Non-negotiables

1. MCP interaction proof for every AC marked interaction.
2. One file-set owner per agent.
3. Max 3 repair loops per wave.
4. Product console errors on detail after fix = FAIL (exclude HMR/favicon only).
5. `pnpm --dir v0 build` must stay green.

---

## 6. Precedence

1. This prompt  
2. SPEC §3.1 + §3.4 D9  
3. Final-mile sibling (process)  
4. Existing v0 components  

---

## 7. Multi-agent topology (5 agents)

### AGENT-00 MCP Baseline Steward
**MISSION:** W0 — prove MCP works; capture **before** screenshots proving L1/L2 FAIL.  
**OWN:** `reports/assets/v0-p0-w0-*`, `reports/YYYY-MM-DD-v0-lightbox-dropdown-w0.md` only.  
**MUST NOT EDIT** product code.  
**MCP MUST:**
- `/du-an/hong-hac-city` → `#gallery` → click first “Mở ảnh” → record dialog count + screenshot  
- `/du-an` or `/so-sanh` @1440 → hover/click “Dự án” → record menu links + screenshot  
**DONE-WHEN:** W0 doc shows FAIL for L1 and L2 (baseline).

### AGENT-01 Lightbox Surgeon
**MISSION:** Fix gallery lightbox end-to-end in v0.  
**OWN:** `v0/components/project/detail/gallery.tsx` only (split file only if Orchestrator approves).  
**MUST NOT EDIT:** nav dropdown, site-header.  
**DONE-WHEN:** MCP: open → ArrowRight → ArrowLeft → Esc (or close btn) → dialog gone.  
**P0 FAIL:** dialog still 0 after click.

### AGENT-02 Nav Dropdown Surgeon
**MISSION:** Desktop dropdown opens with 4 projects × 96×64 thumbs + labels + badge + “Xem tất cả”.  
**OWN:** `v0/components/shared/project-nav-dropdown.tsx`, `v0/components/shared/site-header.tsx` (wiring only).  
**MUST NOT EDIT:** gallery.tsx.  
**DONE-WHEN:** MCP screenshot shows popup; evaluate finds 4 hrefs `/du-an/...` and thumb boxes ~96×64.  
**P0 FAIL:** popup still empty / not visible.

### AGENT-03 Mobile Nav Regression
**MISSION:** @375 ensure hamburger/Sheet still opens and lists projects or key routes; no desktop-only breakage.  
**OWN:** `v0/components/shared/mobile-nav.tsx` (+ header mobile trigger only if needed).  
**MUST NOT EDIT:** gallery.  
**MCP MUST:** screenshot open mobile menu @375.

### AGENT-04 Final MCP Proof & Verdict
**MISSION:** Re-run full matrix; write smoke report; declare 100% or FAIL.  
**OWN:** `reports/YYYY-MM-DD-v0-lightbox-dropdown-100-smoke.md`, `reports/assets/v0-p0-final-*`.  
**MUST NOT EDIT** product code unless ≤3 repair loops assigned.  
**DONE-WHEN:** AC1–AC8 all PASS with paths listed.

### Sub-agent return format (mandatory)

```text
AGENT
MISSION
FILES READ
FINDINGS
DECISIONS
FILES CHANGED
MCP STEPS (url, viewport, actions, screenshot paths)
COMMANDS RUN
RESULTS
BLOCKED TRUTHS
HANDOFF
STATUS: PASS | FAIL
```

(No CONDITIONAL on Item A/B — either PASS with MCP or FAIL.)

---

## 8. Build waves

```text
WAVE W0 — AGENT-00 baseline MCP (BLOCKING)
WAVE A  — AGENT-01 Lightbox fix → MCP proof
WAVE B  — AGENT-02 Dropdown fix → MCP proof   (parallel with A — different files)
WAVE C  — AGENT-03 Mobile regression MCP
WAVE V  — AGENT-04 Final matrix → 100% verdict
```

Merge: Orchestrator only; no concurrent edits to same file.

---

## 9. Acceptance criteria (all required for 100%)

### Item A — Lightbox
- [ ] AC1 Click first gallery “Mở ảnh: …” opens `[role=dialog]` (count ≥ 1) — MCP screenshot
- [ ] AC2 ArrowRight / next control changes visible image — MCP
- [ ] AC3 ArrowLeft / prev works — MCP
- [ ] AC4 Esc or close control dismisses dialog (count → 0) — MCP
- [ ] AC5 After fix: 0 product console errors on detail (HMR/favicon excluded)

### Item B — Dropdown
- [ ] AC6 @1440: trigger “Dự án” opens popup with **4** project links — MCP screenshot
- [ ] AC7 Each item has thumb container **96×64** (`h-16 w-24` measured ≈96×64) + name + region + status — MCP evaluate or measure
- [ ] AC8 “Xem tất cả” (or equivalent) links to `/du-an` — MCP

### Cross
- [ ] AC9 `pnpm --dir v0 build` succeeds
- [ ] AC10 Smoke report written under `reports/` with before/after screenshot index

**Forbidden:** PASS on AC1–AC8 without MCP interaction evidence.  
**Forbidden:** Editing `src/` to claim v0 fixed.

---

## 10. Evidence protocol

Final reply must include:

```text
VERDICT: V0_LIGHTBOX_DROPDOWN_100_MET | NOT_MET
AC1..AC10: PASS|FAIL
MCP_EVIDENCE_INDEX: [...]
FILES_CHANGED: [...]
ROOT_CAUSE_LIGHTBOX: one paragraph
ROOT_CAUSE_DROPDOWN: one paragraph
```

---

## 11. Out of scope

- Local `src/` gallery/header ports
- Home DemoShell → SPEC H1–H10
- Admin / passcode / PDF Cloud Function
- Track B / OAuth / `/en`
- Compare redesign (regression-only)

---

## 12. Start command

1. Ensure Playwright MCP ready.  
2. Run WAVE W0 now.  
3. A∥B → C → V.  
4. Return agent STATUS blocks + verdict.

Allowed success line only if all ACs PASS:  
`v0 lightbox + dropdown 100% — MCP verified.`
```
