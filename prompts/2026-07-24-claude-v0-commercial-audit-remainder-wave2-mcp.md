# CLAUDE CODE MULTI-AGENT PROMPT
# DED-PMH v0 — COMMERCIAL AUDIT REMAINDER (Wave-2) — CLOSE ALL OPEN ITEMS
# Source audit: v0/reports/2026-07-23-10-22-audit-thuong-mai-ded-pmh-v0.md
# Prior wave (credited, do NOT redo unless FAIL): 
#   reports/2026-07-24-v0-commercial-audit-50pct-smoke.md  (W1–W8 weight model = 100/100 of THAT wave)
# Style parent (form ONLY):
#   prompts/2026-07-24-claude-v0-commercial-audit-50pct-6agents-mcp.md
#   prompts/2026-07-23-claude-v0-score-lift-independent-review-200-mcp.md
# Primary workspace: Z:\Coding\260719-DE\v0
# Mode: IMPLEMENT — BROWSER-FIRST VERIFY → CODE → GATE → SMOKE
# Sub-agents: **6** (all must run; Orchestrator merges)
# Max repair loops: 2
# Target: Close **100% of remaining** commercial-audit open work (orange + strategy packaging + residual image risk). Deploy = human-gated verify/docs only.

---

## 0. Independent context (read before coding)

An independent reviewer of the 50% smoke concluded:

| Claim | Independent stance |
|-------|--------------------|
| W2 branded 404/error exist | **AGREE** — `app/not-found.tsx`, `app/error.tsx` present |
| W3 nav EN reactive | **AGREE** — `mobile-nav` / `project-nav-dropdown` use `useLocale().t()` |
| W7 Image Phase-1 | **AGREE PARTIAL** — `ImageWithFallback` on detail hero+gallery only; other surfaces still plain `next/image` hotlink |
| “100/100 trọng số §V” | **AGREE for wave weight model** — **REJECT as “audit fully closed”** — smoke §6 still lists open Major/orange/strategy work |
| PNG inventory | **CONDITIONAL** — smoke cites 6 PNGs; repo may have 5 — re-capture any missing in this wave |

**Still OPEN vs original audit** (this wave’s job):

1. **Full / durable image ownership** — self-host OR durable local copies under `public/` / Blob + rewrite asset URLs (audit §I #2, §V orange #1) — largest commercial risk left.
2. **Extend `ImageWithFallback`** to remaining hotlink surfaces (cards, featured, masterplan, amenities, location, nav thumbs, home hero if remote).
3. **Gallery virtualization / pagination** — long detail page (~9k px, 25+ images) (audit §II Minor).
4. **Page-route transitions** — Framer already in deps (audit §V orange).
5. **i18n honesty leftovers** — `STATUS_LABEL` / dual `t()` vs `useLocale().t()` where still hardcode VI on EN surfaces touched by nav (audit §III minor + smoke §6.5).
6. **Strategy packaging** — WHAT_YOU_BUY / demo docs: explicit Track A vs Local package split; highlight ADR-001 + honesty docs as sell point (audit §V green) — docs only, no RBAC build.
7. **Prod lag for NEW code** — not-found / nav EN / ImageWithFallback may not be on Vercel until human deploy — verify + document; **do not push** unless human asks.

**Already CLOSED (verify once, skip implement):** deploy font/footer parity (old claim), IA `/so-sanh` dedupe, card hover, map shimmer, branded 404/error, Phase-1 hero+gallery fallback.

---

## 1. How to use

You are the **Commercial Audit Remainder Lead** (Wave-2).

1. Browser-first on `http://localhost:3000`; MCP Playwright preferred; script fallback → MCP=CONDITIONAL.
2. Inventory remaining hotlink URLs + surfaces still without `ImageWithFallback`.
3. Implement R1–R6 below to PASS; stop when AC met — no Firebase/RBAC/Algolia.
4. Prefer **durable local mirror** of vendor images into `public/vendor-images/` (or equivalent) + URL rewrite in seed/adapter **over** endless hotlink dependency — if download blocked/legal-unclear, document FAIL path and ship max mitigation (fallback everywhere + remotePatterns + README risk).
5. No commit/push unless human asks later.

**Scope lock:**
```text
WRITE: scripts for image mirror (optional), public/vendor-images/** (if mirroring),
       library-bridge / seed / asset URL helpers (rewrite to local),
       components/** using Image → ImageWithFallback (remaining surfaces),
       gallery virtualization OR paginated "Tất cả" grid,
       app-level or template route transition (minimal, a11y + reduced-motion safe),
       i18n keys for STATUS_LABEL on EN nav surfaces if in scope,
       docs/WHAT_YOU_BUY.md (+ short SELL or DEMO note) Track A vs Local packaging,
       e2e specs for new behaviors,
       reports/2026-07-24-v0-commercial-audit-remainder-smoke.md
       reports/assets/commercial-rem-*.png
READ:  audit thương mại, 50pct smoke, ADR-001, I18N_EN.md, ImageWithFallback
NO:    rebuilding StatusBadge semantics, CMDK/lightbox behavior regress,
       Firebase/RBAC/AI/Algolia, Absolute /200 theater,
       redesign home/map, commit/push without human ask
```

---

## 2. Remainder scoreboard (must reach 100/100 of THIS wave)

| ID | Work | Weight | Rule |
|----|------|--------|------|
| R1 | Image durable ownership (mirror to `public/` **or** documented Blob) + stop depending on live third-party for demo-critical assets | 35 | IMPLEMENT; honest residual if some URLs blocked |
| R2 | `ImageWithFallback` (or local URLs) on **all** remaining project/home/nav image surfaces listed in 50pct §6.2 | 15 | IMPLEMENT |
| R3 | Gallery “Tất cả” virtualize **or** page/chunk load (no 25+ eager full grid) | 15 | IMPLEMENT one coherent approach |
| R4 | Route transition craft (Framer) — 2–3 intentional, `prefers-reduced-motion` respected | 10 | IMPLEMENT minimal |
| R5 | i18n leftover: STATUS_LABEL / hardcode VI on EN nav chrome → locale keys | 10 | IMPLEMENT |
| R6 | Strategy docs: Track A vs Local packaging + honesty docs as sell point; Wave-2 smoke + e2e/tsc | 15 | DOCS + GATE |
| — | Deploy new wave to prod | 0 (human) | VERIFY note only |

**Done:** sum PASS weights = **100** AND ACs PASS.

---

## 3. Non-negotiables

1. Sacred: StatusBadge 5 labels, CMDK, lightbox UX, library-bridge fallback, ADR-001 no premature enterprise.
2. Image mirror must not violate “honesty” — if assets remain third-party licensed, document copyright caveat in WHAT_YOU_BUY.
3. No claim “zero hotlink risk” unless R1 actually rewrites demo assets to first-party URLs.
4. Reduced-motion: transitions off or instant.
5. Vietnamese smoke for PM.
6. e2e: prefer `pnpm test:e2e` or `playwright test -c e2e/playwright.config.ts`; if parallel flakes, re-run `--workers=1` and document (same pattern as 50pct wave).

---

## 4. Sub-agents (6)

### Agent A — Remainder inventory (MUST START)
- Diff audit §II/§V vs 50pct smoke §6; list every remaining `next/image` hotlink call site.
- Count remote vs local URLs on `/du-an/hong-hac-city`.
- Prod spot-check: does prod already have not-found/EN nav? (expect lag).
- PNG `commercial-rem-inventory-*`. No product edits yet.

### Agent B — Image ownership pipeline (R1)
- Script: download unique image URLs used by seed/gallery into `public/vendor-images/...` (stable hashed or slug paths).
- Rewrite resolution so UI prefers local path; keep remote as documented fallback only if needed.
- If download fails (403/CORS/legal): max mitigation + explicit FAIL notes — still push R2 everywhere.

### Agent C — Fallback coverage (R2)
- Replace remaining `Image` hotlinks with `ImageWithFallback` **or** local `src` from R1 on: `project-card`, `featured-cards`, `masterplan`, `amenities`, `location`, nav thumbs, home hero if applicable, `demo-shell` if customer-facing.
- Browser: break one URL synthetically → placeholder.

### Agent D — Gallery performance (R3)
- Virtualize or paginate “Tất cả” grid; keep lightbox working; no horizontal bleed @375.
- Measure: initial DOM image node count drops vs baseline (document numbers).

### Agent E — Motion + i18n leftovers (R4–R5)
- Minimal route transition (template or shared motion wrapper) — not noisy.
- Wire STATUS_LABEL / leftover VI strings on EN nav surfaces to i18n; update I18N_EN.md honesty.

### Agent F — Strategy docs + gate (R6)
- Update WHAT_YOU_BUY (and DEMO if needed): Track A vs Local; residual image/copyright notes; link ADR-001.
- `tsc --noEmit`; e2e full or critical+new; write `reports/2026-07-24-v0-commercial-audit-remainder-smoke.md`.
- Executive: “Commercial audit open items: **CLOSED** / **N residual**” with table.

---

## 5. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | Agent A inventory before edits |
| AC2 | R1–R6 all PASS (or R1 CONDITIONAL with written blocker + R2–R6 PASS) — residual list empty of audit §V orange/green *actionable* items |
| AC3 | Demo-critical project images resolve from first-party (`/vendor-images/...` or Blob) **or** CONDITIONAL documented why not |
| AC4 | No remaining customer-facing project image surface without fallback **or** local src |
| AC5 | Gallery Tất cả no longer mounts all images eagerly (proof: count or virtualizer) |
| AC6 | Route transition present + reduced-motion safe; no regress map/compare |
| AC7 | EN nav STATUS/hardcode leftovers fixed or explicitly N/A with evidence |
| AC8 | Docs packaging Track A vs Local updated |
| AC9 | tsc 0; e2e green (workers=1 acceptable if documented) |
| AC10 | Smoke path: `reports/2026-07-24-v0-commercial-audit-remainder-smoke.md`; no commit/push |
| AC11 | Sentence: “So với audit 2026-07-23, hạng mục còn mở sau Wave-2 = **0** (hoặc liệt kê residual có lý do)” |

**Scorecard:** PASS if AC1–AC11 met.

---

## 6. Deliverables

```text
(public/vendor-images/** and/or URL rewrite — if R1)
components/** ImageWithFallback / gallery perf / motion / i18n
docs/WHAT_YOU_BUY.md (+ related)
reports/2026-07-24-v0-commercial-audit-remainder-smoke.md
reports/assets/commercial-rem-*.png
e2e/* new or extended
optional: scripts/mirror-project-images.mjs
```

Smoke outline:
1. Executive vs audit open list
2. Independent note on 50pct “100/100” vs true remainder
3. R1–R6 evidence
4. CLAIM audit vs LIVE final
5. Prod deploy still human-gated
6. AC table

---

## 7. Done when

PM can sell Track A knowing: no stock-404 class issues (already), nav EN honest, **image third-party risk materially removed or fully mitigated**, long gallery not a demo landmine, docs state Track A vs Local clearly — and smoke lists **zero unexplained open audit items**.

---

## 8. Anti-patterns

- Re-implementing not-found / IA dedupe / map shimmer “for completeness”
- Claiming self-host while URLs still point at `honghacphumyhung.vn`
- Building Firebase to “finish commercial audit”
- Heavy page-transition theater / layout shift
- Silent copyright assumption — always document image provenance
- Absolute /200 scoring as substitute for closing §V leftovers
