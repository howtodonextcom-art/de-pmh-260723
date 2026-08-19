# Luxury UI/UX Audit — DED-PMH v0

**Ngày audit:** 2026-08-19  
**Workspace:** `de-pmh-260723`  
**Evidence:** capture mới + browser verification + code review  
**Baseline so sánh:** `reports/assets/luxury-checklist-score.json` (2026-07-23, LuxuryIndex 85)

---

## Executive summary

**LuxuryIndex (local, build mới nhất): 85/100** — pass gate `pnpm luxury:qa:auto` (≥85).

**LuxuryIndex (production): ~84–85/100** — prod đã bắt kịp local (Fraunces H1, footer, flipbook gallery; không còn `#minh-bach`).

**PerceivedLuxury (cảm giác chủ quan): 6.5/10 (~65/100)** — craft kỹ thuật cao nhưng UI vẫn đọc như *polished shadcn internal hub*, chưa *vault editorial luxury*.

**Mức hoàn thành tổng thể: ~72%** so với mục tiêu "vault-grade luxury internal hub". Typography, color tokens, motion presets, capture tooling đã xong; editorial identity, whitespace luxury, empty states, route continuity còn thiếu.

**Vì sao bạn có thể không thấy khác biệt:** Rubric automation đo *craft checklist* (font, shimmer, focus ring, bleed assert) hơn *cảm giác luxury cảm tính*. ~80% surface area vẫn là card grid + teal shadcn — flipbook là signature moment duy nhất rõ ràng, nhưng chrome `#111` tách khỏi brand teal nên không "nhuốm" cả site.

---

## Scorecard

| Dimension | Score /10 | Weight | Ghi chú |
|-----------|-----------|--------|---------|
| **Design 01–08** | **8.94** | 45% | Flipbook + detail density |
| **Effects B1–B6** | **8.17** | 35% | B4 template fade có nhưng continuity yếu |
| **Tooling C1–C5** | **8.30** | 20% | Capture OK; detail chưa editorial |
| **LuxuryIndex** | **85/100** | — | Flat vs 2026-07-23 |
| **PerceivedLuxury** | **6.5/10** | qualitative | Tách khỏi automation |
| **CompletionPct** | **72%** | qualitative | Vault-grade internal hub |

### Design 01–08

| ID | Tiêu chí | Score | Δ vs Jul-23 |
|----|----------|-------|-------------|
| 01 | Point of view | 9 | — |
| 02 | Typography | 10 | — |
| 03 | Restrained color | 9 | — |
| 04 | Hierarchy | 8.5 | −0.5 (detail dense) |
| 05 | Imagery | 9.5 | +0.5 (flipbook) |
| 06 | Motion | 8.5 | −0.5 (flipbook no reduced-motion) |
| 07 | Mobile | 9 | — |
| 08 | Invisible stuff | 8 | — (flipbook a11y +, empty −) |

### Effects B1–B6

| ID | Score | Ghi chú |
|----|-------|---------|
| B1 Hero presence | 9 | Full-bleed cinematic + kenBurns + scrim |
| B2 Scroll reveal | 9 | `Reveal` wrapper unified |
| B3 Micro-interactions | 9 | Button press + card lift |
| B4 Page transitions | 6 | **Corrected:** `app/template.tsx` opacity 0.22s; continuity vẫn yếu |
| B5 Map craft | 8 | Shimmer loading + pins |
| B6 Empty/loading | 8 | Map shimmer OK; compare/legal empty plain |

### Tooling C1–C5

| ID | Score | Ghi chú |
|----|-------|---------|
| C1 Capture | 9 | 13 routes + prod spot; `PW_CHANNEL=chrome` |
| C2 Diff baseline | 8 | pixelmatch; chưa CI |
| C3 Score automation | 9 | Gate ≥85 |
| C4 Density/whitespace | 7.5 | Detail page chưa editorial |
| C5 Depth/atmosphere | 8 | Hero wash + flipbook dark chrome |

---

## Checklist chi tiết (pass/fail + evidence)

### 01 Point of view

| Criterion | Pass | Evidence |
|-----------|------|----------|
| brandFirst | ✅ | Kicker "DED · Phú Mỹ Hưng" + Fraunces H1 — `components/home/hero.tsx`, capture `home-1440` |
| internalHub | ✅ | Footer disclaimer nội bộ — `components/shared/site-footer.tsx` |
| postTransparency | ✅ | Status badges trên cards; không `#minh-bach` — prod capture 2026-08-19 |

### 02 Typography

| Criterion | Pass | Evidence |
|-----------|------|----------|
| displayFont | ✅ | Fraunces mọi H1/H2 public — `app/fonts.ts`, findings h1Font all routes |
| bodyStack | ✅ | Inter via `--font-sans` — `app/globals.css:52` |
| vnCoverage | ✅ | Fraunces Vietnamese subset loaded |
| labException | ✅ | `/lab` H1 Fraunces — `components/demo-shell.tsx:120` |

### 03 Restrained color

| Criterion | Pass | Evidence |
|-----------|------|----------|
| tealTokens | ✅ | `oklch(0.36 0.072 165)` primary — `app/globals.css:61` |
| darkMode | ✅ | `home-dark-1440`, `phap-ly-dark-1440` captures |
| statusPalette | ✅ | Semantic status colors on ProjectCard |
| accentVariety | ✅ | Amber meta/timestamp restrained |
| flipbookBrandSplit | ⚠️ | Flipbook `#111/#ededed` — `project-flipbook-viewer.tsx:44`, `FlipbookToolbar.tsx` — không dùng teal tokens |

### 04 Hierarchy

| Criterion | Pass | Evidence |
|-----------|------|----------|
| sectionJobs | ✅ | Home: Hero → Featured → Catalog → Map → Updates |
| phapLyCards | ✅ | Intro + pill jump + per-project cards |
| ctaCompetition | ✅ | Single primary "Khám phá 4 dự án" |
| mapBalance | ✅ | Map stage `md:min-h-[65vh]` |
| detailDensity | ❌ | `/du-an/hong-hac-city` scroll dài: stats + masterplan tabs + gallery 12+ tiles + legal accordion — `luxury-baseline-detail-hh-1440.png` |

### 05 Imagery

| Criterion | Pass | Evidence |
|-----------|------|----------|
| realPhotos | ✅ | Render kiến trúc PMH/HH, không stock abstract |
| aspectConsistency | ✅ | Hero/card/gallery rounded-xl consistent |
| lcpEager | ✅ | Hero `priority` — 0 console errors home capture |
| flipbookGallery | ✅ | Masonry + tabs → fullscreen flipbook — `gallery.tsx`, `luxury-flipbook-open-1440.png` |

### 06 Motion

| Criterion | Pass | Evidence |
|-----------|------|----------|
| presets | ✅ | `lib/motion/presets.ts` — revealUp, heroTextCascade, kenBurns |
| reducedMotion | ✅ | `MotionConfig reducedMotion="user"` — `app/layout.tsx:44` |
| luxuryPresence | ✅ | Home sections Reveal + card hover lift |
| flipbookMotion | ❌ | `FlipbookEngine.tsx` page-flip không check `useReducedMotion` |
| routeFade | ✅ | `app/template.tsx` opacity 0.22s (B4 corrected) |

### 07 Mobile

| Criterion | Pass | Evidence |
|-----------|------|----------|
| header375 | ✅ | `luxury-baseline-home-375.png` |
| compareAccordion | ✅ | `so-sanh-375` — no bleed |
| phapLyWrap | ✅ | `phap-ly-375` — no bleed |
| assertedNoBleed | ✅ | All mobile routes `noHorizontalBleed: true` in findings 2026-08-19 |
| flipbookMobile | ✅ | Toolbar touch handlers — `FlipbookToolbar.tsx:155` (browser: controls visible) |

### 08 Invisible stuff

| Criterion | Pass | Evidence |
|-----------|------|----------|
| focusRing | ✅ | `focus-visible:ring-3` — `components/ui/button.tsx:7` |
| seoLocal | ✅ | `app/sitemap.ts`, `app/robots.ts` |
| emptyLuxury | ❌ | `app/so-sanh/page.tsx`, `legal-page-client.tsx` — `<p className="text-sm text-muted-foreground">` loading/empty |
| flipbookA11y | ✅ | `role="dialog"`, `aria-modal`, toolbar `aria-label`, progressbar |
| errorBranded | ✅ | `app/error.tsx`, `app/not-found.tsx` — Fraunces + CTAs |
| consoleClean | ⚠️ | `so-sanh-1440` React state-update warning; hydration note on detail when dev overlay open |

---

## Local vs Production lag

| Signal | Local (2026-08-19) | Prod (2026-08-19) | Jul-23 prod |
|--------|---------------------|-------------------|-------------|
| H1 font | Fraunces | Fraunces | Inter |
| Footer | ✅ | ✅ | ❌ |
| #minh-bach | — | ❌ absent | ✅ present |
| Flipbook gallery | ✅ | ✅ deployed | N/A |
| LuxuryIndex est. | 85 | ~84–85 | ~70–78 |

**Kết luận:** Prod lag đã **resolved**. User xem production giờ thấy cùng craft level với local.

---

## "Tại sao chưa thấy luxury" — phân tích cảm nhận

### Gap craft score vs perceived luxury

| Layer | Trạng thái | User thấy gì |
|-------|-----------|--------------|
| **Technical craft** | 85/100 | Fraunces, teal, shimmer, card lift — "site đẹp, professional" |
| **Editorial identity** | ~55/100 | Layout vẫn card-catalog SaaS; không có typographic drama, không asymmetric whitespace |
| **Signature moments** | ~70/100 | Chỉ flipbook + hero cinematic nổi bật; còn lại generic |
| **Continuity** | ~50/100 | Route fade 0.22s opacity — functional, không "flow" |
| **Invisible luxury** | ~60/100 | Loading/empty vẫn plain text; error branded OK |

### 5 lý do cụ thể user "không thấy khác biệt"

1. **Card-grid monoculture** — Home, catalog, detail related projects, compare đều cùng visual language shadcn card. Craft polish không đổi *shape* của UI.
2. **Flipbook isolated** — Dark Issuu chrome (`#111`) là world riêng, không kéo brand teal/editorial vào sitewide. Mở flipbook = wow 3 giây; đóng lại = lại template.
3. **Detail page density** — Hong Hac City detail là data dump hợp lệ cho internal hub nhưng opposite of luxury breathing room.
4. **Automation gate ≠ taste gate** — Score 85 pass vì checklist items (font, bleed, focus) pass; không đo "có muốn showcase screenshot không".
5. **No editorial typography beyond H1** — Body/meta/labels all Inter same weight rhythm; thiếu contrast display vs utility text ở section level.

---

## Flipbook assessment

| Aspect | Score impact | Notes |
|--------|--------------|-------|
| Imagery +0.5 | ✅ | Fullscreen page-turn, thumbnail grid, zoom — upgrade từ lightbox |
| Motion −0.5 | ⚠️ | No reduced-motion guard on page flip |
| Invisible +0 | ✅ | Good dialog/toolbar a11y |
| Color split | ⚠️ | Hardcoded `#111`, gold focus `#c5a46e` — port từ grok repo, chưa DED-branded |
| Signature? | **Partial** | Có — nhưng buried trong detail page; không phải home-first moment |

**Verdict:** Flipbook là **utility port chất lượng cao**, chưa **luxury signature integrated**. Cần brand chrome (teal dark reader) + reduced-motion + optional home teaser để user *nhìn là thấy*.

---

## Roadmap ưu tiên (P0 → P2)

| P | Item | Effort | Impact perceived | Files |
|---|------|--------|------------------|-------|
| **P0** | Luxury empty/loading states (compare, legal, catalog filter) — shimmer skeleton thay plain `<p>` | S | Cao — user thấy ngay | `app/so-sanh/page.tsx`, `legal-page-client.tsx` |
| **P0** | Flipbook reduced-motion: disable page-flip animation when `prefers-reduced-motion` | S | Trung | `FlipbookEngine.tsx` |
| **P1** | Flipbook brand integration — swap `#111` chrome → teal-dark tokens từ CSS vars | M | Cao — signature moment on-brand | `globals.css`, `FlipbookToolbar.tsx`, `project-flipbook-viewer.tsx` |
| **P1** | Detail page editorial rhythm — section dividers, more whitespace, collapse legal below fold | M | Cao | `app/du-an/[slug]/page.tsx`, detail components |
| **P2** | Route continuity craft — shared header persistence feel, staggered content fade (not just wrapper opacity) | L | Trung | `app/template.tsx`, layout |
| **P2** | CI hook `luxury:qa:auto` on PR | S | Tooling | GitHub Actions |
| **P2** | Capture flipbook route in `capture.mjs` | S | Evidence | `scripts/luxury/capture.mjs` |

---

## Appendix

### Commands đã chạy

```bash
npm run dev                    # localhost:3000 (webpack)
PW_CHANNEL=chrome npm run luxury:capture
npm run luxury:score
```

### Screenshots (reports/assets/)

- `luxury-baseline-home-1440.png` (+ dark, 375)
- `luxury-baseline-detail-hh-1440.png` (+ 375)
- `luxury-baseline-so-sanh-1440.png` (+ 375)
- `luxury-baseline-phap-ly-1440.png` (+ dark, 375)
- `luxury-baseline-map-loading-1440.png`
- `luxury-baseline-prod-home-1440.png`
- `luxury-flipbook-open-1440.png` (browser manual)

### Artifacts cập nhật

- `reports/assets/luxury-baseline-findings.json` — capturedAt 2026-08-19
- `reports/assets/luxury-checklist-score.json` — LuxuryIndex 85, PerceivedLuxury 6.5, CompletionPct 72%

### Tooling note

Playwright headless shell download failed on network; capture chạy với `PW_CHANNEL=chrome`. `capture.mjs` patched hỗ trợ `PW_CHANNEL` / `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

---

*Audit-only wave — không implement redesign trong scope này.*
