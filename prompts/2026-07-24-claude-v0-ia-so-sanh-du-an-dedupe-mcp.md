# CLAUDE CODE PROMPT
# DED-PMH v0 — IA: GỠ TRÙNG `/so-sanh` ↔ `/du-an?xem=bang`
# Workspace: Z:\Coding\260719-DE\v0
# Mode: DECIDE → IMPLEMENT → VERIFY
# Source claim: reports/2026-07-23-10-22-audit-thuong-mai-ded-pmh-v0.md
#   (§II hàng “/so-sanh vs /du-an?xem=bang”; §V “Làm rõ vai trò… 1–2 giờ”)
# Sub-agents: 3 · Repair loops: ≤2
# Constraint: Track A UI shell only — no Firebase/backend; no redesign unrelated pages

---

## 0. Problem (đã xác minh trong code — không đoán)

Hai URL đều mount cùng component `CompareTable` (`components/project/compare-table.tsx`):
- `app/so-sanh/page.tsx` → full-page compare (nav “So sánh”)
- `components/project/project-explorer.tsx` khi `?xem=bang` → cùng bảng sau filter

Field set dùng chung: `vendor/library/lib/data/compare-fields.ts` (`COMPARE_FIELDS`, SPEC §3.3).

Pain: người dùng / người mua không biết đâu là nguồn sự thật so sánh; nav + CTA home (“Xem bảng so sánh” → `/so-sanh`) + toggle “Bảng” trên `/du-an` cạnh tranh nhau.

**Out of scope (audit khác):** hotlink ảnh, branded 404, i18n drawer, deploy lag, gallery virtualization.

---

## 1. Decision lock (BẮT BUỘC chọn đúng 1 — ghi vào báo cáo trước khi code)

| Option | Mô tả | Khi chọn |
|--------|--------|----------|
| **A — Single source** | `/so-sanh` = nơi so sánh duy nhất. Trên `/du-an`, bỏ/`redirect` chế độ `xem=bang` (hoặc đổi toggle thành link “Mở so sánh” → `/so-sanh`, giữ filter state nếu hợp lý qua query). | Ưu tiên rõ IA, giảm trùng UI |
| **B — Differentiate** | Giữ cả hai URL nhưng **khác job**: `/du-an?xem=bang` = bảng catalog có filter/sort (danh mục dạng bảng); `/so-sanh` = so sánh chuyên sâu (ẩn hàng giống + legal summary / copy rõ “So sánh 7 trường”). Copy + H1 + nav label phải phản ánh khác biệt; không được nhìn như clone. | Cần cả browse-table và compare-deep |
| **C — Canonical + alias** | Giữ `/so-sanh` làm canonical; `/du-an?xem=bang` soft-redirect (308/replace) hoặc deep-link tới `/so-sanh` với note. | Muốn URL cũ không gãy, dứt điểm trùng |

**Chốt thực thi (human OK 2026-07-24): Option A** (+ soft-redirect `?xem=bang` → `/so-sanh` như nhánh C nhẹ).

DoD Option A:
1. `/du-an` không còn mount `CompareTable`; chỉ lưới card + CTA/link tới `/so-sanh`.
2. Bookmark `/du-an?xem=bang` → client replace sang `/so-sanh`.
3. Nav / CMDK / home CTA vẫn trỏ `/so-sanh` (canonical).

---

## 2. How to use

1. Browser-first: mở local `http://localhost:3000/so-sanh` và `/du-an?xem=bang` — chụp trước/sau.
2. Agent-01 Decision: đọc 2 page + `project-explorer` + nav/CMDK/home CTA + e2e references; chốt A/B/C.
3. Agent-02 Implement: chỉ file IA/nav/explorer/compare/i18n/e2e liên quan.
4. Agent-03 Verify: tsc, e2e affected, smoke 2 URL, cập nhật docs ngắn nếu WHAT_YOU_BUY / DEMO_SCRIPT còn claim cũ.
5. Báo cáo: `reports/2026-07-24-v0-ia-so-sanh-du-an-dedupe.md` + screenshots `reports/assets/ia-dedupe-*`.

Scope lock:
```text
WRITE: app/so-sanh/**, app/du-an/** (chỉ nếu cần),
       components/project/project-explorer.tsx, compare-table.tsx (chỉ nếu B),
       components/shared/*nav*|cmdk|site-header (nếu link),
       lib/i18n/*.json, e2e/* liên quan, docs WHAT_YOU_BUY / DEMO nếu claim đổi,
       reports/2026-07-24-v0-ia-so-sanh-du-an-dedupe.md + assets
READ:  audit thương mại §II/§V, compare-fields, home updates CTA
NO:    image pipeline, not-found, unrelated luxury polish, commit/push trừ khi human hỏi
```

---

## 3. Acceptance criteria

| ID | Criterion |
|----|-----------|
| AC1 | Báo cáo ghi rõ option A/B/C + lý do 3–5 câu |
| AC2 | Sau thay đổi, người mới vào site trong ≤10s biết đâu là “trang so sánh chính” (nav + H1 + CTA nhất quán) |
| AC3 | Không còn hai UI nhìn như clone không giải thích (A/C: một chỗ bảng; B: khác job rõ ràng trên UI) |
| AC4 | `pnpm exec tsc --noEmit` = 0; e2e liên quan so-sanh / du-an / home CTA PASS |
| AC5 | CMDK + header + home “Xem bảng so sánh” trỏ đúng canonical |
| AC6 | Mobile `/so-sanh` @375 vẫn accordion / không horizontal bleed |
| AC7 | Smoke markdown + trước/sau PNG |
| AC8 | Không đụng hotlink ảnh / 404 / i18n toàn cục ngoài copy cần cho IA |

---

## 4. Sub-agents

**01 — Decide:** Matrix A/B/C vs nav/DEMO/e2e cost; chốt 1 option.  
**02 — Implement:** Theo DoD option; tối thiểu diff.  
**03 — Verify + Report:** AC1–AC8; ghi “CLAIM audit vs LIVE sau fix”.

---

## 5. Done when

PM mở `/du-an` và `/so-sanh` không còn hỏi “hai trang này khác gì?” — và báo cáo AC xanh.
