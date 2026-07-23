# BÁO CÁO KIỂM TOÁN KỸ THUẬT & LỘ TRÌNH NÂNG CẤP THƯƠNG MẠI
**Ngày thực hiện:** 20/07/2026  
**Người thực hiện:** Lead Auditor & Product Valuation Strategist  
**Đối tượng kiểm toán:** Hệ thống MCP và UI Reference Implementation (PMH v2)  

---

## TÓM TẮT ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Dưới lăng kính ROI (Tỷ suất hoàn vốn), hệ thống hiện tại đang ở trạng thái **không thể thương mại hóa**. Việc tồn tại các lỗi runtime cơ bản gây sập toàn bộ giao diện (Crash) cùng cơ chế bảo mật bypass khiến sản phẩm mất đi hoàn toàn lòng tin từ các khách hàng Enterprise (các tập đoàn Bất động sản lớn). 

*   **Mức độ hoàn thiện thực tế:** **45%**  
    *Hệ thống chỉ mới đạt mức giao diện demo tĩnh hoạt động được một phần. Tỷ lệ này bị kéo sụt nghiêm trọng do thiếu an toàn dữ liệu đầu vào (Null Safety) và kiến trúc phân quyền thiếu nghiêm túc.*
*   **Định giá hiện trạng (Chưa sửa lỗi):** **$10,000 USD**  
    *Giá trị này thực chất chỉ là giá trị thanh lý mã nguồn thô (scrap code value). Không một doanh nghiệp bất động sản nào chấp nhận chi tiền cho một phần mềm sập trắng màn hình ngay khi nhấn thanh tìm kiếm hoặc truy cập một dự án thiếu hồ sơ pháp lý.*
*   **Định giá kỳ vọng (Sau khi hoàn thành lộ trình):** **$150,000 - $200,000 USD** (Mức giá Enterprise SaaS / On-premise)  
    *Bằng việc dọn sạch rác kỹ thuật ở Phần 1 và bơm thêm các tính năng xa xỉ tại Phần 2, sản phẩm sẽ lột xác thành "Hệ thống Quản trị & Phân tích Pháp lý Dự án thông minh", tạo ra ROI vượt trội và định giá cao gấp 15 - 20 lần.*

---

## PHẦN 1: RÀO CẢN CHỐT SALE (SHOWSTOPPER BUGS)

Đây là 4 lỗi nghiêm trọng nhất làm sập hệ thống, là nguyên nhân trực tiếp khiến khách hàng từ chối ký hợp đồng mua sản phẩm trong buổi demo.

### 1. Lỗi Crash Tìm Kiếm (Fuzzy Search Crash)
*   **Điểm nghẽn:** Sử dụng toán tử spread (`...`) và duyệt `.some()` trực tiếp trên thuộc tính `alternateNames` mà không kiểm tra sự tồn tại của trường này (Firestore trả về `undefined` hoặc `null` nếu trường bị bỏ trống).
*   **Hậu quả:** Sập trắng màn hình (blank page) ngay khi nhấn `Ctrl + K` hoặc gõ lọc dự án.
*   **Hotfix:**
    *   Tại `src/components/shared/cmdk.tsx`:
        ```tsx
        value={[p.displayNameVi, ...(p.alternateNames ?? [])].join(" ")}
        ```
    *   Tại `src/components/project/project-explorer.tsx`:
        ```typescript
        p.displayNameVi.toLowerCase().includes(q) ||
        (p.alternateNames ?? []).some((n) => n.toLowerCase().includes(q))
        ```

### 2. Lỗi Crash Bảng & Tiến Độ Pháp Lý (LegalDossier Null Crash)
*   **Điểm nghẽn:** Truy xuất trực tiếp thuộc tính con của đối tượng `legalDossier` (ví dụ: `project.legalDossier[key]`) mà không sử dụng safe navigation operator (`?.`).
*   **Hậu quả:** Khi mở trang chi tiết dự án `/du-an/[slug]` hoặc trang so sánh đối với các dự án chưa có đầy đủ thông tin pháp lý, ứng dụng sập runtime lập tức.
*   **Hotfix:**
    *   Tại `src/components/project/legal-dossier-table.tsx` và `src/components/project/detail/legal-timeline.tsx`:
        ```typescript
        const value = project.legalDossier?.[key] ?? null;
        ```
    *   Tại `src/lib/data/compare-fields.ts`:
        ```typescript
        display: p.legalDossier?.salesEligibility ?? p.statusNote ?? "Chưa có",
        status: p.legalDossier?.salesEligibility ? "da-co-du-lieu" : "chua-co-du-lieu",
        ```

### 3. Mất Điều Hướng Cơ Bản tại Bảng Danh Mục (Orphan UI)
*   **Điểm nghẽn:** Tên dự án trong Table View của Project Explorer được hiển thị dưới dạng text thuần túy, thiếu thẻ liên kết.
*   **Hậu quả:** Người dùng bị "mắc kẹt" tại chế độ xem bảng, không thể click vào tên dự án để chuyển đến trang chi tiết, phá hỏng dòng trải nghiệm người dùng (UX Flow).
*   **Hotfix:**
    *   Tại `src/components/project/project-explorer.tsx`:
        ```tsx
        <td className="sticky left-0 z-10 bg-background p-3 font-medium">
          <Link href={`/du-an/${p.slug}`} className="hover:underline text-primary transition-colors">
            {p.displayNameVi}
          </Link>
        </td>
        ```

### 4. Lỗ Hổng Nâng Quyền Tự Động (Privilege Escalation)
*   **Điểm nghẽn:** Logic tự gán quyền `admin` cho tài khoản đăng nhập đầu tiên khi danh sách user trống, kết hợp với cơ chế dùng chung passcode (`passcode-shared-user`).
*   **Hậu quả:** Tài khoản dùng chung đăng nhập đầu tiên sẽ chiếm quyền admin vĩnh viễn trong DB. Bất kỳ người dùng tiếp theo nào dùng chung passcode này đều thừa hưởng đặc quyền admin, cho phép họ thay đổi/xóa sạch dữ liệu dự án nhạy cảm.
*   **Hotfix:**
    *   Tại `src/lib/auth/session.ts`:
        ```typescript
        const anyUser = await adminDb.collection("users").limit(1).get();
        const isBootstrapAdmin = anyUser.empty && email === process.env.BOOTSTRAP_ADMIN_EMAIL;
        const role: UserRole = isBootstrapAdmin ? "admin" : "viewer";
        ```

---

## PHẦN 2: CHIẾN LƯỢC ĐỘN GIÁ THƯƠNG MẠI (VALUATION MULTIPLIERS)

Để bán được sản phẩm này cho các chủ đầu tư bất động sản lớn với mức giá Enterprise cao cấp, hệ thống bắt buộc phải tích hợp 3 mô-đun nâng cấp "xa xỉ" dưới đây nhằm tăng tối đa ROI cho người mua:

### Mở rộng 1: Hệ thống Quản trị Bảo mật Đa Tầng (Enterprise RBAC & Identity Integration)
*   **Mô tả:** Loại bỏ hoàn toàn cơ chế passcode dùng chung nghiệp dư. Khôi phục Google OAuth / Microsoft Entra ID kết hợp Firebase Custom Claims. Thiết lập Row-Level Security (RLS) trên Firestore để phân quyền truy cập hồ sơ dự án theo chi nhánh hoặc bộ phận (ví dụ: Chỉ phòng Pháp lý mới thấy hồ sơ tranh chấp nhạy cảm, phòng Kinh doanh chỉ thấy trạng thái mở bán). Tích hợp hệ thống ghi nhật ký kiểm toán (Audit Trail Log) không thể giả mạo.
*   **Tại sao đáng tiền (ROI):** Doanh nghiệp bất động sản luôn coi thông tin pháp lý dự án là tài sản tối mật. Việc đáp ứng tiêu chuẩn bảo mật này là điều kiện tiên quyết để vượt qua vòng kiểm duyệt mua sắm (Procurement) của các tập đoàn lớn.

### Mở rộng 2: Trình Xuất Báo Cáo Pháp Lý Cao Cấp (Premium Dynamic PDF Export Engine)
*   **Mô tả:** Tích hợp công cụ tạo báo cáo động, cho phép xuất toàn bộ hồ sơ pháp lý, timeline tiến độ, và biểu đồ so sánh của dự án ra file PDF/Dossier chuẩn in ấn. Khách hàng Enterprise có thể tải lên Brand Kit riêng (logo, font chữ, màu sắc chủ đạo) để tự động chèn vào báo cáo.
*   **Tại sao đáng tiền (ROI):** Các giám đốc phát triển dự án và chuyên viên pháp lý mất hàng tuần để soạn thảo báo cáo tổng hợp dự án. Tính năng xuất báo cáo chuyên nghiệp trong 1 click giúp họ chuẩn bị tài liệu họp Hội đồng quản trị hoặc trình cơ quan ban ngành ngay lập tức, tiết kiệm hàng nghìn giờ làm việc thủ công.

### Mở rộng 3: AI Phân Tích Rủi Ro & Thẩm Định Pháp Lý Thông Minh (AI Smart Insights & Analytics)
*   **Mô tả:** Tích hợp Gemini Flash để tự động quét nội dung các tài liệu đính kèm (Giấy phép xây dựng, Quyết định giao đất) nhằm trích xuất ngày cấp, người ký, diện tích, và phát hiện các rủi ro pháp lý tiềm ẩn (ví dụ: Giấy phép sắp hết hạn, chồng chéo quy hoạch). Cung cấp dashboard động so sánh các dự án theo mật độ, hệ số sử dụng đất và hiển thị biểu đồ phân tích vị thế cạnh tranh.
*   **Tại sao đáng tiền (ROI):** Nâng tầm hệ thống từ một kho lưu trữ tĩnh trở thành một trợ lý AI thông minh hỗ trợ ra quyết định đầu tư. Giảm thiểu rủi ro pháp lý trị giá hàng triệu USD cho chủ đầu tư trước khi xuống tiền mua dự án mới.

---

## PHẦN 3: LỘ TRÌNH THỰC THI (ACTIONABLE ROADMAP)

### Đội ngũ Lập trình (Dev Team) - P0 (Vá lỗi hệ thống & Bảo mật)
- [ ] **Bước 1:** Áp dụng Hotfix cho `cmdk.tsx` và `project-explorer.tsx` để dập tắt hoàn toàn lỗi crash fuzzy search.
- [ ] **Bước 2:** Rà soát và thêm safe navigation (`?.`) vào toàn bộ các điểm truy cập `legalDossier` ở `legal-dossier-table.tsx`, `legal-timeline.tsx`, và file so sánh dự án.
- [ ] **Bước 3:** Chấm dứt cơ chế tự nâng quyền admin tự động tại `session.ts`, thay bằng cơ chế gán dựa trên email cấu hình cụ thể ở biến môi trường.
- [ ] **Bước 4:** Thiết lập cơ chế kiểm thử tự động (Unit Test với Jest/Playwright) giả lập dữ liệu Firestore trống/khuyết trường để đảm bảo không tái diễn lỗi crash runtime.

### Đội ngũ UI/UX (UI/UX Team) - P1 (Nâng tầm thẩm mỹ đắt tiền)
- [ ] **Bước 1:** Sửa lỗi Orphan UI tại Table View bằng cách đưa liên kết `Link` vào cột tên dự án, kèm hiệu ứng hover chân thực.
- [ ] **Bước 2:** Nâng cấp bảng biểu thô kệch thành giao diện Glassmorphism sang trọng với các hiệu ứng Backdrop Blur nhẹ nhàng, phối hợp hài hòa tông màu tối (sleek dark mode).
- [ ] **Bước 3:** Bổ sung Skeleton Loaders đồng bộ trên toàn bộ ứng dụng khi đang tải dữ liệu để loại bỏ cảm giác chờ đợi gián đoạn.
- [ ] **Bước 4:** Tối ưu hóa các hoạt ảnh mở rộng (morphing) của Gallery Lightbox bằng Framer Motion với cấu hình spring chuẩn `{ stiffness: 260, damping: 26 }`, mang lại cảm giác mượt mà và cao cấp.
- [ ] **Bước 5:** Thiết kế màn hình so sánh dự án trực quan dạng thẻ trượt (horizontal swiper) hỗ trợ kéo thả trực quan trên thiết bị di động.
