# v0 home rebuild + i18n scaffold + e2e suite — MCP smoke

Date: 2026-07-20
Scope: `v0/prompts/2026-07-20-02-14-claude-v0-home-i18n-e2e-mcp.md` — replace v0's `/` DemoShell with a SPEC §3.2 H1-H10 home page, relocate DemoShell to `/lab`, add a minimal i18n scaffold + real ESLint toolchain, and author a `v0/e2e/` Playwright suite. `v0/` write scope only; `src/` read-only via `@library`.

## Package A — Home shell & routing

- `v0/app/page.tsx` rewritten: composes `Hero → StatStrip → Transparency(#minh-bach) → FeaturedCards → ExplorerPreview → VnMap → PortfolioTimeline → LegalTeaser → PartnerMarquee → Updates`, all fed by `getCatalogFromLibrary()` + `getFullCatalog()` (same library-bridge calls already used by `/du-an`).
- `v0/app/lab/page.tsx` (new): hosts the previous `DemoShell` composition verbatim, off the home route.
- 10 new section components under `v0/components/home/**`, each a v0-native adaptation of the Local production pattern (Base UI `Button`/`Tooltip` instead of Radix, v0's own `StatusBadge`/`ProjectCard`, no new shadcn `Card`/`DropdownMenu` primitives added — plain styled `div`s used where Local's `Card` wrapper was purely cosmetic).
- Data gaps (milestones, site settings/brand statement, updates feed, portfolio stats) are **not** new `src/` exports — they're honest static copy ported into `v0/lib/home-content.ts`, matching the exact Vietnamese copy already committed in `src/lib/seed/parse-source-data.ts` (those functions are themselves static arrays, not live derivations, so copying the copy is not a logic fork).
- Motion catalogue + 3 display primitives (`BlurFade`, `NumberTicker`, `Marquee`) ported into `v0/lib/motion/presets.ts` + `v0/components/shared/*` — same pattern v0 already used for `StatusBadge` (v0 keeps its own UI-primitive copies; only pure data logic is shared via `@library`).
- `v0/app/globals.css`: added `.no-scrollbar` utility + `.animate-marquee` keyframe (needed by the horizontal-scroll and marquee sections), ported verbatim from Local's `globals.css`.

## Package B — i18n + ESLint

- `v0/lib/i18n/vi.json` + `v0/lib/i18n/t.ts` (dot-path lookup, throws on missing key). Wired into Hero (kicker/title/CTAs), Transparency (heading), and all home section headings/CTAs, plus `SiteHeader`'s nav labels and search button — matching the prompt's "at least H1/H2/H3 + nav labels" floor.
- `v0/eslint.config.mjs` (flat config, `eslint-config-next` core-web-vitals + typescript) + `eslint`/`eslint-config-next` devDependencies added to `v0/package.json`. Previously the `lint` script existed with no working config/deps (baseline gap). Now: `pnpm --dir v0 lint` → **0 errors, 1 pre-existing warning** (unrelated unused-var in `legal-dossier-table.tsx`, not touched by this prompt).

## Package C — E2E (`v0/e2e/`)

New, distinct from the repo-root `e2e/` suite (built in an earlier session) — self-contained inside `v0/`, own `playwright.config.ts` + `@playwright/test` devDependency + `test:e2e` script.

- `v0/e2e/home.spec.ts` — 8 specs: Hero CTA → `/du-an`, transparency CTA → `#minh-bach` in-viewport, all 5 status labels present, explorer preview lists all 4 projects + links to `/du-an`, timeline milestone links to project, legal teaser links to `/phap-ly` + per-project `#phap-ly` anchor, updates section + compare CTA, `/lab` returns 200 and hosts the relocated DemoShell.
- `v0/e2e/regression.spec.ts` — 5 specs guarding surfaces the rewrite could disturb: nav dropdown (desktop), mobile nav @375, gallery lightbox open/Escape, Compare @375 accordion, Pháp lý anchors.
- **13/13 passing** (`pnpm --dir v0 test:e2e`, chromium, 8 workers, ~10s).
- Wired into `.github/workflows/ci.yml`: new `v0-e2e` job (installs v0's own Playwright browsers, runs `pnpm --dir v0 test:e2e`), plus `pnpm --dir v0 lint` added to the existing `v0` job.

## MCP browser evidence (live, `http://localhost:3000`)

| # | Criterion | Result | Evidence |
|---|---|---|---|
| AC1 | Home renders all H1-H10 sections with real catalog data (not mock) | **PASS** | `reports/assets/v0-p1-home-full-1440.png`; accessibility snapshot shows all 10 headings + correct hrefs/counts |
| AC2 | Hero CTA "Khám phá 4 dự án" → `/du-an` | **PASS** | Live click via MCP, URL changed to `/du-an` |
| AC3 | Hero secondary CTA scrolls to `#minh-bach` | **PASS** | Live click via MCP, URL `#minh-bach`, section confirmed `top < 100px` |
| AC4 | Transparency shows all 5 status-label cards | **PASS** | Accessibility snapshot lists all 5; live-DOM opacity confirmed 1 after real scroll (see note below) |
| AC5 | Featured cards (2) render with image + status + link | **PASS** | Snapshot: 2 links to `/du-an/hong-hac-city`, `/du-an/the-regency` |
| AC6 | Explorer preview lists all 4 projects, "Xem tất cả" → `/du-an` | **PASS** | Snapshot: 4 `ProjectCard`s with status-dot summaries, link confirmed |
| AC7 | Geo map renders 2 region markers, clickable to filtered `/du-an` | **PASS** | Snapshot: "Bắc Ninh 1 dự án" / "TP.HCM 3 dự án" buttons present |
| AC8 | Timeline renders 11 milestones with correct project name + link | **PASS** | Snapshot: all 11 milestones, e.g. "2010 → Hồng Hạc City → GCNĐT..." |
| AC9 | Legal teaser 4 cards, doc counts, "Không ghi nhận tranh chấp", link to `/phap-ly` | **PASS** | Snapshot: 4 cards with correct counts (6/4/7/7 văn bản) |
| AC10 | Partner marquee renders architect + partner chips with tooltips | **PASS** | Snapshot: Nomura/Handel/VietinBank/DP/CSCEC/LJ-Group/BIDV chips in 2 rows |
| AC11 | Updates section: 3 recent entries + compare CTA + official-site links | **PASS** | Snapshot: 3 dated entries, "Xem bảng so sánh" → `/so-sanh`, 4 official links |
| AC12 | `/lab` returns 200, hosts relocated DemoShell (legal dossier + gallery) | **PASS** | `reports/assets/v0-p1-lab-1440.png`; 0 console errors |
| AC13 | Mobile home @375: no horizontal overflow, hamburger nav still works | **PASS** | `reports/assets/v0-p1-home-375.png`, `reports/assets/v0-p1-mobile-nav-375.png`; `scrollWidth === clientWidth` (360px) |
| AC14 | Nav dropdown regression (from home, not just `/du-an`) | **PASS** | `[role="menu"]` count 1, 4× `/du-an/{slug}` + "Xem tất cả" |
| AC15 | Gallery lightbox regression on detail page | **PASS** | Dialog opens (count 1), Escape closes (confirmed after animation-exit settled) |
| AC16 | Compare @375 + Pháp lý anchors regression | **PASS** | 4 accordion triggers visible, table hidden; 4 `#slug` anchors present |
| B | i18n scaffold + ESLint toolchain | **PASS** | `t()`/`vi.json` wired into H1/H3/nav; `pnpm --dir v0 lint` 0 errors |
| C | `v0/e2e/` suite | **PASS** | 13/13 green |

**Console errors across every route tested (`/`, `/lab`, `/du-an/hong-hac-city`, `/so-sanh`, `/phap-ly`): 0.**

### Note on AC4 — a testing artifact, not a bug

A first full-page screenshot showed the Transparency (H3) and Featured Cards (H4) sections visually blank. Live-DOM inspection found the cards at `opacity: 0` — their `whileInView` (framer-motion `IntersectionObserver`) animation. Manually scrolling the section into view and re-checking computed styles confirmed `opacity: 1` and correct content. Playwright's `fullPage` screenshot capture does not reliably fire `IntersectionObserver` callbacks for below-fold content the way a real user scroll does — this is a screenshot-capture limitation, reproduced and isolated the same way the `127.0.0.1` vs `localhost` false-negative was isolated in the prior lightbox/dropdown prompt. No app code changed as a result; documented here so a future audit doesn't re-flag it as a regression.

## Commands run

```
pnpm install                              # + eslint, eslint-config-next, @playwright/test devDeps
pnpm lint                                 # 0 errors, 1 pre-existing warning
pnpm build                                # green — 11 routes (/, /lab, /du-an, /du-an/[slug]×4, /phap-ly, /so-sanh)
npx tsc --noEmit -p tsconfig.json         # 0 errors
pnpm dev -p 3000                          # MCP verification against http://localhost:3000
npx playwright test -c e2e/playwright.config.ts   # 13/13 passed
```

## Files changed (grouped by package)

**Package A — home shell**
- `v0/app/page.tsx` (rewritten)
- `v0/app/lab/page.tsx` (new)
- `v0/components/home/{hero,stat-strip,transparency,featured-cards,explorer-preview,vn-map,portfolio-timeline,legal-teaser,partner-marquee,updates}.tsx` (new)
- `v0/lib/home-content.ts` (new — static milestones/updates/site-settings/stats)
- `v0/lib/motion/presets.ts` (new)
- `v0/components/shared/{blur-fade,number-ticker,marquee}.tsx` (new)
- `v0/app/globals.css` (added `.no-scrollbar` + `.animate-marquee`)

**Package B — i18n + ESLint**
- `v0/lib/i18n/vi.json`, `v0/lib/i18n/t.ts` (new)
- `v0/components/shared/site-header.tsx` (nav labels wired to `t()`)
- `v0/eslint.config.mjs` (new)
- `v0/package.json` (added `eslint`, `eslint-config-next` devDeps)

**Package C — e2e**
- `v0/e2e/playwright.config.ts`, `v0/e2e/home.spec.ts`, `v0/e2e/regression.spec.ts` (new)
- `v0/package.json` (added `@playwright/test` devDep, `test:e2e` script)
- `v0/.gitignore` (ignore `test-results/`, `playwright-report/`, `.playwright-mcp/`)
- `.github/workflows/ci.yml` (added `v0-e2e` job; added `pnpm --dir v0 lint` to `v0` job)

## DEBT

- `partner-marquee.tsx`'s Tooltip uses Base UI's `render` prop pattern (`TooltipTrigger render={<span/>}`), consistent with v0's existing `project-card.tsx` usage — no new pattern introduced.
- No new `src/` files or exports were added; all data gaps closed via static copy in `v0/lib/home-content.ts` or existing `@library` reads, per the prompt's scope lock.
- Turbopack build emits one pre-existing warning ("Encountered unexpected file in NFT list" via `src/library/seed-adapter.ts`'s `fs`/`path` usage) — present before this prompt, not introduced by it, harmless (dev/build-time trace note only).

## VERDICT

```
VERDICT: V0_HOME_I18N_E2E_MET
V0_TRACK_A_PCT_BEFORE: ~81
V0_TRACK_A_PCT_AFTER:  ~95
AC1: PASS    AC2: PASS    AC3: PASS    AC4: PASS    AC5: PASS
AC6: PASS    AC7: PASS    AC8: PASS    AC9: PASS    AC10: PASS
AC11: PASS   AC12: PASS   AC13: PASS   AC14: PASS   AC15: PASS
AC16: PASS
B (i18n+ESLint): PASS
C (e2e suite): PASS
MCP_EVIDENCE_INDEX:
  - v0/reports/assets/v0-p1-home-full-1440.png
  - v0/reports/assets/v0-p1-home-375.png
  - v0/reports/assets/v0-p1-mobile-nav-375.png
  - v0/reports/assets/v0-p1-lab-1440.png
E2E_COMMAND: pnpm --dir v0 test:e2e   (13/13 passed)
FILES_CHANGED: see "Files changed" above, grouped by Package A/B/C
DEBT: see "DEBT" above — no blocking debt, all items are documentation notes
```

`v0 home + i18n + e2e — MCP verified.`
