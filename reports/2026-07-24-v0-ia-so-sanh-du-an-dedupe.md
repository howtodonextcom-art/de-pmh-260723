# DED-PMH v0 — IA dedupe: `/so-sanh` ↔ `/du-an?xem=bang`

Ngày: 2026-07-24  
Prompt: `prompts/2026-07-24-claude-v0-ia-so-sanh-du-an-dedupe-mcp.md`  
Claim nguồn: `reports/2026-07-23-10-22-audit-thuong-mai-ded-pmh-v0.md` (§II + §V)

## 1. Decision — Option **A** (Single source)

**Chốt:** `/so-sanh` là **nguồn so sánh duy nhất**. `/du-an` chỉ còn danh mục lưới + CTA dẫn sang so sánh.

Lý do (ngắn):
1. Audit §V yêu cầu “một nguồn sự thật hoặc phân biệt rõ” — A dứt điểm trùng với chi phí thấp nhất.
2. Nav / CMDK / home CTA đã trỏ `/so-sanh` — giữ canonical đó, không nhân đôi UI.
3. `?xem=bang` chỉ là alias lịch sử → soft-redirect client (nhánh C nhẹ) để bookmark không gãy.
4. Option B (differentiate) tốn copy/IA hơn mà catalog-table gần như clone compare — ROI kém.
5. Track A = UI shell bán demo: rõ “vào đâu để so sánh” quan trọng hơn giữ toggle view.

## 2. Thay đổi

| File | Việc |
|------|------|
| `components/project/project-explorer.tsx` | Bỏ mount `CompareTable` + toggle lưới/bảng; thêm link “So sánh dự án” → `/so-sanh`; `useEffect` redirect khi `xem=bang` |
| `lib/i18n/vi.json` / `en.json` | `viewGrid`/`viewTable` → `openCompare` |
| `docs/WHAT_YOU_BUY.md` | `/du-an` / `/so-sanh` mô tả canonical |
| `docs/DEMO_SCRIPT_15MIN.md` | Bước 5 talk track |
| `e2e/regression.spec.ts` | Spec IA: CTA + redirect |
| `app/du-an/page.tsx` | Comment toolbar |

## 3. Evidence

Screenshots: `reports/assets/ia-dedupe-du-an-after.png`, `ia-dedupe-so-sanh-after.png`, `ia-dedupe-redirect-after.png`, `ia-dedupe-so-sanh-375.png`

| Check | Kết quả |
|-------|---------|
| `/du-an` có link `So sánh dự án` → `/so-sanh` | PASS |
| `/du-an` không còn “Ẩn hàng giống nhau” | PASS |
| `/du-an?xem=bang` → `/so-sanh` | PASS |
| Compare @375 accordion | PASS (e2e) |
| `tsc --noEmit` | PASS |
| e2e regression IA + Compare @375 | PASS |
| home CTA `/so-sanh` | PASS (home H10) |

## 4. CLAIM audit vs LIVE sau fix

| Claim audit | LIVE sau fix | Verdict |
|-------------|--------------|---------|
| Hai URL render gần như cùng 1 bảng so sánh | Chỉ `/so-sanh` còn bảng; `/du-an` = lưới + CTA | **FIXED** |
| Cần hợp nhất hoặc phân biệt rõ | Option A + redirect alias | **FIXED** |

## 5. AC

| ID | Kết quả |
|----|---------|
| AC1 Option A + lý do | PASS |
| AC2 Canonical rõ ≤10s | PASS |
| AC3 Không còn clone UI | PASS |
| AC4 tsc + e2e liên quan | PASS (IA specs) |
| AC5 CMDK/header/home → `/so-sanh` | PASS (không đổi; đã đúng) |
| AC6 Mobile accordion | PASS |
| AC7 Report + PNG | PASS |
| AC8 Không đụng ảnh/404/i18n thừa | PASS |

**Scorecard: PASS.**
