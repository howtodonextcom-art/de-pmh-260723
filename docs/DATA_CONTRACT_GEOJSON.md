# DED-PMH v0 — GeoJSON data contract

Ngày cập nhật: 2026-07-21

Tài liệu này định nghĩa **hợp đồng dữ liệu** cho mọi file GeoJSON dùng trong v0 Track A, và ranh giới trung thực giữa "có dữ liệu hình học" và "có dữ liệu định giá/pháp lý theo từng lô". Mục tiêu: một agent hoặc dev tương lai thêm GeoJSON mới không vô tình khiến UI/CTA ngụ ý dữ liệu chính xác hơn thực tế.

## 1. Hai tầng dữ liệu (bắt buộc phân biệt)

v0 Track A chỉ chứa **Tầng AOI (region-aoi)**. **Tầng Site (project-site)** là đặc tả cho tương lai (không có file nào thuộc tầng này trong repo hôm nay) — xem §4.

### Tầng `region-aoi` — vùng/khu vực (đã có, ví dụ: `portfolio-regions.geojson`)

Polygon/MultiPolygon xấp xỉ ranh giới tỉnh/thành để tô nổi bật trên bản đồ trang chủ. **Không phải** ranh giới hành chính chính thức, **không phải** thửa đất.

```ts
interface RegionAoiFeature {
  type: "Feature";
  properties: {
    id: string; // slug ổn định, vd "bac-ninh"
    name: string; // tên hiển thị, vd "Bắc Ninh"
    fill?: string; // gợi ý màu hex — trang trí, map-shell hiện không đọc field này
  };
  geometry: Polygon | MultiPolygon;
}
```

### Tầng `project-site` — dự án / lô đất (CHƯA CÓ file nào — đặc tả cho tương lai)

Một `FeatureCollection` **theo từng `projectSlug`** (khớp `Project.slug` trong `lib/types.ts`), hoặc theo từng khu vực nếu nhóm nhiều dự án. Mỗi Feature = 1 dự án hoặc 1 lô/phân khu.

```ts
interface ProjectSiteFeature {
  type: "Feature";
  properties: {
    id: string; // id ổn định của feature (không nhất thiết = projectSlug nếu 1 dự án nhiều lô)
    projectSlug: string; // PHẢI khớp Project.slug đang tồn tại trong dữ liệu dự án
    name: string;
    status: FieldStatus; // "da-co-du-lieu" | "chua-xac-thuc" | "mau-thuan" | "chua-co-du-lieu" | "bao-mat"
                          // (enum tại vendor/library/types/project.ts, dùng lại — không định nghĩa enum status thứ hai)
  };
  geometry: Polygon | MultiPolygon | Point;
}
```

Không có trường giá/diện tích bắt buộc ở tầng geometry — dữ liệu định giá thuộc `Project`/`LegalDossier` (nguồn khác), GeoJSON chỉ mang hình học + liên kết `projectSlug` + trạng thái xác thực của chính hình học đó.

## 2. Checklist: "thiếu dữ liệu ⇒ không được ngụ ý gói C / Δ giá"

Trước khi bất kỳ UI nào dùng một `project-site` FeatureCollection để hiển thị packaging tier (gói A/B/C) hoặc chênh lệch giá (Δ) theo lô, **tất cả** các điều sau phải đúng:

- [ ] Feature có `status: "da-co-du-lieu"` (không phải `chua-xac-thuc`, `mau-thuan`, `chua-co-du-lieu`, hay `bao-mat`)
- [ ] `projectSlug` khớp một `Project.slug` có thật trong dữ liệu dự án (không phải slug tự đặt/giả định)
- [ ] Dữ liệu giá/gói nằm trong `Project`/`LegalDossier` với `SourceRef` (nguồn, ngày tra cứu) — GeoJSON không tự mang giá
- [ ] Nếu bất kỳ điều trên sai/thiếu → UI phải hiển thị nhãn trạng thái tương ứng (`StatusBadge`) thay vì số liệu, **không** hiển thị giá ước tính hoặc gói ngụ ý

Nếu checklist không đạt: hiển thị "Chưa có dữ liệu" / "Chưa xác thực" — không suy diễn, không nội suy giá từ lô lân cận.

## 3. Ví dụ tuân thủ: `portfolio-regions.geojson`

`v0/public/geo/portfolio-regions.geojson` là mẫu **tuân thủ tầng `region-aoi`**:

- 2 Feature (`bac-ninh`, `tp-hcm`), mỗi Feature có `id` + `name` đúng contract §1
- Polygon là **AOI xấp xỉ, đơn giản hóa thủ công** — đã ghi rõ trong `v0/public/geo/ATTRIBUTION.md`: không phải ranh giới hành chính chính thức, không phải hình học thửa đất sa bàn
- Không có trường `status`/`projectSlug`/giá — đúng vì đây là tầng AOI, không phải tầng project-site — không vi phạm checklist §2 vì UI (`region-map-canvas.tsx`) chỉ dùng nó để tô màu vùng, không hiển thị giá hay gói theo polygon này

Đây là **file duy nhất** thuộc dạng GeoJSON trong repo tính đến ngày cập nhật — chưa có file `project-site` nào, nên checklist §2 hiện áp dụng dưới dạng phòng ngừa cho tương lai, không có vi phạm nào đang tồn tại để sửa.

## 4. Bộ validator

`v0/lib/geo/geojson-contract.ts` export `validateRegionAoiCollection()` và `validateProjectSiteCollection()` — kiểm tra field bắt buộc theo §1, không phụ thuộc thư viện ngoài (không thêm `zod` vào `package.json` cho việc này — repo hiện chưa có zod).

`v0/lib/geo/load-geojson.ts` export `loadGeoJson(url, kind)` — fetch + validate; nếu invalid: trong `development` log `console.warn` với danh sách lỗi và trả về `null` ("fail soft" — không throw, không crash trang); trong `production` trả về `null` im lặng (không log ra console người dùng cuối). Không có call site nào trong app dùng loader này hôm nay — `region-map-canvas.tsx` vẫn để MapLibre tự fetch `GEO_URL` trực tiếp (không đổi hành vi Wave-2 đã chốt); loader tồn tại như tiện ích sẵn sàng cho tầng `project-site` tương lai.

## 5. Không thuộc phạm vi tài liệu này

- Không vendor 397 lô đất sa bàn vào v0 (xem `v0/lib/map-shell/README.md` §L2 story)
- Không định nghĩa lại `FieldStatus` — dùng lại enum đã có tại `vendor/library/types/project.ts`
- Không yêu cầu mọi dự án phải có GeoJSON — 4 dự án hiện tại vận hành hoàn toàn không cần geometry cấp lô
