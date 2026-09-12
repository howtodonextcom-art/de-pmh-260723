# MASTER PROMPT — CMS Lat/Lng → pin đúng chỗ
# Multi-Agent Orchestration Contract (DED-PMH / de-pmh-260723)

**Date:** 2026-09-12 10:35 (UTC+7)  
**Repo:** `c:\Code\2026\de-pmh-260723`  
**Feature:** CMS Vĩ độ / Kinh độ → marker dự án trên Home map + điều hướng đúng  
**Sub-agents:** A1 Evidence Scout · A2 Implementation Engineer · A3 Browser QA · A4 Adversarial Reviewer  
**Status:** Prompt sẵn sàng thực thi khi human OK. Không commit/push trừ khi được yêu cầu tường minh.

Bạn là CONDUCTOR (agent cha) trên repo `c:\Code\2026\de-pmh-260723`.
Bạn không làm một mình: phải điều phối **ít nhất 3 sub-agent** qua Cursor Task tool.
Mục đích: khi human nhập Vĩ độ / Kinh độ trong CMS, hệ thống persist và vẽ đúng tọa độ từng dự án; bấm pin tới đúng dự án.
Vòng đời: Ý tưởng → Kiểm chứng dữ liệu thật → Code → Test MCP trình duyệt → Fix → Pass.
Toàn quyền kỹ thuật. Không hỏi human. Không commit/push trừ khi human yêu cầu tường minh trong phiên này.

---

## A. Vì sao tách agent (bắt buộc tuân)

Một agent vừa viết map vừa tự chấm MCP sẽ đoán mò — đúng failure mode vòng trước (sửa `REGION_LNG_LAT` nhưng bỏ qua `coordinates` đã nhập; hai `citySlug` sống sót).
Tách ba vai: **chứng cứ** / **hiện thực** / **phản chứng**. Conductor chỉ merge, gate, và viết báo cáo. Không Pass bằng lời của Implementer.

---

## B. Roster — tối thiểu 3, khuyến nghị 4

Dùng Cursor `Task` tool. Không bịa loại agent. Map đúng:

| ID | Tên | `subagent_type` | Quyền | Được làm | Cấm |
|---|---|---|---|---|---|
| A1 | Evidence Scout | `explore` | đọc | Dump catalog, trace persist, file:line root cause | Sửa file, Pass, “chắc là null” |
| A2 | Implementation Engineer | `generalPurpose` | đọc+ghi | W0–W3 theo Evidence Brief | Bịa tọa độ; bỏ qua A1; commit/push |
| A3 | Browser QA | `generalPurpose` | đọc + browser MCP | V1–V6 trên `localhost:8001`; biên bản số | Sửa code trừ khi Conductor ra lệnh vòng Fix; tuyên bố Pass |
| A4 | Adversarial Reviewer (bắt buộc trước Pass) | `generalPurpose` | đọc | Diff + tsc/vitest + đối chiếu DoD; verdict PASS/FAIL | Viết feature mới; nới DoD |

A1+A2+A3 là sàn. A4 không được bỏ. Nếu A3 FAIL: Conductor → A2 Fix → A3 lại → A4. Tối đa 2 vòng Fix rồi báo residual thành thật, không giả Pass.

`model`: `inherit` trừ khi human chỉ định model trong danh sách cho phép.
`environment`: `local`. Không `cloud` trừ khi human yêu cầu.
Prompt gửi sub-agent phải **tự chứa** ngữ cảnh (chúng không thấy chat cha). Kèm đường dẫn tuyệt đối, DoD, anti-patterns, Evidence Brief (khi đã có).

---

## C. Giao thức điều phối (cổng — không song song bừa)

```
PHASE 0  Conductor: đọc constraint repo + file neo (không sửa).
PHASE 1  SPAWN A1 (explore). BLOCK cho đến khi có Evidence Brief.
         Gate G1: thiếu bảng 12 dòng slug|city|region|lat|lng → cấm A2.
PHASE 2  SPAWN A2 với Evidence Brief nguyên văn. BLOCK.
         Gate G2: A2 phải liệt kê file đã đụng + xác nhận không fallback 16°N.
PHASE 3  SPAWN A3 (browser). Có thể song song A4-draft? KHÔNG — A4 sau A3.
         Gate G3: A3 phải có số marker + [lng,lat] đọc từ map, không “nhìn có vẻ trong VN”.
PHASE 4  Nếu A3 FAIL → A2 Fix (delta) → A3 retest. Rồi SPAWN A4.
         Gate G4: A4 PASS mới được viết CLAUDE.md Round + báo cáo cuối.
PHASE 5  Conductor: CLAUDE.md Round mới; báo cáo mục H. Không commit/push.
```

Song song được phép: không có trong vòng này ngoài việc Conductor đọc file trong lúc A1 chạy. **Cấm** spawn A2 song song A1.

Conductor được tự đọc/sửa nếu A2 kẹt merge conflict — ghi rõ trong báo cáo “conductor hotfix”, rồi vẫn phải A3+A4.

---

## D. Definition of Done (quan sát được — A3/A4 chấm, không A2)

D1. Bảng thật 12/12: `slug | displayNameVi | city | region | lat | lng | source`.
D2. Mỗi project có `lat`+`lng` finite → đúng 1 pin; sai số marker vs persist < 1e-5 độ.
D3. Thiếu tọa độ: không thả `{lng:106, lat:16}`. Không pin ma ngoài khơi.
D4. Bấm pin → `/du-an/[slug]` đúng dự án.
D5. Thẻ vùng: 1 dự án → chi tiết; ≥2 → `/du-an?khu-vuc=<slug-thống-nhất>` và list > 0.
D6. Một `citySlug` duy nhất (vendor). Home + explorer + dropdown cùng hàm. `""` city = trống (`city.trim() || region.trim()`), không `??` trần.
D7. MCP desktop ~1440 + mobile 375; 0 console error mới; `tsc --noEmit` sạch. Không regress i18n/passcode/vendor.
D8. `CLAUDE.md` Round mới. Không commit/push.

---

## E. Nguồn sự thật (khóa)

1. Pin dự án = `project.coordinates` persist (CMS Lat/Lng; `vendor/library/types/project.ts`).
2. Collection Firestore `projects` qua `lib/catalog.ts`. Không geocode khi đã có số.
3. Form đã có input: `components/cms/project-form.tsx` ~L378–398. Human đã nhập (vd `lat=10.725881`, `lng≈106.711814`). Home bỏ qua field = bug.
4. Không invent / không “sửa giúp” 100↔106. Dump as-is.
5. Optional: CMS warning nếu ngoài bbox VN ~ lat 8–24, lng 102–110 — không block save.

City/region (chỉ để group/filter): `(city.trim() || region.trim() || "")`.

---

## F. Evidence Brief — output bắt buộc của A1 (schema)

A1 trả về đúng các heading sau (markdown):

```
# Evidence Brief
## Catalog dump (12)
| slug | displayNameVi | city | region | lat | lng | source |
## Persist path
- CMS patch → [file:line]
- Codec/REST → [file:line] (drop / đảo lat-lng? yes/no + bằng chứng)
- library-bridge / SlimProject có mang coordinates? yes/no + file:line
## Home map today
- Pin model: region-cluster | project (nêu số pin kỳ vọng nếu chạy code hiện tại)
- REGION_LNG_LAT keys + fallback 16°N file:line
- Có đọc p.coordinates? yes/no
## Dual citySlug
- home-content output cho từng city unique trong dump
- vendor region-slug output cho cùng chuỗi
- Bảng: city → slugHome → slugExplorer → match?
## Explorer
- Filter expression file:line (?? vs ||)
- Dropdown values hardcode?
## Recommendation for A2
- W0 cần sửa persist? yes/no
- Danh sách file tối thiểu
- Số project-pin kỳ vọng sau fix (= số dòng lat+lng hợp lệ)
```

A1 thoroughness: `very thorough`. Đọc thêm: `app/page.tsx`, `lib/home-content.ts`, `vendor/library/lib/data/region-slug.ts`, `components/project/project-explorer.tsx`, `lib/library-bridge.ts`, `lib/firebase/firestore-codec*`, `components/cms/project-form.tsx`, `lib/map-shell/region-pins.ts`, `components/home/vn-map.tsx`, `e2e/map.spec.ts`.

Nếu không query được Firestore: nói rõ; thử `getFullCatalog` / runtime store / API nội bộ. Không điền “null” vì không gọi được.

---

## G. Nhiệm vụ từng agent

### A1 — Evidence Scout (`explore`)

Prompt tối thiểu phải gồm: repo path, schema Evidence Brief, cấm đoán, cấm sửa file.
Mục tiêu: P1–P5 của vòng trước (dump, persist, Home ignore coords, dual slug, empty-string ??).

### A2 — Implementation Engineer (`generalPurpose`)

Chỉ chạy sau G1. Nhận Evidence Brief.

Kiến trúc chốt:
- Pin map = cấp dự án khi có tọa độ. Click → `/du-an/${slug}`.
- Cột phải = nhóm vùng. Click theo D5.
- `citySlug` đặt trong `vendor/library`; app import chiều đó. Xóa bản trùng ở `lib/home-content.ts` (re-export được).
- `REGION_LNG_LAT` key = slug. Cấm fallback `106,16`.
- GeoJSON `public/geo/portfolio-regions.geojson` không phải nguồn pin. Không bắt buộc vẽ đủ polygon Đồng Nai/Bình Dương.
- CMS: label “Vĩ độ (Latitude)” / “Kinh độ (Longitude)”; empty → `null`; không `Number("")===0`.
- Vendor không import `/lib` app.
- Không restyle Home (không phải vòng frontend-design).
- Test: codec round-trip một cặp số thật từ dump; slug lockstep (`Tp. HCM`/`TP.HCM`→`tp-hcm`, `Đồng Nai`→`dong-nai`, cụm Bình Dương một slug ổn định).
- Cập nhật `e2e/map.spec.ts` nếu selector/heading đổi — không xóa test vì “khó”.

Waves: W0 persist+bridge → W1 slug+filter+dropdown động → W2 Home payload project pins + fitBounds → W3 nav.

Output A2:
```
# Implementation Report
## Files touched
## Persist changes
## Slug canonical examples
## Pin payload shape
## leftover / risks
```

### A3 — Browser QA (`generalPurpose` + cursor-ide-browser)

Chỉ chạy sau G2. Không tin Implementation Report.

Môi trường: `http://localhost:8001` (dev `--webpack` đã có thì dùng; cấm spawn trùng port). Passcode cookie nếu gate bật.

V1. Đếm marker MapLibre = số dòng dump có lat+lng hợp lệ.
V2. Từng pin: CDP/GeoJSON `[lng,lat]` vs dump; không còn 16°N 106°E trừ khi CMS lưu đúng số đó.
V3. Bấm từng pin → URL + title đúng slug.
V4. Bấm từng thẻ vùng: 1→chi tiết; ≥2→catalog list>0 (HCM 9 không empty).
V5. Viewport 375: `scrollWidth===clientWidth`, bấm được pin.
V6. Hồi quy: `/du-an/hong-hac` Location; VI↔EN header; không đụng `/passcode` sai.

Output A3:
```
# QA Brief
## Environment (url, viewport, locale cookie)
## Marker count expected vs actual
## Pin table: slug | cms lat/lng | marker lng/lat | delta | in-VN?
## Click matrix: target | url | ok
## Region cards: label | dest | catalog count
## Console errors
## Verdict: PASS | FAIL + reproduction
```

Cấm: screenshot một phát rồi Pass. Cấm kết luận “trông như trong VN”.

### A4 — Adversarial Reviewer (`generalPurpose`)

Nhận diff + Evidence + QA Brief. Chạy `tsc --noEmit`, vitest liên quan, đọc file A2 đã sửa.
Hỏi: còn hai `citySlug`? còn `?? 16.0`? vendor import `/lib`? bịa tọa độ? A3 thiếu 1 pin trong dump?
Verdict `PASS` chỉ khi D1–D7 có bằng chứng. `FAIL` phải chỉ file:line.

---

## H. Ràng buộc repo (mọi agent)

- Không commit/push. Không `git config`. Không `--force`.
- `vendor/library` ↛ `/lib`.
- Không bịa `address` / `totalUnits` / lat-lng.
- Không nới passcode / không thêm KV.
- CMS/login/lab giữ VI; đổi label Lat/Lng là ngoại lệ.
- Dev: `next dev --webpack`.
- Identity GitHub không liên quan (không push).

Anti-patterns: patch riêng Harmonie; chỉ nới `REGION_LNG_LAT` rồi xong; giữ hai slug; fallback 16°N; geocode khi đã có số; A2 tự Pass; A3 Pass không có bảng delta.

---

## I. Báo cáo cuối — chỉ Conductor viết

1. Evidence Brief (rút gọn) + bảng P1.
2. Agent log: id, thời điểm, PASS/FAIL, 1 câu.
3. Files touched (A2 + conductor hotfix).
4. Trước/sau: số pin; 1 dự án có số CMS — form vs marker.
5. Click matrix (copy A3).
6. A4 verdict + lệnh tsc/vitest.
7. Residual thành thật (dự án chưa nhập tọa độ; geojson 2 polygon; i18n “1 projects”).
8. Không tự chấm 100/100.

Bắt đầu PHASE 0+1. Cấm A2 trước khi có bảng 12 dòng.
