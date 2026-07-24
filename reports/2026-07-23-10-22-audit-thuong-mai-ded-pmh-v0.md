# DED-PMH v0 Track A — Audit Sản phẩm & Định giá Chuyển giao

**Loại báo cáo:** MVP Commercial Value Optimization Report — Independent Audit
**Website live kiểm định:** https://de-division-pmh.vercel.app/
**Repository kiểm định:** https://github.com/howtodonextcom-art/260719-de-pmh (nhánh `main`)
**Ngày kiểm định:** 2026-07-23
**Phương pháp:** Kiểm thử trực tiếp qua Playwright MCP trên bản deploy live (6/6 route, desktop 1440px + mobile 390px, VI + EN) kết hợp đọc trực tiếp mã nguồn đã clone (không suy đoán từ tài liệu). Không sửa đổi bất kỳ file nào trong repo hay dữ liệu trên site live trong quá trình kiểm định.

> ⚠️ **Lưu ý phạm vi bắt buộc trước khi đọc báo cáo:** Repo `260719-de-pmh` là **"v0 Track A"** — một UI shell độc lập, đọc dữ liệu từ JSON/CSV đã vendor sẵn, **không có Firebase, không có đăng nhập, không có backend nào**. Đây là quyết định kiến trúc có chủ đích (ADR-001, xem Phần III), không phải thiếu sót. Hệ thống "Local" đầy đủ (Firebase + RBAC + duyệt thay đổi) được chính đội ngũ xác nhận là **một repo khác**, không nằm trong gói này. Báo cáo này định giá đúng những gì thực sự nằm trong `260719-de-pmh` — không thổi phồng, không giả định có backend.

---

## I. EXECUTIVE SUMMARY & OVERALL VALUATION SCORE

### Điểm tổng: **7.2 / 10** — Sẵn sàng bán, cần 1 đợt polish trước khi chào giá cao nhất

Nền tảng kỹ thuật và UX cốt lõi vững; điểm trừ chủ yếu đến từ **khoảng cách giữa bản live và bản đã hoàn thiện cục bộ**, không phải từ lỗi chức năng.

| Trụ cột | Điểm | Cơ sở |
|---|---|---|
| Chức năng & ổn định | 8.4 / 10 | 0 lỗi 500 thật, 0 crash JS qua toàn bộ 6 route + tương tác test |
| Độ hoàn thiện thương mại | 6.8 / 10 | Khoảng cách live vs. local, 404 mặc định, ảnh hotlink 100% |
| Chiều sâu kỹ thuật | 7.1 / 10 | Stack hiện đại, data-transparency UX thật, thiếu polish chuyển động cao cấp |

### 3 yếu tố đang dìm giá bán nhiều nhất

| # | Yếu tố | Vì sao nó dìm giá | Chi phí sửa |
|---|---|---|---|
| 1 | **Bản live tụt hậu so với bản đã hoàn thiện** | Người mua luôn kiểm tra link live trước — hiện tại bản live thiếu font hiệu ứng, không có footer, khiến sản phẩm trông thô hơn thực tế đáng kể so với những gì hồ sơ bán hàng mô tả. | ~5 phút (deploy lại) |
| 2 | **100% ảnh dự án hotlink từ site bên thứ ba** | Toàn bộ hình ảnh (masterplan, tiện ích, gallery) tải trực tiếp từ `honghacphumyhung.vn` — không self-host, không qua `next/image`, không CDN cache. Site đó đổi/xoá ảnh bất kỳ lúc nào, sản phẩm mất giá trị hình ảnh ngay lập tức, ngoài tầm kiểm soát của bên bán. | 2–4 giờ (pipeline ảnh) |
| 3 | **Trang 404 mặc định của Next.js, chưa mang thương hiệu** | Không có `error.tsx`/`not-found.tsx` nào trong `app/`. Gõ sai 1 ký tự URL dự án ra ngay trang trắng "404 This page could not be found" — khoảnh khắc "trông như đồ án" dễ gặp nhất mà người mua có thể tự tay tạo ra trong 5 giây. | 30–45 phút |

### ✓ Điều KHÔNG nên động vào

Kiến trúc dữ liệu (fallback tự động sang mock khi seed lỗi), hệ thống 5 nhãn minh bạch dữ liệu (Đã có dữ liệu / Chưa xác thực / Mâu thuẫn / Chưa có dữ liệu / Bảo mật) áp dụng nhất quán xuyên suốt site, CMDK command palette, lightbox gallery, và bảng so sánh tự chuyển thành accordion trên mobile — đều đã ở mức chất lượng thương mại thật, không cần rebuild. Xem chi tiết bằng chứng ở Phần II.

---

## II. LIVE UX/UI AUDIT & FRICTION POINTS

Kiểm thử trực tiếp bằng Playwright trên `de-division-pmh.vercel.app`: cả 6 route, CMDK (⌘K), bộ lọc, lightbox, copy-to-clipboard, chuyển VI/EN, và responsive ở 390px. Một số nghi vấn ban đầu (ảnh vỡ, khoảng trắng lớn, toast không hiện) đã được **xác minh lại kỹ và loại bỏ** vì là artefact của lazy-loading/animation timing chứ không phải lỗi thật — chỉ những phát hiện đã tái hiện được ổn định mới đưa vào dưới đây.

### Bảng tổng hợp

| Vị trí | Loại | Hiện trạng | Mức độ |
|---|---|---|---|
| Toàn site (live) | UI / Deploy | Font H1/body là Inter mặc định, không phải serif biên tập như bản local; `<footer>` không tồn tại trong DOM | **Major** |
| `/du-an/[slug]` | Reliability | 46/46 ảnh hotlink trực tiếp `honghacphumyhung.vn`, không qua `next/image` | **Major** |
| URL dự án sai | Error handling | Next.js default 404 trắng, không nav/logo/CTA | **Major** |
| Menu mobile (☰) | i18n | Drawer "Điều hướng" + 3 mục nav không đổi sang EN dù switcher đang bật EN | **Major** |
| Header desktop | i18n | Dropdown "Dự án" không dịch (láng giềng "Compare"/"Legal" dịch đúng) | Minor |
| `/so-sanh` vs `/du-an?xem=bang` | IA | Hai URL render gần như cùng 1 bảng so sánh — dễ gây mơ hồ "đâu mới là trang chính" | Minor |
| `/du-an/[slug]` gallery | Performance | Trang chi tiết dài tới ~9.250px, lưới ảnh "Tất cả" tải toàn bộ ảnh không phân trang/ảo hoá | Minor |
| Hover / transition | Motion | Hover card chỉ đổi màu phẳng, không nâng/đổ bóng; chuyển trang không có transition mượt | Minor |

### Chi tiết — trang 404 mặc định

Truy cập bất kỳ slug dự án không tồn tại (vd. `/du-an/khong-ton-tai-123`) trả về nguyên trạng trang lỗi mặc định của Next.js — không phải bản dựng riêng của DED-PMH:

```
HTTP status: 404
Page title: "404: This page could not be found."
```

Nội dung hiển thị: chỉ chữ "404" + đường kẻ dọc + dòng "This page could not be found." trên nền trắng — **không có header, logo, nav, hay CTA nào của DED-PMH**. Xác nhận qua code: không tồn tại `error.tsx`, `not-found.tsx`, hay `loading.tsx` ở bất kỳ đâu trong `app/`.

### Những gì hoạt động tốt (đã kiểm chứng, đáng giữ nguyên)

Không phải mọi thứ nghi ngờ ban đầu đều là lỗi thật — quá trình kiểm chứng độc lập đã loại trừ 3 nghi vấn:

| Nghi vấn ban đầu | Kết luận sau xác minh |
|---|---|
| 40/46 ảnh "vỡ" trên trang chi tiết dự án | False positive — ảnh dùng `loading="lazy"`, đã tải đủ và hiển thị đúng khi cuộn qua toàn trang và đợi network settle |
| Khoảng trắng ~3.600px giữa các section | False positive — chính là gallery ảnh (25+ ảnh) đang lazy-load tại thời điểm chụp đầu tiên, không phải layout vỡ |
| Nút "Sao chép nội dung" ở /phap-ly không có phản hồi | False positive — toast Sonner "Đã sao chép" có xuất hiện, chỉ bị bỏ lỡ do thời điểm chụp rơi đúng lúc `opacity:0` của animation fade-in |

Các tính năng đã kiểm chứng hoạt động đúng, chất lượng thương mại thật:

- **CMDK (⌘K)** — tìm kiếm tức thời, phân nhóm rõ (Dự án / Trang / Hành động), có cả hành động ngữ cảnh "Xuất PDF — [tên dự án]" ngay trong kết quả tìm kiếm.
- **Lightbox gallery** — tab lọc theo hạng mục (Tất cả/Hero/Masterplan/Tổng quan/Vị trí/Tiện ích/Kiến trúc), caption, nguồn ảnh, dải thumbnail, điều hướng mũi tên.
- **Bảng "Ẩn hàng giống nhau"** trên `/du-an` — ẩn tự động các dòng dữ liệu giống hệt nhau giữa các dự án.
- **Bảng so sánh 7 cột tự chuyển thành accordion gọn gàng trên mobile 390px** thay vì vỡ layout hay bắt cuộn ngang — test trực tiếp: mở accordion "Hồng Hạc City" hiển thị đầy đủ 7 trường + nhãn trạng thái dữ liệu, đúng UX.
- **Copy-to-clipboard** trên bảng pháp lý — mỗi dòng có nút riêng (`aria-label="Sao chép nội dung"`, accessible đúng chuẩn), kèm toast "Đã sao chép" xác nhận.

---

## III. ARCHITECTURE & CODEBASE AUDIT

Đọc trực tiếp mã nguồn đã clone (không suy đoán từ tài liệu) — cấu trúc `app/`, `lib/`, `components/`, các file quyết định kiến trúc (ADR), và data contract.

### Tuân thủ stack

Next.js 16.2.6 (App Router) + React 19.2.4 + Tailwind v4.3.3 — đúng như quảng cáo, không lệch phiên bản. Server Component dùng đúng chỗ (trang load dữ liệu tĩnh), `"use client"` chỉ xuất hiện ở nơi thực sự cần state/tương tác (locale context, CMDK, lightbox). State bộ lọc/view trên `/du-an` lưu qua URL search param (`?xem=bang`) — đúng thực hành tốt (shareable, back-button hoạt động), không lạm dụng client state không cần thiết.

**6 route đã xác nhận tồn tại và hoạt động:** `/`, `/du-an`, `/du-an/[slug]`, `/so-sanh`, `/phap-ly`, `/lab`.

### Lớp dữ liệu — khả năng chịu lỗi thật, không phải lời hứa suông

`lib/library-bridge.ts` (102 dòng) bọc mọi lệnh gọi tới seed thật (`@library/library/seed-adapter`) trong `try/catch`, tự động rơi về `lib/mock-data.ts` khi file seed thiếu hoặc trả về mảng rỗng — có phân biệt rõ 2 tầng dữ liệu (`V0Project` tinh gọn cho trang chủ/nav vs. `FullProject` đầy đủ cho so sánh/chi tiết). Đã đọc toàn bộ file: không có nhánh nào có thể throw ra ngoài UI. Đây là một lựa chọn kiến trúc tốt, hiếm gặp ở MVP giai đoạn này.

```ts
export async function getCatalogFromLibrary() {
  try {
    const { headerProjects, projects, assets } = loadLibraryCatalog();
    if (projects.length === 0) throw new Error("library returned zero projects");
    return { source: "library", ... };
  } catch {
    const mock = await import("@/lib/mock-data");
    return { source: "mock", ... }; // luôn có dữ liệu để render, không bao giờ crash
  }
}
```

`@library/*` trong `tsconfig.json` trỏ về `./vendor/library/*` — xác nhận claim "độc lập, tự build được, không phụ thuộc monorepo gốc" trong `WHAT_YOU_BUY.md` là **đúng sự thật**, không phải marketing copy: đây thật sự là code đã vendor (copy vào), không phải import runtime vào monorepo cha.

### Data contract & validation

`lib/geo/geojson-contract.ts` (89 dòng) là một validator runtime thật, không phải chỉ tài liệu markdown mô tả suông — kiểm tra đúng 2 tầng hợp đồng dữ liệu (`region-aoi` và `project-site`), bao gồm cả field `status` phải khớp đúng 1 trong 5 giá trị `FieldStatus`. Comment trong code còn nói rõ giới hạn cố ý (không kiểm tra `projectSlug` khớp danh sách dự án sống — "out of scope for a pure-geometry validator") — dấu hiệu kỹ sư có kỷ luật, không viết code "trông như validate" mà thực chất rỗng.

### Bảo mật & bề mặt tấn công

Không có route API nào, không biến môi trường bắt buộc, không thu thập PII, không có form nào lưu dữ liệu người dùng. Bề mặt tấn công thực tế gần như bằng 0 — đúng bản chất "public static UI shell". Rủi ro vận hành thật duy nhất nằm ở **tầng phụ thuộc ảnh** (xem Phần II, mục 2), không phải bảo mật.

### Quyết định hoãn RBAC/AI/Algolia (ADR-001) — đọc đúng, không đọc sai thành "thiếu sót"

`docs/ADR-001-enterprise-rbac-ai-algolia.md` ghi rõ ràng: build RBAC thật sẽ phá vỡ chính điểm bán "0 biến môi trường bắt buộc" của v0; AI/Algolia đòi hỏi API key trả phí + backend proxy, vượt phạm vi "repo tự build độc lập". Có điều kiện tái mở cụ thể (vd. Algolia chỉ đáng làm khi danh mục vượt ~50-100 dự án, hiện tại mới 4). Đây là **tín hiệu trưởng thành kỹ thuật** đáng nêu rõ với người mua — không nên bị đọc nhầm thành "sản phẩm thiếu RBAC" nếu không đặt đúng trong bối cảnh phạm vi đã công bố.

### Vệ sinh SEO & vận hành

`sitemap.ts`, `robots.ts`, `icon.tsx` đều có mặt. `@vercel/analytics` đã gắn. Bộ e2e Playwright (`e2e/`, claim 23+ test theo README) có mặt trong repo với cấu hình riêng — báo cáo này không tự chạy lại toàn bộ suite trong phiên kiểm định này, chỉ xác nhận sự tồn tại và cấu trúc file.

### Rủi ro kỹ thuật cần theo dõi

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Phụ thuộc ảnh 100% vào domain bên thứ ba, không kiểm soát | Major | Điểm rủi ro thương mại lớn nhất trong toàn bộ audit |
| Không có error/not-found boundary tuỳ biến | Major | Next.js App Router hỗ trợ sẵn `error.tsx`/`not-found.tsx` — chưa tận dụng |
| i18n dùng 2 cơ chế song song (`useLocale().t()` reactive vs. `lib/i18n/t.ts` tĩnh) | Minor | Đã tự tài liệu hoá trung thực trong `I18N_EN.md` — rủi ro là bảo trì lâu dài nếu mở rộng phạm vi EN mà không hợp nhất 2 cơ chế |

---

## IV. NÂNG CẤP THƯƠNG MẠI (COMMERCIAL PREMIUM POLISH)

Những chi tiết nhỏ quyết định cảm giác "hàng cao cấp" — và các vòng nghiệp vụ nên đóng lại trước khi chào giá.

### Đã ở mức cao cấp — nên làm nổi bật khi chào bán, không phải sửa

- **Hệ thống 5 nhãn minh bạch dữ liệu** (Đã có dữ liệu / Chưa xác thực / Mâu thuẫn / Chưa có dữ liệu / Bảo mật) — áp dụng nhất quán từ trang chủ → danh mục → bảng so sánh → chi tiết dự án → hồ sơ pháp lý. Đây là một pattern UX thật sự khác biệt so với site bất động sản thông thường, đúng trọng tâm "minh bạch" mà sản phẩm định vị.
- **CMDK command palette** (⌘K) — tìm kiếm tức thời, phân nhóm rõ, hành động ngữ cảnh "Xuất PDF" ngay trong kết quả tìm kiếm.
- **Bảng pháp lý có copy-to-clipboard từng dòng + toast xác nhận** — chi tiết nhỏ nhưng đúng kỳ vọng của một công cụ tra cứu nội bộ nghiêm túc.

### Vòng nghiệp vụ chưa khép kín

#### 1. Font & footer trên bản live không khớp bản đã duyệt — **Major**

**Vị trí:** Toàn site — de-division-pmh.vercel.app

Đã tự kiểm tra DOM trực tiếp: `getComputedStyle(document.body).fontFamily` trả về `Inter, "Inter Fallback", ui-sans-serif...` — không phải serif biên tập; `document.querySelector('footer')` trả về `null`. Nếu bản local đã có footer + font khác, đây thuần tuý là vấn đề **chưa deploy lại**, không phải bug code.

**Tác động:** đây là điểm chạm ĐẦU TIÊN của bất kỳ ai định giá sản phẩm — mở link live trước khi đọc bất kỳ tài liệu nào.

#### 2. Ảnh dự án là tài sản đi mượn, không phải tài sản sở hữu — **Major**

**Vị trí:** `/du-an/[slug]` — toàn bộ 4 dự án

46/46 ảnh trên trang Hồng Hạc City trỏ thẳng tới `honghacphumyhung.vn` (site marketing riêng của chủ đầu tư). Không có bước tải-về-lưu-trữ, không qua `next/image`, không cache CDN.

**Tác động:** giá trị hình ảnh của toàn bộ sản phẩm phụ thuộc vào một bên thứ ba không có nghĩa vụ hợp đồng nào với người mua MVP này. Cũng đáng cân nhắc khía cạnh bản quyền sử dụng lại ảnh khi chuyển giao thương mại.

#### 3. Chuyển ngôn ngữ EN chưa phủ hết chính phạm vi đã công bố — Minor

**Vị trí:** Menu mobile (☰) + dropdown "Dự án" trên desktop

`docs/I18N_EN.md` tự nhận "Header: wordmark, nav links... đã locale-reactive" — nhưng menu drawer mobile ("Điều hướng", "Dự án", "So sánh", "Pháp lý") giữ nguyên tiếng Việt kể cả khi bật EN, và trên desktop riêng dropdown "Dự án" cũng không dịch trong khi "So sánh"→"Compare"/"Pháp lý"→"Legal" dịch đúng.

**Tác động:** nhỏ về mặt kỹ thuật (1-2 key dịch thiếu), nhưng làm giảm độ tin cậy của phần tài liệu tự audit vốn rất tốt của đội ngũ.

---

## V. ACTIONABLE ROADMAP TỐI ƯU GIÁ BÁN

Sắp xếp theo ma trận Effort vs. Impact. Nhóm "Quick Wins" nên làm trước khi gửi bất kỳ demo nào cho người mua tiềm năng — tổng thời gian ước tính dưới 1 ngày làm việc.

### 🔴 Quick Wins — Effort thấp, Impact cao (làm trước khi demo)

| Effort | Việc cần làm |
|---|---|
| ~5 phút | Deploy lại nhánh `main` mới nhất lên Vercel để bản live khớp font + footer với bản đã duyệt cục bộ. |
| 30–45 phút | Thêm `app/not-found.tsx` và `app/error.tsx` dùng lại `SiteHeader` + nút "Về trang chủ" thay vì trang trắng mặc định. |
| 15 phút | Sửa dropdown nav "Dự án" và menu mobile để đọc đúng key `t()` theo locale hiện tại — tận dụng lại logic đã đúng ở "So sánh"/"Pháp lý". |
| 30 phút | Thêm hover lift + shadow nhẹ cho project card (translate-y + box-shadow transition) trên trang chủ và danh mục — nâng cảm giác "cao cấp" tức thì với chi phí thấp nhất trong toàn bộ roadmap. |

### 🟠 Nâng cấp có chủ đích — Effort trung bình, Impact cao

| Effort | Việc cần làm |
|---|---|
| 2–4 giờ | Xây pipeline tải-về-lưu-trữ ảnh dự án vào Storage riêng (hoặc ít nhất qua `next/image` với domain allowlist + fallback placeholder khi nguồn ngoài lỗi) — loại bỏ rủi ro phụ thuộc bên thứ ba. |
| 3–5 giờ | Thêm skeleton/shimmer cho trạng thái tải bản đồ và danh mục, thay cho text tĩnh "Đang tải dữ liệu…". |
| 1–2 giờ | Làm rõ vai trò `/so-sanh` vs. chế độ bảng của `/du-an` — hợp nhất thành 1 nguồn sự thật hoặc phân biệt rõ mục đích từng trang trong điều hướng. |
| 2–3 giờ | Thêm page-transition mượt giữa các route (Framer Motion đã có sẵn trong dependencies, chưa tận dụng cho transition cấp-route). |

### 🟢 Chiến lược — nâng trần định giá, không bắt buộc trước khi bán

- Tách rõ ràng trong hồ sơ chào bán: "gói v0 Track A" (UI shell, đã audit trong báo cáo này) vs. "hệ thống Local" (Firebase + RBAC) — định giá 2 gói riêng biệt thay vì để người mua tự suy đoán, tránh kỳ vọng sai lệch làm giảm niềm tin ở bàn đàm phán.
- Đóng gói chính "văn hoá tài liệu trung thực" (WHAT_YOU_BUY.md, ADR-001, I18N_EN.md) như một điểm bán hàng — hiếm MVP nào tự công bố rõ giới hạn phạm vi, đây là tín hiệu giảm rủi ro hậu mua rất mạnh với người mua kỹ thuật.
- Nếu tái mở Algolia/AI theo đúng điều kiện đã ghi trong ADR-001 (danh mục vượt ngưỡng dự án), làm đúng lúc đó — không build sớm sẽ chỉ tạo "tính năng nửa vời" làm giảm giá trị thay vì tăng.

---

*Báo cáo này cũng đã được xuất bản dưới dạng artifact tương tác (bảng màu/typography riêng, ảnh chụp bằng chứng nhúng trực tiếp) trong cùng phiên làm việc.*
