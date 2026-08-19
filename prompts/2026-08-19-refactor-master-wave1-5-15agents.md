# CLAUDE CODE MULTI-AGENT MASTER PROMPT
# DED-PMH v0 — CODEBASE REFACTOR MASTER (Wave 1→5)
# Status: MASTER — implements full refactor roadmap post three-audit synthesis
# Evidence parents (MUST read before acting; do not invent scope):
#   reports/2026-08-19-luxury-full-audit.md
#   reports/2026-08-19-technical-dd-valuation-productization.md
#   reports/2026-08-19-pattern-transfer-lanphuong-to-de-pmh.md
# Style parents (form only):
#   prompts/2026-07-23-claude-v0-luxury-sellability-MASTER-4h-mcp.md
#   prompts/2026-08-12-00-23-claude-v0-source-audit-waves-abc-close-mcp.md
# Primary workspace: C:\Code\2026\de-pmh-260723
# Mode: IMPLEMENT → GATE → SMOKE (Vietnamese executive)
# Wall-clock budget: unlimited — complete all 5 waves; do not stop early
# Sub-agents: 15 mandatory (hard floor ≥12 — Orchestrator MUST spawn all; no collapsing)
# Max repair loops / feature: 3
# Human pre-authorization (THIS WAVE):
#   Do NOT pause for mid-run aesthetic OK.
#   Do NOT commit/push unless human explicitly asks.
#   Git identity rules in CLAUDE.md apply only when human requests push.
# Defaults (locked):
#   D1 — Image optimization: DEFER; do not flip images.unoptimized to false
#   D2 — next-intl migration: DEFER; fix split-brain via locale cookie/header only
#   D3 — Firebase/Algolia/OCR: REJECT; do not add SaaS deps
#   D4 — CSS theme system: keep next-themes class strategy; do NOT migrate to data-theme attribute
#   D5 — data-theme script key: use 'theme' (not 'nc-theme'); toggle .dark class (not setAttribute)
# Frozen:
#   Teal oklch tokens · Fraunces/Inter fonts · COMPARE_COLUMN_CAP=4 · LuxuryIndex gate ≥85 ·
#   MapLibre Wave-2 behavior · vendor/library/types schema ·
#   NO purple/cream/glow rebrand · NO Firebase/Algolia/Enterprise ·
#   NO force-push · NO --global git config · NO next-intl route migration

---

## 0. Coverage map (read first — every feature must map here)

| Wave | ID | Work | Agent | Files (primary) |
|------|----|------|-------|-----------------|
| 1 | F01 | `.animate-skeleton` keyframes + `--shadow-card` per-theme CSS var | AGENT-02 | `app/globals.css` |
| 1 | F02 | `CompareTableSkeleton` component + wire into `/so-sanh` Suspense | AGENT-02 | `components/project/compare-table-skeleton.tsx`, `app/so-sanh/page.tsx` |
| 1 | F03 | `LegalLoadingSkeleton` + wire into legal Suspense | AGENT-02 | `components/project/legal-loading-skeleton.tsx`, `components/project/legal-page-client.tsx` |
| 1 | F04 | `themeInitScript beforeInteractive` flash prevention | AGENT-03 | `lib/theme-init-script.ts`, `app/layout.tsx` |
| 1 | F05 | `@media prefers-reduced-motion` CSS block — global override | AGENT-03 | `app/globals.css` |
| 1 | F06 | FlipbookEngine reduced-motion guard (disable page-flip animation) | AGENT-03 | `components/flipbook/FlipbookEngine.tsx` |
| 1 | F07 | Flipbook brand token: `--bg-reader` CSS var, swap `#111` + `#ededed` hardcodes | AGENT-04 | `app/globals.css`, `components/project/detail/project-flipbook-viewer.tsx`, `components/flipbook/FlipbookToolbar.tsx` |
| 1 | F08 | `category-tabs-fade` mask-image + `::selection` accent-muted | AGENT-04 | `app/globals.css`, `components/project/detail/gallery.tsx` |
| 1 | F09 | `accent-solid` / `accent-on-solid` teal AA pair + primary button wire | AGENT-04 | `app/globals.css`, `components/ui/button.tsx` |
| 2 | F10 | Dead code removal: `scripts/archive/*`, `lib/geo/*`, `LEGAL_DOSSIER_LABELS`, `shadcn` dep, `luxury:qa` duplicate | AGENT-05 | Listed files; `package.json` |
| 2 | F11 | `ScopeChip` shared extraction (from compare-table + legal-page-client) | AGENT-05 | `components/shared/scope-chip.tsx`, compare-table, legal-page-client |
| 2 | F12 | `HeroBlock` variant unification (home hero + detail hero → single variant prop) | AGENT-06 | `components/home/hero.tsx`, `components/project/detail/hero.tsx` |
| 2 | F13 | `Reveal` / `BlurFade` merger → single `Reveal blur?` prop | AGENT-06 | `components/shared/reveal.tsx`, `components/shared/blur-fade.tsx` |
| 2 | F14 | `CatalogPageShell` extraction (5× page.tsx shell dedup) | AGENT-07 | `app/*/page.tsx`, new `components/shared/catalog-page-shell.tsx` |
| 2 | F15 | `useNavScopeFilter()` hook extraction (zone/group filter dedup) | AGENT-07 | `lib/hooks/use-nav-scope-filter.ts`, compare-table, legal-page-client, project-explorer |
| 2 | F16 | `useReplaceSearchParams()` hook extraction (URL param dedup) | AGENT-07 | `lib/hooks/use-replace-search-params.ts` |
| 3 | F17 | `verify-i18n-keys.mjs` port — static scan vi.json/en.json vs source | AGENT-08 | `scripts/verify-i18n-keys.mjs`, `package.json` |
| 3 | F18 | i18n split-brain fix: server reads locale cookie → pass as prop (no next-intl) | AGENT-08 | `lib/i18n/t.ts`, `lib/i18n/locale-context.tsx`, `app/layout.tsx` |
| 3 | F19 | `seo.buildTitle()` shared helper (6-page title suffix dedup) | AGENT-09 | `lib/seo.ts`, `app/**/page.tsx` |
| 3 | F20 | Vitest setup + 3 pure lib tests (`legal-documents.ts`, `motion/presets.ts`, `lib/i18n/t.ts`) | AGENT-09 | `vitest.config.ts`, `lib/*.test.ts` |
| 3 | F21 | i18n parity test (vi ↔ en key set + no empty values) | AGENT-09 | `lib/i18n.test.ts` |
| 4 | F22 | Detail page editorial rhythm: section dividers + whitespace + legal collapse below fold | AGENT-10 | `app/du-an/[slug]/page.tsx`, detail components |
| 4 | F23 | ProjectCard + FeaturedCards merge → single `ProjectCard layout="featured"` prop | AGENT-11 | `components/project/project-card.tsx`, `components/home/featured-cards.tsx` |
| 4 | F24 | `buildHeroAssetsBySlug()` extraction (3-page duplication in bridge) | AGENT-11 | `lib/library-bridge.ts` |
| 4 | F25 | Home first-viewport trim: cap hero + featured + map; defer Updates section below fold | AGENT-12 | `app/page.tsx`, `components/home/*` |
| 5 | F26 | `luxury:qa:auto` gate + `typecheck` script in package.json (CI-ready) | AGENT-13 | `package.json`, `scripts/luxury/*` |
| 5 | F27 | Luxury capture: add flipbook route to `capture.mjs` | AGENT-13 | `scripts/luxury/capture.mjs` |
| 5 | F28 | `buildSiteSettings` nav taxonomy refactor → config object (decouple PMH plot codes) | AGENT-14 | `lib/project-nav-taxonomy.ts`, nav components |
| 5 | F29 | `home-content.ts` abstraction → typed `SiteContent` interface (decouple PMH brand copy) | AGENT-14 | `lib/home-content.ts`, `lib/types.ts` |
| 5 | F30 | LuxuryIndex gate run + smoke report | AGENT-15 | `reports/2026-08-19-refactor-smoke.md` |

Prior work — DO NOT rebuild:
- `/so-sanh` compare matrix IA (Wave A→B→C already shipped)
- `/phap-ly` single-project legal per-card (already shipped)
- MapLibre Wave-2 ACs (frozen)
- Flipbook gallery masonry + fullscreen (shipped)

---

## 1. Product context (read once; use as decision anchor)

### What this is
Internal-facing **verified project data browser** — 4 Phú Mỹ Hưng real estate projects. SSG, no auth, no API. Data from `vendor/data/13_PROJECT_DATA_SCHEMA.json` + CSV manifest. 6 public routes + `/lab`.

### Feature inventory (current state → target state)

| Module | Current | Target after refactor |
|--------|---------|----------------------|
| Luxury UX / Empty states | Plain `<p>` loading text | Skeleton components; PerceivedLuxury 6.5→7.3+ |
| Motion / reduced-motion | FlipbookEngine unguarded | Full CSS override + component guard |
| Flipbook brand | `#111/#ededed` hardcoded | `var(--bg-reader)` CSS token, on-brand |
| Theme flash | next-themes only | `themeInitScript beforeInteractive` |
| Design system | shadcn fragments | `primitives / blocks / sections / project / navigation / flipbook` |
| Dead code | ~908 LOC, geo stub, dup dep | Removed; LOC −12–18% |
| Duplication | 6 patterns duplicated | Shared hooks + components |
| i18n | Split-brain server vi / client en | Unified server+client; verify script |
| Testing | 10 e2e, 0 unit | vitest + 5 pure lib tests |
| Productization | nav/home hardcoded to PMH | Typed config interfaces (partial abstraction) |
| Maturity score | 62.5/100 | Target 70+/100 |
| LuxuryIndex | 85/100 | Maintain ≥85 (target 87+) |

### Total modules / features
**~88 discrete items** across 5 waves. **30 feature IDs** (F01–F30). **52 components + 21 libs + 15 app files** in scope.

### Current → target

| Dimension | Current | Target |
|-----------|---------|--------|
| LuxuryIndex | 85 | ≥87 |
| PerceivedLuxury | 6.5/10 | 7.3–7.5/10 |
| Maturity score | 62.5/100 | 70/100 |
| Dead LOC | ~1,200 | ~0 |
| Unit tests | 0 | ≥5 |
| Duplicated patterns | 6 | ≤1 |
| PMH hardcode lock-in | ~60% | ~45% (partial abstraction) |

---

## 2. How to use

You are the **DED-PMH Refactor Master Orchestrator** (Claude Code / Cursor Agent with Task/sub-agent support).

1. Execute Wave 1→5 in order. Within each wave, features run sequentially unless file sets are provably disjoint.
2. **HARD REQUIREMENT — multi-agent:** Spawn **all 15 agents** below (floor **≥12**). Do NOT solo-implement everything. Each agent owns exclusive file sets. Collect STATUS block per agent before moving to next wave.
3. No conflicting parallel writes on the same file. AGENT-02 + AGENT-04 may run parallel (disjoint file sets within Wave 1). AGENT-05 + AGENT-06 may run parallel within Wave 2.
4. Dev: `npm run dev` (webpack) on `http://localhost:3000`. Do NOT use Turbopack dev.
5. Verify UI with MCP browser preferred; else Playwright / `npm run luxury:capture`.
6. No mid-run human questions. Use Defaults section above.
7. Stop at smoke report — no commit/push.

Scope lock:
```text
WRITE: app/**, components/**, lib/**, scripts/luxury/**, scripts/verify-i18n-keys.mjs,
       package.json (scripts + deps removal only),
       vitest.config.ts, lib/*.test.ts,
       reports/2026-08-19-refactor-smoke.md

READ:  reports/2026-08-19-*.md, vendor/library/**, lib/project-nav-taxonomy.ts,
       prompts/* (style reference only)

NO:    vendor/data/** (no edit to JSON/CSV seed)
NO:    next-intl route migration ([locale] folder)
NO:    image optimization flip (images.unoptimized stays true)
NO:    Firebase/Algolia/OCR/SaaS deps
NO:    force-push, --global git config
NO:    Rebuild shipped features (compare IA, legal cards, MapLibre, flipbook masonry)
```

---

## 3. Agent roster

### AGENT-01 — Orchestrator (this agent)
**Role:** Read all 3 evidence reports. Spawn AGENT-02→15. Collect STATUS. Run gate after each wave. Write final smoke report (F30).

**Before spawning:** Verify dev server is running (`npm run dev`). Read `reports/2026-08-19-pattern-transfer-lanphuong-to-de-pmh.md §9` for implementation spec snippets.

---

### WAVE 1 — Luxury UX quick wins (S items, ~3–5 days eng equiv)

### AGENT-02 — Skeleton UX
**Owns:** F01, F02, F03
**Files:**
- `app/globals.css` — append `.animate-skeleton` keyframes + `--shadow-card` CSS vars (see spec §9 of pattern-transfer report)
- `components/project/compare-table-skeleton.tsx` — new; 4-row layout-matched skeleton
- `app/so-sanh/page.tsx:37` — replace `fallback={<p ...>}` → `<CompareTableSkeleton />`
- `components/project/legal-loading-skeleton.tsx` — new; 3-row stub
- `components/project/legal-page-client.tsx` — wire legal skeleton in Suspense

**DoD:**
- [ ] MCP screenshot `/so-sanh` mid-load shows skeleton (not plain text)
- [ ] MCP screenshot `/phap-ly` mid-load shows skeleton
- [ ] `npm run typecheck` 0 errors

---

### AGENT-03 — Theme & Motion guards
**Owns:** F04, F05, F06
**Files:**
- `lib/theme-init-script.ts` — new; inline IIFE using `.dark` class (not `data-theme`); key `'theme'` (next-themes default)
- `app/layout.tsx` — add `<Script id="theme-init" strategy="beforeInteractive">{themeInitScript}</Script>`; import from lib
- `app/globals.css` — append `@media (prefers-reduced-motion: reduce)` global block
- `components/flipbook/FlipbookEngine.tsx` — add `useReducedMotion()` hook from framer-motion; when true, disable page-flip animation (set duration 0 or skip)

**DoD:**
- [ ] No theme flash on cold load (MCP: navigate `/`, hard reload, no white-flash before teal)
- [ ] FlipbookEngine: `prefers-reduced-motion` test passes (can be manual or vitest mock)
- [ ] `npm run typecheck` 0 errors

---

### AGENT-04 — Brand tokens & CSS polish
**Owns:** F07, F08, F09
**Files:**
- `app/globals.css` — add: `--bg-reader` token; `category-tabs-fade` mask-image utility; `::selection` accent-muted; `accent-solid/accent-on-solid` teal AA pair vars
- `components/project/detail/project-flipbook-viewer.tsx` — replace `bg-[#111111]` → `bg-[var(--bg-reader)]`
- `components/flipbook/FlipbookToolbar.tsx` — replace `text-[#ededed]` → `text-[var(--fg)]` or teal-adjusted
- `components/project/detail/gallery.tsx` — add `tabs-scroll-fade` class to tab scroll container
- `components/ui/button.tsx` — primary variant: use `accent-solid` var for background, `accent-on-solid` for text

**DoD:**
- [ ] Flipbook dark chrome uses teal-dark token (MCP: open flipbook → dark reader bg matches brand)
- [ ] Gallery tabs fade on mobile (MCP 375px screenshot)
- [ ] Text selection uses accent-muted background (manual verify)
- [ ] `npm run typecheck` 0 errors

**Wave 1 gate (AGENT-01 runs after AGENT-02+03+04 complete):**
- `npm run typecheck` 0 errors
- `npm run luxury:score` → LuxuryIndex ≥85
- MCP spot: `/`, `/du-an/hong-hac-city`, `/so-sanh`, `/phap-ly` — no regression

---

### WAVE 2 — Deduplication & design system foundations

### AGENT-05 — Dead code & ScopeChip extraction
**Owns:** F10, F11
**Files:**
- `scripts/archive/` — DELETE all 9 files
- `lib/geo/` — DELETE (0 imports confirmed; verify with grep before delete)
- `lib/types.ts` — REMOVE `LEGAL_DOSSIER_LABELS` export (no imports)
- `package.json` — REMOVE `shadcn` dep from dependencies (0 imports)
- `package.json` — MERGE `luxury:qa` → `luxury:qa:auto` (keep `:auto`; remove duplicate)
- `components/shared/scope-chip.tsx` — new; extract from compare-table + legal-page-client
- `components/project/compare-table.tsx` — replace inline scope chip → `<ScopeChip>`
- `components/project/legal-page-client.tsx` — replace inline scope chip → `<ScopeChip>`

**DoD:**
- [ ] `grep -r "scripts/archive"` returns 0 hits in package.json scripts
- [ ] `grep -r "lib/geo"` returns 0 imports in src/app/components/lib
- [ ] ScopeChip renders identically in both locations (MCP screenshot compare + legal)
- [ ] `npm run typecheck` 0 errors
- [ ] `npm install` resolves without shadcn

---

### AGENT-06 — Hero + Reveal unification
**Owns:** F12, F13
**Files:**
- `components/home/hero.tsx` — add `variant?: "home" | "detail"` prop; merge logic
- `components/project/detail/hero.tsx` — refactor to use `HeroBlock variant="detail"` from shared; remove duplicate markup (~40 LOC)
- `components/shared/reveal.tsx` — add `blur?: boolean` prop (default false)
- `components/shared/blur-fade.tsx` — DEPRECATE: replace all usages with `<Reveal blur>` then DELETE file

**DoD:**
- [ ] Home hero renders identically (MCP `home-1440` screenshot diff < 0.5%)
- [ ] Detail hero renders identically (MCP `detail-hh-1440` screenshot diff < 0.5%)
- [ ] `grep -r "blur-fade"` returns 0 imports
- [ ] `npm run typecheck` 0 errors

---

### AGENT-07 — Shared hooks + CatalogPageShell
**Owns:** F14, F15, F16
**Files:**
- `components/shared/catalog-page-shell.tsx` — new; extract SiteHeader + mock banner + main wrapper pattern
- `app/du-an/page.tsx`, `app/so-sanh/page.tsx`, `app/phap-ly/page.tsx` — refactor to use `CatalogPageShell`
- `lib/hooks/use-nav-scope-filter.ts` — new; zone/group filter logic extracted
- `lib/hooks/use-replace-search-params.ts` — new; URL param replace extracted
- `components/project/compare-table.tsx`, `components/project/legal-page-client.tsx`, `components/home/project-explorer.tsx` — consume hooks

**DoD:**
- [ ] All 3 routes render identically (MCP screenshots)
- [ ] `useNavScopeFilter` unit-testable (pure or near-pure; no React DOM dependency)
- [ ] `npm run typecheck` 0 errors

**Wave 2 gate:**
- `npm run typecheck` 0 errors
- `npm run luxury:score` ≥85
- `npm install` clean
- LOC delta reported in smoke (target −300 LOC+)

---

### WAVE 3 — i18n repair + Testing

### AGENT-08 — i18n fix + verify script
**Owns:** F17, F18
**Files:**
- `scripts/verify-i18n-keys.mjs` — new; port from namecard reference; scan for `t("key")` calls in source; resolve in `lib/i18n/vi.json` + `lib/i18n/en.json`; exit 1 if orphan found
- `package.json` — add `"verify:i18n": "node scripts/verify-i18n-keys.mjs"` script
- `lib/i18n/t.ts` — add server-side locale resolution: read `NEXT_LOCALE` cookie via `next/headers` (RSC) → return correct locale strings; client context unchanged
- `app/layout.tsx` — set `NEXT_LOCALE` cookie from `Accept-Language` header as fallback if cookie not set

**DoD:**
- [ ] `npm run verify:i18n` exits 0 (all keys resolve)
- [ ] Switching locale toggle → page re-render in correct language without full reload
- [ ] `npm run typecheck` 0 errors

---

### AGENT-09 — Vitest + pure lib tests
**Owns:** F19, F20, F21
**Files:**
- `lib/seo.ts` — new; `buildTitle(pageTitle: string, suffix?: string): string` helper
- `app/**/page.tsx` (metadata) — use `seo.buildTitle()` instead of inline string
- `vitest.config.ts` — new; standard vitest config, exclude e2e
- `package.json` — add `"test": "vitest run"` script
- `lib/legal-documents.test.ts` — test `splitLegalContent()` (pure function)
- `lib/motion/presets.test.ts` — test `revealUp`, `heroTextCascade` shape (pure objects)
- `lib/i18n/t.test.ts` — test `t()` returns correct string for vi + en
- `lib/i18n.test.ts` — key parity: vi ↔ en exact key set, no empty values

**DoD:**
- [ ] `npm run test` passes all ≥5 tests
- [ ] `npm run verify:i18n` still exits 0 after AGENT-08 changes

---

### WAVE 4 — Editorial UX + component system

### AGENT-10 — Detail page editorial rhythm
**Owns:** F22
**Files:**
- `app/du-an/[slug]/page.tsx` — collapse legal accordion below fold by default; add section divider lines between major blocks; increase `py-*` section spacing luxury breathing room
- `components/project/detail/*.tsx` — section-level whitespace; collapse Stats section to single horizontal row if data sparse

**DoD:**
- [ ] MCP `detail-hh-1440` screenshot: visible section breathing room; legal accordion collapsed default
- [ ] Mobile `detail-hh-375` no overflow
- [ ] `npm run typecheck` 0 errors

---

### AGENT-11 — ProjectCard + FeaturedCards merge + bridge helper
**Owns:** F23, F24
**Files:**
- `components/project/project-card.tsx` — add `layout?: "catalog" | "featured"` prop; featured layout = larger thumbnail + bigger text
- `components/home/featured-cards.tsx` — replace inline markup → `<ProjectCard layout="featured">`; keep section wrapper
- `lib/library-bridge.ts` — extract `buildHeroAssetsBySlug()` helper (used in 3 pages); replace inline logic

**DoD:**
- [ ] Home featured section renders identically (MCP)
- [ ] Catalog grid renders identically (MCP)
- [ ] `npm run typecheck` 0 errors

---

### AGENT-12 — Home first-viewport composition
**Owns:** F25
**Files:**
- `app/page.tsx` — reorder: Hero → Featured (2 cards) → Map; move Updates section to below-fold; add `loading="lazy"` hints below fold
- `components/home/home-updates.tsx` — mark as below-fold; ensure not in LCP critical path

**DoD:**
- [ ] MCP `home-1440` first viewport: Hero + 2 Featured + Map visible without scroll
- [ ] Updates visible on scroll (not hidden permanently)
- [ ] `npm run luxury:score` ≥85

**Wave 4 gate:**
- `npm run typecheck` 0 errors
- `npm run luxury:score` ≥85
- e2e smoke: `npm run test:e2e` — all 10 specs green

---

### WAVE 5 — Tooling + productization scaffold

### AGENT-13 — Luxury pipeline hardening
**Owns:** F26, F27
**Files:**
- `package.json` — add `"typecheck": "tsc --noEmit"` if not exists; ensure `luxury:qa:auto` is gate-ready
- `scripts/luxury/capture.mjs` — add flipbook route capture (navigate to `/du-an/hong-hac-city` → open flipbook → screenshot)

**DoD:**
- [ ] `npm run typecheck` exits 0
- [ ] `npm run luxury:capture` produces flipbook screenshot in `reports/assets/`
- [ ] `npm run luxury:score` ≥85

---

### AGENT-14 — Productization scaffold (partial abstraction)
**Owns:** F28, F29
**Files:**
- `lib/project-nav-taxonomy.ts` — extract `PROJECT_NAV_ZONES` constant into `lib/config/site-nav.ts`; keep type-safe; add comment `// White-label: replace this object per deployment`
- `lib/home-content.ts` — define `SiteContent` interface; extract PMH brand copy as typed constant; add comment `// White-label: replace SiteContent per deployment`
- `lib/types.ts` — export `SiteContent` type

**DoD:**
- [ ] No runtime behavior change (MCP home renders identically)
- [ ] New files clearly marked with white-label instructions in comments
- [ ] `npm run typecheck` 0 errors

---

### AGENT-15 — Final gate + smoke report
**Owns:** F30
**Runs after all other agents complete.**

**Tasks:**
1. `npm run typecheck` — must be 0
2. `npm run test` — all vitest pass
3. `npm run verify:i18n` — exits 0
4. `npm run luxury:capture` (PW_CHANNEL=chrome if needed)
5. `npm run luxury:score` — report LuxuryIndex
6. MCP browser screenshots: `/` (1440 + 375), `/du-an/hong-hac-city` (1440), `/so-sanh` (1440), `/phap-ly` (1440)
7. Write `reports/2026-08-19-refactor-smoke.md`

**Smoke report template:**
```markdown
# Refactor Master — Smoke Report
Date: [today]
LuxuryIndex before: 85 / after: [N]
PerceivedLuxury before: 6.5 / after: [estimate]
Maturity score before: 62.5 / after: [estimate]
Dead LOC removed: [N]
Unit tests added: [N]
Duplicated patterns resolved: [N]/6

## Wave results
| Wave | Features | Status | Gate result |
|------|----------|--------|-------------|
| 1 | F01–F09 | | LuxuryIndex: |
| 2 | F10–F16 | | LOC delta: |
| 3 | F17–F21 | | Tests: |
| 4 | F22–F25 | | e2e: |
| 5 | F26–F30 | | Final LuxuryIndex: |

## Regressions
[list any; NONE if clean]

## Deferred
[D1–D5 defaults; any DEFER decisions made mid-run]

## Screenshots
[link to reports/assets/refactor-*]
```

---

## 4. Pipeline

```text
Phase 0  READ      — AGENT-01 reads all 3 evidence reports; verifies dev server up
Phase 1  WAVE 1    — AGENT-02+03+04 (F01–F09); gate: typecheck + LuxuryIndex ≥85
Phase 2  WAVE 2    — AGENT-05+06+07 (F10–F16); gate: typecheck + install + LOC delta
Phase 3  WAVE 3    — AGENT-08+09 (F17–F21); gate: verify:i18n + test
Phase 4  WAVE 4    — AGENT-10+11+12 (F22–F25); gate: typecheck + e2e + LuxuryIndex ≥85
Phase 5  WAVE 5    — AGENT-13+14 (F26–F29); gate: typecheck + capture + luxury:score
Phase 6  CLOSE     — AGENT-15 (F30): full gate suite + smoke report
```

Repair protocol: if any feature fails gate after 3 loops → ROLLBACK that feature → mark DEFERRED in smoke → continue wave.

---

## 5. Definition of Done (master)

- [ ] `npm run typecheck` 0 errors
- [ ] `npm run test` ≥5 passing
- [ ] `npm run verify:i18n` exits 0
- [ ] `npm run luxury:score` LuxuryIndex ≥85 (target 87)
- [ ] e2e: all 10 specs green
- [ ] `reports/2026-08-19-refactor-smoke.md` written with before/after metrics
- [ ] No commit/push (human will authorize separately)
