# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH — HEADER THEME + LOCALE UX (Speedtest-grade) — IDEATE → A/B → SHIP
# Status: IMPLEMENT wave — bring theme into header; upgrade locale + chrome
# Reference UX (inspiration ONLY, do not clone Ookla IP/logo):
#   https://www.speedtest.net/ — compact header: locale control + sun/moon theme pill
# User evidence (attachments):
#   - Theme menu: Giao diện sáng / tối / Theo hệ thống (already in Cmd+K)
#   - Locale pill: VI | EN segmented control
#   - Speedtest header: light chrome, chevron locale, pill theme toggle
# Code parents:
#   components/shared/site-header.tsx
#   components/shared/locale-switcher.tsx
#   components/shared/cmdk.tsx (theme actions via next-themes — KEEP working)
#   app/layout.tsx (ThemeProvider already mounted)
# Style parents (form ONLY):
#   prompts/2026-08-12-00-23-claude-v0-source-audit-waves-abc-close-mcp.md
#   prompts/2026-07-23-claude-v0-luxury-sellability-MASTER-4h-mcp.md
# Primary workspace: Z:\Coding\260723-de-pmh
# Mode: IDEATE → VALIDATE (live header) → A/B PICK → IMPLEMENT → SMOKE → open UI
# Sub-agents: **5** minimum (Orchestrator may run sequentially via Task)
# Max repair loops: 2
# Frozen: teal primary · Fraunces/Inter · Cmd+K · project mega-menu · compare/legal IA
# NO: purple/cream/glow rebrand · Ookla logo/copy theft · commit/push unless human asks later

---

## 0. Problem

Header exposes locale (basic VI|EN) but **theme only via Cmd+K**. Users need
first-class theme control in the sticky header, with chrome that feels as calm
and professional as Speedtest’s utility cluster (locale + theme), without
abandoning DED-PMH brand tokens.

---

## 1. How to use

1. Read `site-header.tsx`, `locale-switcher.tsx`, Cmd+K theme block, `ThemeProvider`.
2. Phase 0: write **exactly 2 variants (A/B)** for the right-rail utility cluster.
3. Phase 1: validate against live `http://localhost:3000` header (desktop + ~375).
4. Phase 2: score rubric → pick **one winner** (no mid-run human ask).
5. Phase 3: implement winner only; keep Cmd+K theme actions as secondary path.
6. Phase 4: smoke + open browser to `/`.
7. Save this prompt under `prompts/` if not already saved; write short smoke report.
8. No commit/push in this wave.

Scope lock:
```text
WRITE: components/shared/site-header.tsx
       components/shared/locale-switcher.tsx (upgrade or replace)
       components/shared/theme-switcher.tsx (NEW — header theme control)
       lib/i18n/vi.json + en.json (labels for theme/locale a11y)
       optional: components/ui/* only if needed for dropdown/toggle
       reports/2026-08-12-header-theme-locale-ab-smoke.md
       prompts/2026-08-12-01-52-claude-v0-header-theme-locale-speedtest-ab-mcp.md
READ:  cmdk.tsx theme keys, layout ThemeProvider, mobile-nav (header density)
NO:    rewriting mega-menu/compare/legal; new fonts; removing Cmd+K theme
NO:    cloning Speedtest trademark assets; commit/push
```

---

## 2. Variant briefs (mandatory before code)

### Variant A — Speedtest utility cluster (pill theme + chevron locale)
- Right rail: `[Search] [Locale chevron/menu] [Sun|Moon pill toggle]` (+ mobile nav).
- Theme pill: light/dark primary toggle (system via long-press OR third state in menu —
  must still expose **system** somehow: prefer small popover with 3 options matching
  Cmd+K copy: Giao diện sáng / tối / Theo hệ thống).
- Locale: compact trigger showing `VI`/`EN` + chevron; menu not a heavy dialog.
- Dense, neutral chrome; teal only for focus/active, not purple.

### Variant B — Segmented locale + icon theme button + menu
- Keep upgraded VI|EN segmented pill (user screenshot 2) but refine spacing/shadow.
- Theme: single icon button (sun/moon reflecting resolved theme) opening the 3-option
  menu (screenshot 1).
- Slightly more “product app” than Speedtest; still header-native.

Each variant must state: whitespace theory, a11y (keyboard, aria-pressed/expanded,
  no color-only), mobile collapse plan, effort S/M.

---

## 3. A/B rubric

| Criterion | Weight |
|-----------|--------|
| Discoverability of theme in header (not only Cmd+K) | 25% |
| Professional calm chrome (Speedtest-like density) | 25% |
| A11y + i18n honesty | 20% |
| Brand fit (teal DED-PMH, not Ookla clone) | 15% |
| Implement / regression risk | 15% |

Tie → prefer Variant **A** (closer to Speedtest reference). Log scores in smoke.

---

## 4. Feature DoD

### F1 — Theme in header
- [ ] User can set light / dark / system without opening Cmd+K
- [ ] Uses `next-themes` `useTheme` (same as Cmd+K); no second theme store
- [ ] Hydration-safe (no flash mismatch / suppress as ThemeProvider already does)
- [ ] Reflects current theme; Cmd+K theme actions still work

### F2 — Locale upgrade
- [ ] Clear current locale; one-click or two-click switch VI↔EN
- [ ] Labels/aria via i18n; focus ring visible

### F3 — Header composition
- [ ] Desktop: utilities aligned, no wrap chaos; search retained
- [ ] Mobile: theme + locale reachable (header and/or mobile sheet — pick one coherent plan)
- [ ] No hero badges; sticky header stays thin

### F4 — Evidence
- [ ] Smoke md with A/B scores + winner + screenshots/notes
- [ ] Browser opened to `http://localhost:3000`

---

## 5. Sub-agents (≥5)

**AGENT-01 Librarian** — inventory header/locale/cmdk theme; screenshot notes; no edits.  
**AGENT-02 Ideate/Validate/A/B** — variants + rubric + winner lock.  
**AGENT-03 Implement theme-switcher + wire header** — F1.  
**AGENT-04 Implement locale upgrade + mobile density** — F2/F3.  
**AGENT-05 QA smoke + report + open UI** — F4; ≤2 repair loops.

Return STATUS blocks from each agent.

---

## 6. Acceptance

| ID | Criterion |
|----|-----------|
| AC0 | ≥5 agent STATUS blocks |
| AC1 | A/B documented; winner named |
| AC2 | Theme controllable from header (3 modes) |
| AC3 | Locale control upgraded + works |
| AC4 | Cmd+K theme still works |
| AC5 | Desktop + mobile smoke PASS |
| AC6 | Prompt saved under `prompts/`; smoke report written |
| AC7 | Browser opened to local home |
| AC8 | No commit/push |

**PASS** iff AC0–AC8.

---

## 7. Anti-patterns

- Theme only still buried in Cmd+K
- Copying Speedtest logo/wordmark
- Purple/glow theme toggle
- Breaking `ThemeProvider` / FOUC
- Asking human mid-run for A vs B

---

## 8. Start

Spawn AGENT-01 → … → AGENT-05.  
Success line:  
`Header theme+locale Speedtest-grade — winner {A|B} shipped; smoke written; UI opened; no push.`
