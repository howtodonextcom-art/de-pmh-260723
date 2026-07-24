# Demo script — DED-PMH v0 Track A (≈15 phút)

Trước khi demo: mở https://de-division-pmh.vercel.app (hoặc `pnpm dev` local), xác nhận build mới nhất đã deploy. Trình tự dưới đây theo đúng luồng người mua sẽ thấy — không cần chuẩn bị dữ liệu giả, mọi thứ đã có sẵn trong 4 dự án thật.

| # | Bước | Thời lượng | Talk track |
|---|------|-----------|------------|
| 1 | **Trang chủ — Hero** | ~2' | "Đây là trang chủ DED-PMH — trung tâm thông tin tra cứu 4 dự án Phú Mỹ Hưng từ một nguồn duy nhất. Mọi số liệu đều gắn nhãn trạng thái minh bạch — không phải marketing site thông thường." Cuộn xuống thống kê danh mục (4 dự án, 3 khu vực, quy mô đất lớn nhất, sản phẩm đã công bố). |
| 2 | **Cuộn tới bản đồ → pin/halo → click danh sách Bắc Ninh → lọc /du-an** | ~3' | "Đây không phải hình vẽ trang trí — là bản đồ MapLibre thật, 2 khu vực đang có dự án được tô nổi bật. Click vào Bắc Ninh trong danh sách bên cạnh…" → trang tự động lọc `/du-an?khu-vuc=bac-ninh`, chỉ còn Hồng Hạc City. "Đây chính là hợp đồng URL filter mà sa bàn cũng dùng chung." |
| 3 | **Mở CTA "Sa bàn Hồng Hạc" (tab mới) → sa bàn sống** | ~2' | Quay lại trang chủ, cuộn tới bản đồ, click "Sa bàn Hồng Hạc →" trên dòng Bắc Ninh. "Đây là deep-link sang sản phẩm sa bàn thật — IP riêng biệt, 397 lô đất, không nhúng vào v0 này. Link có UTM để đo traffic dẫn sang." Đóng tab, quay lại v0. |
| 4 | **Trang chi tiết dự án** (1 dự án HCM + Hồng Hạc City nếu còn thời gian) | ~3' | Vào `/du-an/hong-hac-city` (hoặc click "Xem chi tiết" từ danh mục). Lướt qua fact grid, thư viện ảnh (click 1 ảnh mở lightbox, dùng phím mũi tên chuyển ảnh, Esc đóng), hồ sơ pháp lý, tiến độ bán, nguồn dữ liệu. "Mỗi trường dữ liệu đều truy ngược được nguồn — không phải số liệu tự bịa." |
| 5 | **`/so-sanh` — nguồn so sánh duy nhất** | ~2' | Từ `/du-an` bấm CTA “So sánh dự án” (hoặc nav So sánh) → `/so-sanh`. "Đây là trang so sánh duy nhất — 7 trường cốt lõi + tóm tắt pháp lý; danh mục `/du-an` chỉ còn lưới lọc, không nhân đôi bảng." Bật “Ẩn hàng giống nhau” nếu demo. |
| 6 | **`/phap-ly` hoặc lưu ý về in PDF trung thực** | ~2' | Vào `/phap-ly` — chỉ 7 nhóm hồ sơ mỗi dự án, nút in. "Nút 'Xuất PDF' ở trang chi tiết dùng chế độ in trình duyệt thật — không giả vờ tải file khi chưa có Cloud Function thật. Đây là nguyên tắc trung thực xuyên suốt sản phẩm." |
| 7 | **CMDK `⌘K` — đổi theme / điều hướng nhanh** | ~1' | Bấm `⌘K` (hoặc `Ctrl+K`). "Tìm kiếm nhanh dự án, trang, hoặc đổi giao diện sáng/tối — không cần rời trang hiện tại." |

**Tổng: ~15 phút.** Nếu rút gọn, ưu tiên bước 1-3 (bắt buộc — thể hiện đúng giá trị cốt lõi: minh bạch dữ liệu + bản đồ thật + ranh giới rõ ràng với sa bàn) và bước 6 (nguyên tắc trung thực, tránh over-promise).

## Ghi chú vận hành demo

- Không cần quay video — chạy live, vì mọi luồng đều ổn định (đã qua e2e + MCP xác minh).
- Nếu mạng chậm khi tải bản đồ (MapLibre + demotiles style), đợi ~1-2s là bình thường, không phải lỗi.
- Nếu click "Sa bàn Hồng Hạc →" mà trang sa bàn tải chậm/lỗi — đó là uptime bên thứ ba, không phải v0; nói rõ với khách hàng đây là 2 hệ thống độc lập.
