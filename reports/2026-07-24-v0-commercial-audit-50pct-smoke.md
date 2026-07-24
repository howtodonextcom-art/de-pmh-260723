# DED-PMH v0 — Commercial Audit Closure (Wave: Implement 50%+)

Ngày: 2026-07-24
Prompt: `prompts/2026-07-24-claude-v0-commercial-audit-50pct-6agents-mcp.md`
Source audit: `reports/2026-07-23-10-22-audit-thuong-mai-ded-pmh-v0.md`
Prior closures credited (không redo): `reports/2026-07-24-v0-ia-so-sanh-du-an-dedupe.md`, `reports/2026-07-24-v0-indep-eval-browser-first.md`

## 1. Executive

**Đóng 100/100 trọng số audit §V trong wave này (mục tiêu ≥50).**

Tất cả 8 hạng mục W1–W8 đạt PASS. W1/W4/W5/W6 đã đóng từ các wave trước (2026-07-23/24) và được verify lại tại đây (không làm lại). W2/W3/W7 là implement mới trong wave này. Ngoài phạm vi wave này (Wave-2, dời có chủ đích): pipeline tự tải-về-lưu-trữ toàn bộ ảnh, page-route transition, gallery virtualization, phủ `onError` fallback cho toàn bộ surface ảnh (mới phủ hero + gallery detail).

## 2. Phương pháp + MCP path

- **Evidence A (chính):** Cursor Playwright MCP (`mcp__playwright__*`) — navigate, evaluate, hover, screenshot, console — trên `http://localhost:3000` (`next dev --webpack`).
- **Evidence B (fallback):** không cần dùng — MCP hoạt động ổn định suốt wave, không có lần nào phải rơi về `scripts/commercial-50-*.mjs`.
- **MCP = OK** (không CONDITIONAL).
- Prod spot-check: `https://de-division-pmh.vercel.app/` (W1 only).

## 3. W1–W8 — bảng PASS/FAIL + evidence

| ID | Việc | Trọng số | Kết quả | Bằng chứng |
|----|------|----------|---------|------------|
| W1 | Prod deploy parity (Fraunces + footer, no stale Transparency) | 15 | **PASS** (verify-only, không đổi code) | MCP evaluate trên prod: `h1 font-family` bắt đầu `Fraunces`; `document.querySelector('footer')` tồn tại; `--radius: .5rem`. Không deploy/push trong wave này (human-gated). |
| W2 | Brand `not-found.tsx` + `error.tsx` | 15 | **PASS** (implement) | `app/not-found.tsx` (mới), `app/error.tsx` (mới). Live: `/du-an/khong-ton-tai-123` → HTTP 404, title "404 — DED-PMH", SiteHeader + CTA "Về trang chủ"/"Xem danh mục dự án". `error.tsx` verify bằng route throw tạm thời (đã xoá sau test) → branded chrome + "Thử lại"/"Về trang chủ", locale-reactive (VI/EN xác nhận cả 2). PNG: `commercial-50-notfound-after.png`, `commercial-50-errorboundary-after.png`. |
| W3 | Mobile drawer + desktop "Dự án" dropdown locale-reactive EN | 10 | **PASS** (implement) | `components/shared/mobile-nav.tsx` + `components/shared/project-nav-dropdown.tsx`: hardcode VI → `useLocale().t()`. Live EN: dropdown "Projects", drawer "Navigation / Projects / Compare / Legal / 4 PROJECTS". `docs/I18N_EN.md` cập nhật honesty. PNG: `commercial-50-nav-en-mobile-after.png`, `commercial-50-nav-en-desktop-dropdown-after.png`. |
| W4 | Project card hover lift + shadow | 8 | **PASS** (verify, không cần fix) | Code: `project-card.tsx` đã có `motion-safe:hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10` (từ wave luxury 2026-07-23). |
| W5 | IA `/so-sanh` vs `/du-an?xem=bang` single source | 10 | **PASS** (verify, không redo) | Code: `project-explorer.tsx` không còn import `CompareTable` (grep 0 hit). Đã đóng trong `reports/2026-07-24-v0-ia-so-sanh-du-an-dedupe.md`. |
| W6 | Map/list loading shimmer | 7 | **PASS** (verify, không cần fix) | Code: `.animate-shimmer-sweep` có mặt cả `vn-map.tsx` và `region-map-canvas.tsx`. |
| W7 | Image Phase-1 risk cut | 20 | **PASS** (implement minimal) | `next.config.mjs` đã allowlist `honghacphumyhung.vn`/`phumyhung.vn`/`unsplash` từ trước (không đổi). Mới: `components/shared/image-with-fallback.tsx` — wrap `next/image` với `onError` → placeholder nội bộ (icon + gradient), áp dụng cho **hero chi tiết dự án** (`detail/hero.tsx`) + **gallery** (`detail/gallery.tsx`: tile lưới, lightbox ảnh chính, dải thumbnail) — đây là 2 surface có mật độ ảnh cao nhất (audit: 46/46 ảnh hotlink trên trang Hồng Hạc City, phần lớn nằm ở gallery). Verify: dispatch synthetic `error` event lên `<img>` hotlink thật → fallback UI render đúng (PNG `commercial-50-image-fallback-after.png`). |
| W8 | Smoke report + tsc/e2e gate + PNGs | 15 | **PASS** | Xem §6. |

**Tổng PASS = 15+15+10+8+10+7+20+15 = 100/100.**

## 4. CLAIM audit vs LIVE

| Claim audit (2026-07-23) | LIVE 2026-07-24 sau wave | Verdict |
|---|---|---|
| Next.js default 404, không thương hiệu | Branded 404 + error boundary, SiteHeader + CTA | **FIXED** |
| Menu mobile (☰) không đổi EN dù bật switcher | Drawer đầy đủ EN: Navigation/Projects/Compare/Legal/N projects | **FIXED** |
| Dropdown "Dự án" desktop không dịch | "Projects" khi bật EN | **FIXED** |
| 100% ảnh hotlink, không qua `next/image`, không fallback | Đã qua `next/image` từ trước (remotePatterns có sẵn); **mới**: `onError` → placeholder cho hero + gallery. Card/masterplan/amenities/location/nav-thumb **vẫn hotlink không fallback** — residual, ghi rõ ở §6. | **PARTIAL FIX (Phase-1)** — không claim "đã self-host" |
| Bản live tụt hậu (Inter, không footer) | Prod hiện tại: Fraunces + footer + radius 0.5rem | **REJECT (stale)** — đã deploy trước wave này, verify lại đúng |
| `/so-sanh` vs `/du-an?xem=bang` mơ hồ | Đã dedupe wave trước, verify lại: 0 `CompareTable` trên `/du-an` | **REJECT (stale, đã fix)** |

## 5. Diff summary (files)

```text
app/not-found.tsx                          (mới)
app/error.tsx                               (mới)
app/du-an/[slug]/page.tsx                    (1 dòng — generateMetadata title khi 404, cần để not-found.tsx branded title thắng thay vì fallback root)
components/shared/mobile-nav.tsx             (hardcode VI → t())
components/shared/project-nav-dropdown.tsx   (hardcode VI → t())
components/shared/image-with-fallback.tsx    (mới — onError wrapper cho next/image)
components/project/detail/hero.tsx           (Image → ImageWithFallback)
components/project/detail/gallery.tsx        (Image → ImageWithFallback ×3: tile, lightbox, thumbnail strip)
lib/i18n/vi.json, lib/i18n/en.json           (keys: notFound.*, errorPage.*, nav.menuLabel/duAn/projectsUnit/viewAllFilters/openMenu)
docs/I18N_EN.md                              (honesty update — dropdown/drawer nay đã locale-reactive)
e2e/commercial-50.spec.ts                    (mới — 3 test: 404 branded, dropdown EN, drawer EN)
reports/assets/commercial-50-*.png           (6 files)
```

## 6. Wave-2 backlog (ngoài phạm vi wave này, dời có chủ đích)

1. **Full image self-host pipeline** — tải toàn bộ ảnh `honghacphumyhung.vn` về Storage riêng, loại hoàn toàn phụ thuộc bên thứ ba (2–4h, đúng như audit ước tính).
2. **Mở rộng `ImageWithFallback`** sang `masterplan.tsx`, `amenities.tsx`, `location.tsx`, `project-card.tsx`, `mobile-nav.tsx`/`project-nav-dropdown.tsx` thumbnail — hiện các surface này vẫn hotlink không có fallback, chỉ hero+gallery detail được phủ trong wave này.
3. **Page-route transitions** (Framer Motion có sẵn, chưa dùng cấp-route).
4. **Gallery virtualization** cho trang chi tiết dài (~9.250px, 25+ ảnh không phân trang).
5. **Hợp nhất 2 cơ chế i18n** (`useLocale().t()` reactive vs. `t()` tĩnh) nếu mở rộng EN ra toàn site — hiện tại `STATUS_LABEL` trong `mobile-nav.tsx`/`project-nav-dropdown.tsx` vẫn hardcode VI (ngoài phạm vi audit §II/§IV, không đổi trong wave này).

## 7. AC table

| ID | Kết quả |
|----|---------|
| AC1 Agent A inventory table trước khi sửa code | **PASS** — §3 dựng từ browser check trước khi implement |
| AC2 Weight sum PASS ≥50/100, minh bạch | **PASS** — 100/100, xem §3 |
| AC3 Branded `/du-an/…` unknown slug (không stock Next 404) | **PASS** — HTTP 404 + SiteHeader + CTA, title "404 — DED-PMH" |
| AC4 EN: mobile drawer + dropdown dịch | **PASS** — cả 2 xác nhận live |
| AC5 Image Phase-1 landed, honest residual | **PASS** — §3 W7, §6 mục 2 nêu rõ surface chưa phủ |
| AC6 tsc 0; e2e xanh cho surface đã sửa; không regress compare@375/home compare CTA | **PASS** — `tsc --noEmit` 0 lỗi; e2e full suite `--workers=1` (warm server) **31/31 PASS** kể cả 3 test mới + `regression.spec.ts` (compare@375, IA redirect) không regress. Lưu ý: chạy `fullyParallel` mặc định (nhiều worker) trên dev server cold/dưới tải cho kết quả timeout rải rác không tái lập ở nhiều file không liên quan (home/map/pdf) — artefact dev-server-under-load đã ghi nhận nhiều lần trong các wave trước, không phải regression thật; xác nhận bằng run cô lập (`e2e/commercial-50.spec.ts` riêng: 3/3) và run `--workers=1` toàn bộ: 31/31 xanh. |
| AC7 Sacred list còn nguyên (StatusBadge, CMDK, lightbox, bridge) | **PASS** — không đổi các file này; lightbox chỉ đổi `Image`→`ImageWithFallback` (cùng props, cùng hành vi khi ảnh load OK) |
| AC8 Smoke path đúng | **PASS** — `reports/2026-07-24-v0-commercial-audit-50pct-smoke.md` |
| AC9 Không commit/push; không lấn Wave-2 | **PASS** — chưa commit/push; Wave-2 liệt kê rõ ở §6, không implement |
| AC10 Câu executive N/100 | **PASS** — §1 |

**Scorecard: PASS (AC1–AC10 đều đạt).**
