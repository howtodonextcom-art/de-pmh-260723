# DED-PMH v0 — `/en` locale strategy

Ngày cập nhật: 2026-07-21

## 1. Chiến lược đã chọn

**Client-side dual dictionary + toggle** (không dùng `app/[lang]/...` route segment). Lý do:

- Không cần route restructuring (`app/[lang]/du-an/[slug]/...`), tránh rủi ro phá vỡ 6 route hiện có trong một wave có nhiều hạng mục khác (R05/R06/R08/R10/R12) đang chạy song song.
- ~40% component trong `components/home/*` là **Server Component** (`explorer-preview.tsx`, `featured-cards.tsx`, `legal-teaser.tsx`, `updates.tsx`) — route-segment `[lang]` là lựa chọn đúng cho SEO đa ngôn ngữ đầy đủ, nhưng đòi hỏi prop-threading locale xuống toàn bộ cây Server Component; ngoài effort budget của wave này.
- Mô hình theo sát `next-themes` đã có sẵn trong repo (`ThemeProvider`) — cùng pattern hydration-safe (SSR mặc định, đồng bộ `localStorage` sau mount trong `useEffect`), dev/reviewer đã quen thuộc.

**Implementation:**
- `lib/i18n/vi.json` (nguồn cũ, không đổi cấu trúc) + `lib/i18n/en.json` (bản dịch đầy đủ theo cùng key path)
- `lib/i18n/locale-context.tsx`: `LocaleProvider` (Client Context, `localStorage` key `ded-pmh-locale`) + `useLocale()` trả về `{ locale, setLocale, t, messages }`
- `components/shared/locale-switcher.tsx`: nút VI/EN trong header (`site-header.tsx`)
- **Mặc định vẫn là `vi`** — `<html lang="vi">` không đổi, SSR luôn render tiếng Việt trước khi client đồng bộ locale đã lưu

## 2. Phạm vi phủ EN (trung thực — không phải toàn site)

`useLocale().t()` là **lenient/fallback** (khác `t()` tĩnh trong `lib/i18n/t.ts`, vẫn `throw` khi thiếu key — dùng cho phần chưa đổi): nếu thiếu key ở `en`, tự động fallback về `vi` + `console.warn` trong dev, không bao giờ crash UI.

### Đã locale-reactive (chuyển được vi ↔ en khi bấm switcher):

| Khu vực | File |
|---|---|
| Header: wordmark, nav links, nút tìm kiếm, switcher | `components/shared/site-header.tsx` |
| Header — dropdown "Dự án" (desktop) | `components/shared/project-nav-dropdown.tsx` (fix 2026-07-24, audit thương mại §II/§IV) |
| Header — mobile nav drawer (☰): tiêu đề, 3 nav item, nhãn "N dự án" | `components/shared/mobile-nav.tsx` (fix 2026-07-24, audit thương mại §II/§IV) |
| Header — nhãn trạng thái dự án ("Đang triển khai"/…) trong dropdown + drawer | `mobile-nav.tsx` + `project-nav-dropdown.tsx` (fix 2026-07-24, Wave-2 R5). Lưu ý kỹ thuật: `HeaderProject.status` đến từ `seed-adapter.ts` **đã pre-localize sang tiếng Việt** trước khi tới component, nên fix dịch ngược VI-label→key cục bộ tại 2 file này thay vì đổi contract dữ liệu dùng chung (tránh phá `/lab` DemoShell). |
| Home — Hero: kicker, tiêu đề animate, CTA Explore | `components/home/hero.tsx` |
| Home — StatStrip: 4 nhãn số liệu + footnote | `components/home/stat-strip.tsx` |

### CHƯA locale-reactive (vẫn tiếng Việt cố định — ghi rõ, không giấu):

- **Nội dung dữ liệu dự án** (`brandStatementVi`, tên dự án, mô tả...) — đây là dữ liệu nghiệp vụ lấy từ `vendor/data/`, không phải chuỗi UI chrome; dịch nội dung này cần review nghiệp vụ, ngoài phạm vi R07.
- **Status labels (hệ 5 nhãn minh bạch dữ liệu — SACRED, không đụng)**: `STATUS_LABEL` (`FieldStatus`: Đã có dữ liệu/Chưa xác thực/Mâu thuẫn/Chưa có dữ liệu/Bảo mật) trong `status-badge.tsx` — hardcode tiếng Việt, chưa qua `t()`. Đây **không phải** nhãn trạng thái dự án (đang triển khai/đang mở bán/...) đã fix ở bảng trên — hai hệ thống "STATUS_LABEL" khác tên trùng, khác mục đích.
- Toàn bộ route `/du-an`, `/du-an/[slug]`, `/so-sanh`, `/phap-ly`, `/lab` — vẫn dùng `t()` tĩnh (`lib/i18n/t.ts`), không đổi theo switcher.
- Bản đồ trang chủ (`region-map-canvas.tsx`, `vn-map.tsx`) — nhãn `mapUnit`/`mapLoading`/... vẫn dùng `t()` tĩnh.

**Kết luận trung thực:** switcher hoạt động thật (đổi state, lưu `localStorage`, không giả), phần Hero + StatStrip + header trên trang chủ hiển thị tiếng Anh thật khi bật EN — đủ để e2e assert ≥1 chuỗi EN trên `/`. Phần còn lại của site **vẫn tiếng Việt** dù bật switcher — đây là giới hạn phạm vi có chủ đích của wave này, không phải lỗi.

## 3. Mở rộng sau này (không nằm trong wave này)

Muốn phủ toàn site: (a) chuyển toàn bộ `t()` tĩnh sang `useLocale().t()` ở mọi Client Component, và (b) với Server Component, đọc locale qua cookie (`next/headers`) + truyền xuống qua props hoặc chuyển hẳn sang route segment `app/[lang]/...`. Cả hai đều là refactor rộng, nên tách thành prompt riêng nếu cần "100% EN" thay vì "EN switcher hoạt động thật, phủ trang chủ".
