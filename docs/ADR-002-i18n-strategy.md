# ADR-002 — Chiến lược mở rộng đa ngôn ngữ (i18n) sang nội dung nghiệp vụ

Ngày: 2026-09-11
Trạng thái: **Đã đảo ngược khuyến nghị — người dùng chọn Phương án C (đổi sang next-intl), đã triển khai cùng ngày.**

**Cập nhật 2026-09-12:** Phase 0 (ô CMS `displayNameEn` / `shortDescriptionEn` / `longDescriptionEn` + UI đọc `*En` khi locale = `en`, fallback VI) **đã làm**. Phase 1 UI chrome public-facing (fact-grid, compare, FieldStatus, project status, legal groups, passcode, metadata) **đã nối vào next-intl**. Xem `docs/I18N_EN.md` và CLAUDE.md Round 9.

**Cập nhật:** ADR này ban đầu khuyến nghị D→A (không đổi thư viện). Người dùng quyết định chọn **C** — lý do hợp lý và đã được xác nhận đúng khi triển khai: next-intl giải quyết ĐÚNG root cause (Server Component không dùng được React Context) bằng cơ chế `getTranslations()` đọc locale qua request/cookie ở tầng server, không cần Context — đây là fix kiến trúc sạch hơn "Option A" (thread props thủ công) mà ADR gốc đề xuất. Xem CLAUDE.md Round 7 để biết chi tiết triển khai và bằng chứng test.

## Bối cảnh

`docs/I18N_EN.md` (2026-07-21) đã ghi nhận trung thực: switcher VI/EN hiện chỉ đổi ngôn ngữ thật ở header, nav, và Home Hero/StatStrip. Toàn bộ `/du-an/[slug]`, `/so-sanh`, `/phap-ly`, `/lab` — tức phần nội dung chính của sản phẩm — vẫn 100% tiếng Việt dù bật EN.

**Nguyên nhân gốc:** 2 cơ chế i18n song song trong repo:
- `useLocale().t()` — reactive theo Context, chỉ dùng được trong Client Component
- `t()` tĩnh (`lib/i18n/t.ts`) — luôn đọc `vi.json`, dùng ở Server Component (không dùng được React Context)

Trang chi tiết dự án (`app/du-an/[slug]/page.tsx` và toàn bộ `components/project/detail/*.tsx`) là Server Component — đây chính là phần bị kẹt.

## Bằng chứng bổ sung phát hiện khi nghiên cứu ADR này

1. **`displayNameEn`, `shortDescriptionEn`, `longDescriptionEn` đã tồn tại trong `Project` type** (`vendor/library/types/project.ts` dòng 68, 103, 105) — nhưng grep toàn repo cho thấy **3 field này chỉ xuất hiện ở chính type definition và `lib/cms/empty-project.ts`** (khởi tạo `null` khi tạo dự án mới). Không nơi nào trong `components/project/detail/*.tsx` đọc các field này theo locale, và **`components/cms/project-form.tsx` không có ô nhập nào cho 3 field này** — người biên tập nội dung hiện không có cách nào nhập bản tiếng Anh dù schema đã hỗ trợ.
2. **Không có thư viện i18n nào là dependency** (`next-intl`, `i18next`, `react-intl` đều không có trong `package.json`) — hệ thống hiện tại 100% tự viết.
3. **Next.js 16.2.6** — đã đổi `middleware.ts` → `proxy.ts` (gặp phải và đã sửa ở Round 5, xem CLAUDE.md). Nếu chọn route-segment `[lang]`, cần định tuyến qua `proxy.ts` hiện có, không phải file `middleware.ts` cũ trong tài liệu Next.js phổ biến.
4. **Đây là công cụ nội bộ**, không phải sản phẩm public cần SEO đa ngôn ngữ — footer ghi rõ "Internal portal for looking up Phú Mỹ Hưng project data". Điều này làm giảm đáng kể giá trị của lợi ích chính mà route-segment `[lang]` mang lại (SEO, URL sạch theo ngôn ngữ cho search engine).
5. Quy mô hiện tại: 12 dự án, ~180 key i18n. Đây là quy mô nhỏ — một số phương án (đổi thư viện, route-segment đầy đủ) tối ưu cho quy mô lớn hơn nhiều.

## Các phương án

| # | Phương án | Effort | Phá vỡ 12 trang hiện có? | Cần dịch lại Firestore? | Phù hợp nếu mục tiêu là |
|---|---|---|---|---|---|
| **A** | Mở rộng cách hiện tại — Server Component đọc locale qua cookie (`next/headers`), truyền props xuống thay `t()` tĩnh | Vừa | Không (thay dần từng file) | Không (chỉ UI chrome) | Đóng nợ UI chrome (label, nút, tab) mà không đổi kiến trúc |
| **B** | Route-segment đầy đủ `app/[lang]/...` | Lớn | **Có** — restructure toàn bộ 6 route | Không bắt buộc nhưng nên làm cùng lúc | SEO quốc tế, sản phẩm public đa ngôn ngữ thật sự |
| **C** | Đổi sang thư viện chuẩn (next-intl...) thay hệ tự viết | Vừa-Lớn | Không trực tiếp, nhưng phải viết lại toàn bộ điểm gọi `t()`/`useLocale()` | Không | Dự án sẽ mở rộng quy mô lớn (nhiều ngôn ngữ hơn 2, nhiều dev hơn) |
| **D** | Migrate tăng dần theo trang, ưu tiên giá trị cao trước | Nhỏ→Vừa (chia nhỏ được) | Không | Có, cho phần nội dung ưu tiên | Muốn thấy kết quả nhanh, ngân sách effort hạn chế |
| **E** | Thu hẹp lời hứa — EN chỉ là UI chrome, nội dung nghiệp vụ công khai là tiếng Việt, ghi rõ giới hạn thay vì cố dịch | Rất nhỏ (chỉ cập nhật docs + UI thông báo) | Không | Không | Không có nhu cầu thật từ khách nước ngoài, tránh nợ kỹ thuật không cần thiết |

## Khuyến nghị

**Kết hợp D (Phase 0) → A (Phase 1)**, KHÔNG chọn B hoặc C ở thời điểm hiện tại.

### Phase 0 — "Quick win" gần như miễn phí (ưu tiên làm trước)
Wiring 3 field đã có sẵn trong schema nhưng chưa dùng: thêm ô nhập `displayNameEn`/`shortDescriptionEn`/`longDescriptionEn` vào `project-form.tsx`, và sửa `hero.tsx`/`story.tsx` đọc field `*En` khi `locale === "en"` (fallback về bản Vi nếu chưa nhập — đúng tinh thần "lenient fallback" đã có ở `useLocale().t()`). Đây là phần **giá trị cao nhất** (tên dự án + mô tả là thứ người dùng đọc đầu tiên) với effort thấp nhất vì schema đã tồn tại — không cần đổi kiến trúc gì.

### Phase 1 — Đóng nợ UI chrome còn lại (Option A)
Với các label cố định (không phải dữ liệu per-project) như "Vị trí", "Loại hình", tab Gallery, nhãn Hồ sơ pháp lý — đây là tập hữu hạn, dịch 1 lần là xong. Thread locale từ cookie xuống qua props cho các Server Component còn lại, thay `t()` tĩnh dần dần, không cần đổi hết 1 lần.

### Vì sao KHÔNG chọn B (route-segment) hoặc C (đổi thư viện) lúc này
- B tốn effort lớn nhất nhưng lợi ích chính (SEO) gần như vô nghĩa cho 1 **công cụ nội bộ**. `docs/I18N_EN.md` đã defer B từ 2026-07-21 với đúng lý do này — chưa có gì thay đổi để đảo ngược quyết định đó.
- C giải quyết vấn đề mà repo này chưa gặp phải (quản lý nhiều ngôn ngữ, nhiều người dịch, tách file theo namespace) — ở quy mô 180 key/2 ngôn ngữ, hệ tự viết vẫn đủ dùng; đổi thư viện lúc này là effort đổi lấy rủi ro, không đổi lấy giá trị tương xứng.

## Điều kiện tái mở B hoặc C

- **B (route-segment):** khi có yêu cầu tường minh cần SEO đa ngôn ngữ thật (vd sản phẩm chuyển từ nội bộ sang public-facing cho nhà đầu tư/khách quốc tế), hoặc số route công khai tăng đáng kể khiến việc thread props thủ công (Phase 1) trở nên cồng kềnh.
- **C (đổi thư viện):** khi thêm ngôn ngữ thứ 3 trở lên, hoặc số người tham gia dịch thuật tăng đến mức cần quy trình quản lý bản dịch chuyên nghiệp (translation management platform tích hợp next-intl/i18next).

Nếu không điều kiện nào xảy ra, giữ nguyên khuyến nghị D→A vô thời hạn.

## Hệ quả

- Không đổi kiến trúc route hiện có (6 route giữ nguyên, không thêm `[lang]` segment)
- Không thêm dependency mới
- CMS (`project-form.tsx`) cần thêm 3 field nhập liệu (Phase 0) — người biên tập nội dung cần được thông báo về field mới
- `docs/I18N_EN.md` cần cập nhật để trỏ về ADR này thay vì chỉ tự ghi nhận giới hạn, tương tự cách `WHAT_YOU_BUY.md` trỏ về ADR-001
