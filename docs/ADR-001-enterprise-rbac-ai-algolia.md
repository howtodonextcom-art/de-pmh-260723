# ADR-001 — Enterprise multipliers: RBAC, AI, Algolia

Ngày: 2026-07-21
Trạng thái: **Defer** (không build trong v0 wave này)

## Bối cảnh

R12 trong roadmap v0 Track A đề cập ba "hệ số nhân giá trị doanh nghiệp" (enterprise multipliers) từng được nêu trong các ghi chú định giá trước đây:

1. **RBAC/OAuth thật** — đăng nhập phân quyền (viewer/editor/admin) cho v0, tương tự hệ thống Local (Firebase Auth + passcode + duyệt thay đổi).
2. **AI** — trợ lý tra cứu/tóm tắt dữ liệu dự án bằng LLM (chatbot hỏi-đáp, tự động phát hiện mâu thuẫn nguồn).
3. **Algolia** (hoặc search engine tương đương) — thay thế CMDK tìm kiếm nội bộ hiện tại (client-side, dữ liệu tĩnh) bằng full-text search server-side có xếp hạng/gợi ý.

Prompt hiện tại (`v0/prompts/2026-07-21-claude-v0-remaining-100-closure-mcp.md`) yêu cầu R12 phải có **terminal state** trước khi tuyên bố "100% closure" cho roadmap — nhưng giới hạn rõ: **ADR-only**, không build production RBAC/AI/Algolia trong wave này.

## Quyết định

**Defer** cả ba hạng mục. Không implement RBAC/OAuth, không tích hợp AI, không tích hợp Algolia vào `v0/` trong wave này hoặc bất kỳ wave nào tiếp theo trừ khi điều kiện tái mở (§ dưới) được đáp ứng.

### Vì sao Defer, không phải Build hay Reject hẳn

| Lựa chọn | Vì sao không chọn |
|---|---|
| **Build ngay** | v0 Track A định vị là "bản demo/UI shell công khai, không cần đăng nhập" (`docs/WHAT_YOU_BUY.md` §3) — thêm RBAC thật đòi hỏi Firebase Admin SDK + quản lý user, phá vỡ chính lời hứa "0 biến môi trường bắt buộc" đang là điểm bán hàng của v0. AI/Algolia đòi hỏi API key trả phí + backend proxy — vượt phạm vi "repo tự build được, không phụ thuộc dịch vụ ngoài" của Track A. |
| **Reject hẳn (không bao giờ làm)** | Cả ba đều là nhu cầu thật của một hệ thống production đa người dùng/đa dự án lớn hơn — không nên đóng cửa vĩnh viễn, chỉ là chưa đúng lúc cho v0 (bản demo/portfolio 4 dự án). |
| **Defer** (chọn) | Giữ nguyên trạng hiện tại (không đăng nhập, CMDK client-side, không AI) cho tới khi có tín hiệu nhu cầu thật (§ tái mở), tránh xây "nửa vời" (một OAuth flow dở dang, một AI feature không ai dùng) — đúng tinh thần "R12 must not silently become a half-built OAuth" trong prompt gốc. |

## Điều kiện tái mở (reopen criteria)

Chỉ nên tái mở từng hạng mục riêng lẻ khi:

**RBAC/OAuth:**
- v0 chuyển từ "demo công khai" sang có ≥1 luồng nghiệp vụ cần phân quyền thật (vd: cho phép sales team ngoài chỉnh sửa dữ liệu trực tiếp trên v0 thay vì qua hệ thống Local), HOẶC
- Khách hàng/đối tác mua gói yêu cầu tường minh "cần đăng nhập để xem" như một điều kiện hợp đồng.

**AI:**
- Có ≥3 yêu cầu người dùng thật (không phải giả định) về "hỏi nhanh dữ liệu dự án bằng ngôn ngữ tự nhiên" mà CMDK + `t()` không đáp ứng được, HOẶC
- Khối lượng dữ liệu dự án tăng đủ lớn (>15-20 dự án) khiến việc tra cứu thủ công qua UI hiện tại trở nên chậm.

**Algolia (hoặc search engine khác):**
- Số dự án trong danh mục vượt quá mức mà CMDK client-side (tìm kiếm trong mảng JSON tĩnh, không phân trang) còn phản hồi nhanh — ước lượng ngưỡng thực tế ~50-100 dự án, xa mức 4 dự án hiện tại.

Nếu không hạng mục nào trong ba điều kiện trên xảy ra, giữ nguyên Defer vô thời hạn — không cần review định kỳ.

## Hệ quả

- `docs/WHAT_YOU_BUY.md` §5 ("KHÔNG bao gồm trong wave hiện tại") cập nhật để trích dẫn ADR này thay vì chỉ ghi "Chưa làm" — rõ ràng đây là quyết định có chủ đích, không phải thiếu sót.
- Không có code RBAC/AI/Algolia nào được thêm vào `v0/` trong wave này — không stub, không feature flag "coming soon", không UI giả lập.
- Nếu một wave tương lai tái mở một trong ba mục, cần một ADR mới (hoặc update ADR này) ghi rõ điều kiện tái mở nào đã xảy ra, không tự ý build vì "tiện đang sửa code gần đó".
