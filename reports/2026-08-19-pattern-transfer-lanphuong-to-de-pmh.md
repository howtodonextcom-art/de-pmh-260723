# Pattern Transfer: 260812-lanphuong-namecard → de-pmh-260723

**Ngày audit:** 2026-08-19  
**Reference (read):** `C:\Code\2026\260812-lanphuong-namecard`  
**Target (upgrade):** `C:\Code\2026\de-pmh-260723`  
**Method:** Source-first cả hai repo; code evidence ưu tiên; docs không làm primary  
**Audit baseline:** luxury audit (PerceivedLuxury 6.5/10) + DD audit (maturity 62.5/100)

---

## 1. Executive summary

**Top 5 patterns đáng học ngay (evidence-backed):**

1. **`theme-init-script`** — một dòng inline script `beforeInteractive` chống FOUC hoàn toàn; de-pmh hiện dùng `next-themes` với `disableTransitionOnChange` nhưng vẫn có flash tiềm năng trên SSR lần đầu
2. **`CardGridSkeleton` / `.animate-skeleton`** — skeleton layout-matched (giữ zone dimensions, `rounded-sm` không `rounded-full`) thay `<p className="text-muted">` trong Suspense; impact trực tiếp vào PerceivedLuxury
3. **Token layer `accent-solid` / `accent-on-solid`** — cặp AA-pair riêng biệt cho primary button, giải quyết vấn đề contrast khi dùng accent làm background mà de-pmh chưa giải quyết
4. **`verify-i18n-keys.mjs`** — script kiểm tra tĩnh mọi `t("key")` call resolve đúng trong messages; de-pmh thiếu guard này, i18n orphan đã từng xuất hiện
5. **Pure lib vitest pattern** — `gallery-pagination.ts`, `normalize.ts`, `fuzzy-match.ts` đều pure functions không I/O, test được không cần React; de-pmh có `lib/legal-documents.ts`, `lib/motion/presets.ts` cùng pattern nhưng zero unit test

**Top 3 pattern KHÔNG PORT:**

1. Firebase/Firestore/Auth — domain incompatible, adds vendor lock-in
2. Algolia search + OCR rate limit — SaaS features, không có người dùng tương tác ở de-pmh
3. Gold/charcoal brand — namecard dùng `#c6a15b` gold trên `#131313` charcoal; de-pmh dùng oklch teal — rebrand là value destroyer

---

## 2. Reference repo snapshot (từ code, không README)

**Namecard là gì:** Firebase-backed SaaS để lưu và browse danh thiếp; auth Google + demo mode, Gemini OCR upload, Algolia search, next-intl bilingual (EN/zh-TW), dark/light theme, Firestore + Firebase Storage.

| Concern | Status |
|---------|--------|
| Routes | `app/page.tsx` (root redirect) + `app/[locale]/{page,login,upload,import,privacy}` |
| Auth | Firebase Auth — `src/lib/firebase-auth-server.ts` |
| Data | Firestore `src/lib/firestore.ts` — real-time reads |
| AI | Gemini Vision — `src/lib/gemini.ts`, `prompts/namecard.ts` |
| Search | Algolia `algoliasearch` |
| i18n | next-intl 4.x + `[locale]` routing |
| Theme | `data-theme` attribute + inline init script + `useSyncExternalStore` ThemeProvider |
| Design | "Archive Atelier" — `src/app/globals.css` (design tokens via CSS vars, Tailwind utilities) |
| Tests | Vitest (unit), Playwright (e2e), i18n verify script |

---

## 3. Pattern catalog (A1–A8)

### A1 — Design tokens

| Sub-pattern | Reference file | Mechanism | Quality | Transferable? |
|-------------|----------------|-----------|---------|---------------|
| Semantic vars `--bg/fg/accent` | `globals.css:1–100` | CSS vars per `data-theme`, bridged to Tailwind `@theme inline` | 5 | **YES** — mechanism; không copy color values |
| `accent-solid` / `accent-on-solid` AA pair | `globals.css:20–22` | Separate token cho filled buttons; accent-muted cho backgrounds | 5 | **YES** — add to de-pmh teal tokens |
| `--shadow-card` per theme | `globals.css:33,68` | Dark shadow `rgba(0,0,0,0.35)`, light `rgba(23,23,23,0.06)` | 4 | **YES** — de-pmh card hover currently uses Tailwind class |
| Token aliases `--charcoal/ivory/gold` | `globals.css:35–39` | Legacy compat layer | 3 | **NO** — PMH naming |
| `--radius-sm/md/pill` | `globals.css:96–98` | Scale với `2px/6px/9999px` | 3 | Partial — de-pmh dùng `0.5rem` fixed |

### A2 — Theme system

| Sub-pattern | Reference file | Mechanism | Quality | Transferable? |
|-------------|----------------|-----------|---------|---------------|
| `themeInitScript` — flash prevention | `src/lib/theme-init-script.ts:1–2` | 1-liner IIFE, localStorage read, `data-theme` write, `<Script strategy="beforeInteractive">` | 5 | **YES** |
| `useSyncExternalStore` ThemeProvider | `ThemeProvider.tsx:65` | External store + `applyTheme()` + `notifyThemeChange()` — zero re-render side effects | 5 | **ADAPT** — de-pmh đang dùng next-themes; evaluate swap |
| Server snapshot `"dark"` default | `ThemeProvider.tsx:60–62` | Server hydration mặc định dark tránh mismatch | 4 | **YES** — add server snapshot |
| `data-theme` attribute (không className) | `globals.css:4,43` | Tách khỏi Tailwind `dark:` variant, tránh conflict next-themes | 4 | **DEFER** — breaking change với Tailwind dark variant |

### A3 — Component primitives & CSS craft

| Sub-pattern | Reference file | Mechanism | Quality | Transferable? |
|-------------|----------------|-----------|---------|---------------|
| `.animate-skeleton` luxury loading | `globals.css:190–202` | `skeleton-pulse` keyframes với `--bg-muted` background | 5 | **YES** |
| `CardGridSkeleton` layout-matched | `CardGridSkeleton.tsx:6–37` | Mirrors zone dimensions (header/strip/footer); `aria-hidden` | 5 | **YES — core pattern** |
| `.nc-card` hover: `translateY(-1px)` + `shadow-card` | `globals.css:158–172` | Transition `border-color 180ms + transform + box-shadow` | 5 | **ADAPT** — de-pmh đã có card lift, nhưng shadow-card per-theme chưa |
| `@media prefers-reduced-motion` CSS block | `globals.css:204–222` | Global `animation-duration: 0.01ms !important` trên `*,*::before,*::after` | 5 | **YES** |
| `category-tabs-fade` mask-image | `globals.css:230–245` | Fade edge trên mobile cho horizontal scroll tabs | 4 | **YES** — de-pmh gallery tab `TabsList` có thể dùng |
| `::selection` styled | `globals.css:247–250` | `accent-muted` background cho text selection | 4 | **YES** |
| `.nc-btn-primary` no `background-color` transition | `globals.css:143–156` | Comment explains: CSS var change không restart transition; only `opacity: 0.88` hover | 5 | **YES** — giải thích bug hiện có thể có ở de-pmh |

### A4 — i18n

| Sub-pattern | Reference file | Mechanism | Quality | Transferable? |
|-------------|----------------|-----------|---------|---------------|
| next-intl `[locale]` routing | `src/app/[locale]/page.tsx:1` | Locale in URL, server + client unified via next-intl hooks | 5 | **DEFER** — migration effort L, breaking |
| `verify-i18n-keys.mjs` static scan | `scripts/verify-i18n-keys.mjs` | Scan source for `t("key")`, resolve trong messages JSON, báo lỗi nếu missing | 5 | **ADOPT** — port script cho vi.json/en.json |
| i18n key parity test | `src/lib/i18n.test.ts:20–35` | vitest: EN ↔ zh-TW exact key set match, no empty values | 5 | **ADOPT** — adapt cho vi ↔ en |

### A5 — Gallery / UX helpers

| Sub-pattern | Reference file | Mechanism | Quality | Transferable? |
|-------------|----------------|-----------|---------|---------------|
| `GalleryLoading` Suspense skeleton | `[locale]/page.tsx:42–48` | `<Suspense fallback={<GalleryLoading />}>` với `CardGridSkeleton` | 5 | **YES** |
| `GallerySearchUxState` state machine | `gallery-search-state.ts:1–27` | Enum: `idle/loading/results/empty/fallback/error` — pure resolver fn | 5 | **ADAPT** — de-pmh compare/legal có loading state |
| `categoryFacetCounts()` | `gallery-search-state.ts:29–37` | Pure: `cards[]` → `Record<string, number>` | 4 | **ADAPT** — de-pmh gallery tabs có thể dùng |
| `galleryHasMore / mergeCardPages / preferClientReveal` | `gallery-pagination.ts` | Pure pagination logic, zero I/O | 5 | **DEFER** — de-pmh static SSG, không paginate |
| Category tabs `facetCounts` badge | `CategoryTabs.tsx:30–55` | Count badge per tab; active state `bg-accent-muted text-accent` | 4 | **ADAPT** — de-pmh gallery tab thiếu count |
| `AlphabetNav` tokens không hardcode | `AlphabetNav.tsx:38–43` | Token-only (`accent-muted`, `border-strong`) thay hard-coded gold/ivory | 5 | **ADOPT** pattern |

### A6 — Testing discipline

| Sub-pattern | Reference file | Mechanism | Quality | Transferable? |
|-------------|----------------|-----------|---------|---------------|
| Pure lib isolation (testable without React) | `normalize.ts`, `fuzzy-match.ts`, `gallery-pagination.ts` | Pure functions exported từ lib — no DOM, no I/O | 5 | **ADOPT** pattern cho de-pmh libs |
| Vitest config | `vitest.config.mts` | Lightweight, fast | 4 | **ADOPT** |
| i18n parity test | `i18n.test.ts` | Structural key check | 5 | **ADOPT** |

### A7 — Data layer

| Pattern | Verdict | Reason |
|---------|---------|--------|
| Firestore repository | **REJECT** | Firebase vendor lock-in; de-pmh static JSON |
| `demo-storage` fallback | **NOTE ONLY** | Concept mirrors de-pmh mock-data pattern — already done |
| Storage cascade | **REJECT** | Namecard-specific |

### A8 — Auth / Admin

| Pattern | Verdict | Reason |
|---------|---------|--------|
| Firebase Auth RBAC | **DEFER** | Right direction for DD productization Phase 3 |
| `UserRole/PendingChange` types | Already exist in `vendor/library/types/project.ts` — **aligned** |

---

## 4. Gap mapping

| de-pmh gap (from audits) | Best namecard pattern | Fit | Effort |
|--------------------------|----------------------|-----|--------|
| Empty/loading utility (`<p className="text-muted">`) | `.animate-skeleton` + `CardGridSkeleton` | ✅ Direct | **S** |
| Suspense fallback trên compare/legal plain | `GalleryLoading` Suspense skeleton pattern | ✅ Direct | **S** |
| Flipbook `#111/#ededed` tách brand | `data-theme` token layer — map `var(--bg-reader)` | ✅ Adapt | **S** |
| Theme flash potential on SSR | `themeInitScript beforeInteractive` | ✅ Direct | **S** |
| `@media prefers-reduced-motion` inconsistent JS vs CSS | CSS global block | ✅ Direct | **S** |
| Gallery tabs `DetailGallery` thiếu fade edge mobile | `category-tabs-fade` mask-image | ✅ Direct | **S** |
| `::selection` unstyed | `::selection` accent-muted | ✅ Direct | **XS** |
| Split i18n server vi / client en | next-intl migration | ⚠️ Adapt | **L (breaking)** |
| No i18n key orphan guard | `verify-i18n-keys.mjs` | ✅ Port | **S** |
| Zero unit tests on pure libs | Vitest pure lib pattern | ✅ Adopt | **M** |
| Card hover shadow per-theme missing | `--shadow-card` CSS var | ✅ Adapt | **S** |
| Primary button AA gap (potential) | `accent-solid/on-solid` token pair | ✅ Adopt | **S** |
| Flipbook `FlipbookEngine` no reduced-motion | CSS global block covers it | ✅ Indirect fix | **S** |

---

## 5. Adopt / Adapt / Reject matrix

| Pattern | Decision | Evidence | PerceivedLuxury lift |
|---------|----------|----------|---------------------|
| `.animate-skeleton` CSS keyframes | **ADOPT** | `globals.css:190–202` → de-pmh `globals.css` | +0.5 (empty states) |
| Skeleton component pattern | **ADOPT** | `CardGridSkeleton.tsx` → `CompareTableSkeleton`, `LegalLoadingSkeleton` | +0.5 |
| `themeInitScript beforeInteractive` | **ADOPT** | `theme-init-script.ts` → de-pmh `app/layout.tsx` | +0.2 |
| `@media prefers-reduced-motion` CSS block | **ADOPT** | `globals.css:204–222` → de-pmh `globals.css` — covers FlipbookEngine | +0.3 |
| `category-tabs-fade` mask-image | **ADOPT** | `globals.css:230–245` → de-pmh gallery tabs | +0.2 |
| `::selection` accent-muted | **ADOPT** | 3 lines → de-pmh globals | +0.1 |
| `--shadow-card` per-theme token | **ADOPT** | `globals.css:33,68` → teal equivalent | +0.2 |
| `accent-solid` / `accent-on-solid` | **ADOPT** | `globals.css:20–22` → teal-dark pair | +0.1 (correctness) |
| `verify-i18n-keys.mjs` | **ADOPT** | Port script → `scripts/verify-i18n-keys.mjs` de-pmh | 0 UX, +integrity |
| i18n parity vitest | **ADOPT** | `i18n.test.ts` → adapt for vi/en | 0 UX, +stability |
| Pure lib vitest | **ADOPT** | Pattern → `legal-documents.ts`, `motion/presets.ts` | 0 UX, +confidence |
| Flipbook token integration | **ADAPT** | Map `#111` → `var(--bg-reader, #111)` CSS var from teal-dark token | +0.5 (brand) |
| GallerySearchUxState | **ADAPT** | State machine → `compare-table` loading state | +0.2 |
| next-intl migration | **DEFER** | Breaking, effort L; fix split-brain gently first | +0 now |
| `useSyncExternalStore` ThemeProvider | **DEFER** | next-themes already works; migrate later | +0 now |
| `data-theme` attribute system | **DEFER** | Breaking vs Tailwind `dark:` variant | +0 now |
| Firebase / OCR / Algolia | **REJECT** | Domain / stack incompatible | — |
| Gold/charcoal brand | **REJECT** | Brand value destroyer for de-pmh | — |
| Firestore data layer | **REJECT** | Replaces static JSON vendor lock-in | — |

---

## 6. PerceivedLuxury impact forecast

| Wave | Patterns | Current 6.5/10 → |
|------|----------|------------------|
| Wave 1 (S items only) | skeleton, theme-init, reduced-motion CSS, tabs-fade, selection, shadow-card | **→ ~7.2–7.5/10** |
| Wave 1 + flipbook brand | + flipbook token integration | **→ ~7.5–8.0/10** |
| Wave 2 + i18n fix + vitest | Unified i18n, script parity | **→ ~8.0/10** (unchanged UX, more stable) |

**LuxuryIndex automation gate** likely moves: 85 → 87–88 sau Wave 1 (skeleton fixes `emptyLuxury` fail + motion improvement).

---

## 7. Valuation impact forecast

| Wave | Commercial maturity | Δ valuation est. |
|------|--------------------|-----------------:|
| Wave 1 (quick wins) | 62.5 → ~65/100 | +$1k–3k fair market |
| Wave 2 (i18n + tests) | 65 → ~68/100 | +$2k–4k |

Wave 1 alone không đổi tier — cần CMS/multi-project cho jump lớn ($25k+). Nhưng Wave 1 **giảm friction buyer** khi demo.

---

## 8. Wave 1–3 roadmap

### Wave 1 — Quick wins, effort S, ~3–5 ngày

**Tất cả items dưới đây: không đổi architecture, không breaking, chạy qua typecheck + luxury:capture sau.**

| # | Item | Files thay đổi | Risk |
|---|------|----------------|------|
| 1.1 | Thêm `.animate-skeleton` keyframe vào `globals.css` | `app/globals.css` | None |
| 1.2 | Tạo `CompareTableSkeleton` thay `<p>` trong Suspense | `app/so-sanh/page.tsx`, new `components/project/compare-table-skeleton.tsx` | Low |
| 1.3 | Tạo `LegalLoadingSkeleton` thay `<p>` trong Suspense | `components/project/legal-page-client.tsx:257` | Low |
| 1.4 | Thêm `themeInitScript` `beforeInteractive` vào root layout | `app/layout.tsx`, new `lib/theme-init-script.ts` | Low |
| 1.5 | `@media prefers-reduced-motion` global CSS block | `app/globals.css` — covers FlipbookEngine gap | None |
| 1.6 | `category-tabs-fade` mask-image cho gallery tabs | `app/globals.css`, `components/project/detail/gallery.tsx` | None |
| 1.7 | `::selection` accent-muted styling | `app/globals.css` | None |
| 1.8 | `--shadow-card` per-theme token + ProjectCard adapt | `app/globals.css`, `components/project/project-card.tsx` | Low |
| 1.9 | Flipbook `#111` → CSS var `--bg-reader: #111` (+ dark token) | `app/globals.css`, `components/project/detail/project-flipbook-viewer.tsx`, `FlipbookToolbar.tsx` | Low |
| 1.10 | `accent-solid` / `accent-on-solid` teal AA pair | `app/globals.css` | None |
| 1.11 | Port `verify-i18n-keys.mjs` script | `scripts/verify-i18n-keys.mjs`, `package.json` | None |

### Wave 2 — Structural, effort M, ~2 tuần

| # | Item | Effort |
|---|------|--------|
| 2.1 | Vitest + pure lib tests (`legal-documents.ts`, `motion/presets.ts`, `gallery-pagination`-style helpers) | M |
| 2.2 | i18n parity test (`lib/i18n.test.ts` pattern) | S |
| 2.3 | Fix split-brain i18n WITHOUT next-intl: server reads `Accept-Language` header / cookie → render correct strings | M |
| 2.4 | `GallerySearchUxState`-style state machine cho compare loading | S |
| 2.5 | Gallery tab count badges | S |

### Wave 3 — Platform (đã doc trong DD report)

CMS, multi-project, admin — không liên quan pattern namecard.

---

## 9. Implementation spec — Wave 1 (no code yet)

### 1.1 + 1.5 + 1.6 + 1.7 + 1.8 + 1.10 — `app/globals.css`

**Thêm vào cuối file:**

```css
/* ── Luxury skeleton animation ── */
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.45; }
  50%       { opacity: 0.85; }
}
.animate-skeleton {
  animation: skeleton-pulse 1.4s ease-in-out infinite;
  background: var(--color-muted);
}

/* ── Reduced-motion hard override (covers FlipbookEngine, kenBurns, etc.) ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ── Gallery tab horizontal scroll fade (mobile) ── */
.tabs-scroll-fade {
  mask-image: linear-gradient(to right, transparent, #000 12px, #000 calc(100% - 12px), transparent);
}
@media (min-width: 640px) {
  .tabs-scroll-fade { mask-image: none; }
}

/* ── Text selection ── */
::selection {
  background: oklch(0.36 0.072 165 / 0.15);
  color: var(--foreground);
}

/* ── Per-theme card shadow (teal) ── */
:root { --shadow-card: 0 8px 24px oklch(0.36 0.072 165 / 0.08); }
.dark { --shadow-card: 0 8px 32px oklch(0 0 0 / 0.35); }

/* ── Flipbook reader background token ── */
:root, .dark { --bg-reader: #111111; }

/* ── Teal primary button AA pair ── */
:root {
  --primary-solid: oklch(0.36 0.072 165);
  --primary-on-solid: oklch(0.98 0.006 165);
}
.dark {
  --primary-solid: oklch(0.62 0.072 165);
  --primary-on-solid: oklch(0.12 0.018 165);
}
```

### 1.2 — `components/project/compare-table-skeleton.tsx` (new)

```tsx
export function CompareTableSkeleton() {
  return (
    <div className="space-y-3 py-8" aria-hidden="true">
      <div className="animate-skeleton h-8 w-full rounded-lg" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-skeleton h-14 w-full rounded-lg" style={{ opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  );
}
```

**`app/so-sanh/page.tsx:37`** — thay `fallback={<p ...>}` → `fallback={<CompareTableSkeleton />}`.

### 1.3 — `components/project/legal-loading-skeleton.tsx` (new)

Tương tự — 3–4 row stubs thay `<p className="text-sm text-muted-foreground">`.

### 1.4 — `app/layout.tsx` + `lib/theme-init-script.ts` (new)

```ts
// lib/theme-init-script.ts
export const themeInitScript = `(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.classList.toggle('dark', t === 'dark');
  } catch(e) {}
})();`;
```

`app/layout.tsx` — thêm `<Script id="theme-init" strategy="beforeInteractive">{themeInitScript}</Script>`.

> **Lưu ý:** de-pmh dùng next-themes với class strategy (`attribute="class"`), key là `theme`, và classList `.dark` — khác namecard `data-theme`. Script phải dùng `.dark` class để sync.

### 1.9 — Flipbook token integration

`FlipbookContainer.tsx` / `project-flipbook-viewer.tsx` thay hardcoded `bg-[#111111]` → `bg-[var(--bg-reader)]`.  
`FlipbookToolbar.tsx` thay `text-[#ededed]` → `text-[var(--fg)]` (hoặc teal-adjusted var).

---

## 10. What NOT to port

| Feature | Lý do reject |
|---------|-------------|
| Firebase / Firestore / Auth | Vendor lock-in; không có user model ở de-pmh |
| Gemini OCR upload | Domain khác hoàn toàn |
| Algolia search | SaaS cost + no user query need |
| next-intl `[locale]` routing | Breaking change, effort L; wait for productization wave |
| `data-theme` attribute system | Conflicts với next-themes `dark` class; migration effort không xứng |
| Gold/charcoal color scheme | Namecard brand — thay bằng sẽ destroy teal PMH identity |
| `useSyncExternalStore` ThemeProvider | next-themes đủ tốt; swap adds risk without clear gain |
| Firestore pagination `mergeCardPages` | Static SSG site, không cần runtime pagination |
| Firebase Storage | De-pmh dùng static manifest + image mirror |

---

## 11. Trả lời câu hỏi bắt buộc

**1. Namecard thực sự là gì:** Firebase-backed SaaS bilingual namecard CRM — auth, upload, OCR, search, Firestore. Khác domain hoàn toàn với de-pmh.

**2. Top 5 pattern nên học ngay:**
`.animate-skeleton`, `themeInitScript`, `@media prefers-reduced-motion` CSS block, `category-tabs-fade`, `verify-i18n-keys.mjs`

**3. Top 5 tuyệt đối không port:**
Firebase, OCR, Algolia, gold rebrand, next-intl (chưa)

**4. PerceivedLuxury sau Wave 1:** 6.5 → **~7.3–7.5/10** (+0.8–1.0 từ skeleton luxury, flipbook brand, motion CSS)

**5. Wave 1 trong 1 tuần:** **Có** — 11 items nhỏ, không đổi architecture, tất cả effort S; test plan: `npm run typecheck` + `npm run luxury:capture` + e2e spot-check

**6. next-intl hay fix split-brain:** **Fix split-brain nhẹ trước** — đọc locale từ cookie/header trên server để render đúng locale, giữ nguyên `locale-context` client. next-intl chỉ khi có productization budget đầy đủ.

**7. Flipbook on-brand teal-dark:** **Có thể** và đã spec (Wave 1.9) — thêm `--bg-reader` CSS var trong dark token, thay hardcoded `#111` trong `project-flipbook-viewer.tsx` và `FlipbookToolbar.tsx`. Không cần rebuild flipbook logic.

---

## Appendix — Evidence paths

| Claim | File:line |
|-------|-----------|
| `themeInitScript` inline | `260812-lanphuong-namecard/src/lib/theme-init-script.ts:2` |
| `ThemeProvider useSyncExternalStore` | `src/components/theme/ThemeProvider.tsx:65` |
| `.animate-skeleton` keyframes | `src/app/globals.css:190–202` |
| `CardGridSkeleton` layout-matched | `src/components/cards/CardGridSkeleton.tsx:6–37` |
| `category-tabs-fade` | `globals.css:230–245` |
| `@media prefers-reduced-motion` block | `globals.css:204–222` |
| `verify-i18n-keys.mjs` | `scripts/verify-i18n-keys.mjs:1–95` |
| i18n parity test | `src/lib/i18n.test.ts:20–35` |
| `GallerySearchUxState` | `src/lib/gallery-search-state.ts:1–27` |
| de-pmh compare plain Suspense | `de-pmh-260723/app/so-sanh/page.tsx:37` |
| de-pmh legal plain Suspense | `components/project/legal-page-client.tsx:257` |
| Flipbook hardcoded `#111` | `components/project/detail/project-flipbook-viewer.tsx:44` |
| FlipbookToolbar `#ededed` | `components/flipbook/FlipbookToolbar.tsx:40–47` |

*Audit-only wave — no code changes made.*
