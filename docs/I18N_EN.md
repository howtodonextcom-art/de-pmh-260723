# DED-PMH v0 — chiến lược locale VI ↔ EN

Ngày cập nhật: 2026-09-12

## 1. Nguồn sự thật

Cookie `NEXT_LOCALE` (`vi` | `en`), do `components/shared/locale-switcher.tsx` ghi và `i18n/request.ts` đọc. Không dùng `localStorage`, không dùng `app/[lang]/...`.

- Server Component: `getTranslations()` / `getLocale()` từ `next-intl/server`
- Client Component: `useTranslations()` / `useLocale()` từ `next-intl`
- Module thuần trong `vendor/library`: nhận `locale` tường minh; copy nằm ở `vendor/library/lib/i18n-copy.ts` (cấm import `/lib` cấp app). Unit test `lib/i18n-copy-parity.test.ts` bắt map vendor khớp `lib/i18n/{vi,en}.json`.

`<html lang>` lấy từ `getLocale()` trong `app/layout.tsx`. Metadata public dùng `generateMetadata()` + namespace `meta` / `passcode`.

Thiếu key EN → `deepMerge` fallback về tiếng Việt, không hiện key thô.

## 2. Hai tầng — đừng trộn

**UI chrome (đã nối i18n):** nav, footer, fact-grid labels, compare labels, FieldStatus badges, project status, legal group labels, gallery chrome, passcode, empty states, sort/filter, print button, CMDK.

**Nội dung nghiệp vụ:** tên / mô tả dự án dùng `displayNameEn` / `shortDescriptionEn` / `longDescriptionEn` khi locale = `en`, fallback VI nếu trống. CMS (`project-form.tsx`) đã có ô nhập 3 field này. Catalog hiện chưa có bản EN — fallback VI là đúng, không phải bug chrome.

Proper noun giữ nguyên: Phú Mỹ Hưng, DED-PMH, tên dự án khi chưa có `*En`, Bắc Ninh, TP.HCM.

## 3. Ngoài phạm vi (cố ý)

- CMS / login / lab: nhãn form tiếng Việt (công cụ nội bộ)
- `app/[lang]` route segment — không làm; portal nội bộ không cần SEO đa ngữ
- Dịch văn bản pháp lý / highlights / updates feed — dữ liệu CMS, không phải chrome

## 4. Passcode

`/passcode` có `LocaleSwitcher` trên chính trang đó (trang đầu khi gate bật). Copy nằm trong namespace `passcode`. Gate cookie HMAC không đổi. Residual: không rate-limit IP (cần KV); cửa sổ ẩn danh reset số lần thử.

## 5. Kiểm tra

- `npm run verify:i18n` — mọi `t("…")` resolve ở cả hai file (hiểu cả `useTranslations("ns")`)
- `vitest run` — parity JSON, vendor lockstep, number format, `*En` fallback
- `e2e/locale-switch.spec.ts` — cookie + chrome EN trên home / detail / passcode
