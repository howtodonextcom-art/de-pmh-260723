# DED-PMH v0 — PDF export (fact sheet)

Ngày cập nhật: 2026-07-21

## 1. Trạng thái hiện tại (mặc định — `NEXT_PUBLIC_PDF_FUNCTION_URL` không set)

v0 Track A **không tự deploy Cloud Function nào**. `exportFactSheetPdf()` (`components/project/detail/pdf-export-trigger.tsx`) mặc định dùng **print-CSS fallback trung thực**:

1. Toast `pdf.printToast` ("Đang mở chế độ in — chọn 'Lưu thành PDF' để xuất fact sheet.")
2. `window.print()` — trình duyệt mở dialog in gốc; layout `print:hidden` trên các section không cần thiết (nav, hero ảnh...) đã có sẵn qua Tailwind print variant.

Đây **không phải** một tính năng giả — người dùng thực sự nhận được bản in/PDF A4 hợp lệ qua "Save as PDF" của trình duyệt. Đây là cách F6 hoạt động trong mọi wave trước và **vẫn là hành vi mặc định** sau prompt này.

Ba điểm gọi trong app:
- Nút "Xuất PDF" trong accordion Sources (`components/project/detail/sources.tsx`)
- `?export=pdf` query param, tự trigger khi trang chi tiết load (`PdfExportTrigger`, gắn trong `app/du-an/[slug]/page.tsx`)
- CMDK action "Xuất PDF" theo từng dự án — điều hướng tới `?export=pdf` rồi để `PdfExportTrigger` xử lý

## 2. Cầu nối tới Local Cloud Function thật (khi cần)

Hệ thống Local (production, repo khác) có Cloud Function thật: `functions/src/export-fact-sheet-pdf.ts` — Firebase **callable function** (`onCall`), yêu cầu auth, dùng `pdf-lib` để tạo PDF 2 trang (facts + pháp lý, tự động bỏ field `bao-mat`), lưu vào Storage, trả về `{ ok, url, path }` với `url` là signed URL 15 phút.

v0 **không** gọi thẳng `onCall` (đòi hỏi Firebase Admin SDK context + auth mà v0 công khai không có). Thay vào đó, R08 thêm một **cầu nối tùy chọn qua biến môi trường**:

```
NEXT_PUBLIC_PDF_FUNCTION_URL=https://<your-http-endpoint>
```

Nếu set, `exportFactSheetPdf(slug)`:

1. Toast `pdf.functionAttemptToast` ("Đang yêu cầu file PDF từ Cloud Function…")
2. `fetch(`${NEXT_PUBLIC_PDF_FUNCTION_URL}?slug=${slug}`)`
3. Nếu response không `ok` (không phải 2xx), hoặc JSON không có field `url` dạng string → `throw`, vào nhánh lỗi
4. Thành công: `window.open(url, "_blank")` (mở link tải PDF signed URL) + toast `pdf.functionSuccessToast`
5. Thất bại (bất kỳ lý do gì: network, 4xx/5xx, JSON hỏng, thiếu `url`): toast lỗi `pdf.functionErrorToast` ("Không tạo được PDF từ Cloud Function...") — **không** tự động chuyển sang in, **không** báo thành công giả. Người dùng biết rõ việc gọi Function thất bại và có thể tự bấm lại hoặc dùng nút in khác.

**Vì sao endpoint HTTP thường (không phải `onCall` trực tiếp)?** `onCall` dùng giao thức callable riêng của Firebase SDK (POST `{data: {...}}`, cần Firebase client SDK + auth token) — không phù hợp gọi bằng `fetch` trần từ một app công khai không cài Firebase SDK. Nếu muốn dùng cầu nối này thật, cần một trong hai:
- Deploy thêm một **HTTP-triggered wrapper function** (`onRequest`) bọc quanh logic `pdf-lib` hiện có, trả JSON `{ ok, url }` giống hợp đồng trên; hoặc
- Gọi qua Firebase callable REST endpoint thủ công (`https://<region>-<project>.cloudfunctions.net/exportFactSheetPdf` với body `{"data": {"slug": ...}}` và một Firebase ID token) — cần thêm logic auth phía client, ngoài phạm vi wave này.

R08 chỉ định nghĩa **hợp đồng** (`{ ok, url }` JSON, GET với `?slug=`) và code phía client sẵn sàng gọi nó — **không** deploy, **không** implement wrapper `onRequest` ở phía Local trong prompt này.

## 3. Kiểm thử

- Mặc định (env unset, trạng thái CI hiện tại): `e2e/i18n-pdf.spec.ts` xác nhận `window.print` được gọi qua cả 3 entry point (nút Sources, `?export=pdf`, CMDK) — không đổi.
- `e2e/pdf-function-honesty.spec.ts` (mới, R08): xác nhận khi env unset, `exportFactSheetPdf` **không** gọi `fetch` — chỉ gọi `window.print()`. Đường dẫn env-set không có e2e (không có Function thật để trỏ tới trong CI) — được ghi rõ là debt/known-gap, không phải lỗi che giấu.

## 4. Không thuộc phạm vi

- Không deploy Firebase Function nào từ prompt này (theo chỉ dẫn "No deploy of Firebase from this prompt required").
- Không thêm Firebase Client SDK vào v0 (giữ nguyên "0 biến môi trường bắt buộc cho bản demo công khai" — `docs/WHAT_YOU_BUY.md` §3).
- Không test đường dẫn `NEXT_PUBLIC_PDF_FUNCTION_URL` set + Function that thật — cần một Function đã deploy để test end-to-end, ngoài phạm vi wave này.
