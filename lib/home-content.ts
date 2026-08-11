import type { Project as FullProject } from "@library/types/project";

export interface UpdateEntry {
  id: string;
  date: string;
  projectSlug: string;
  textVi: string;
}

export interface SiteSettings {
  brandStatementVi: string;
  maxLastVerifiedAt: string;
}

/** Seed updates feed — SPEC §H10 ("3 bản ghi mới nhất"). */
export function buildUpdates(): UpdateEntry[] {
  return [
    { id: "u-1", date: "2026-04-15", projectSlug: "hong-hac-city", textVi: "Hồng Hạc City đủ điều kiện bán 724 căn giai đoạn 2 (1512/SXD-N&BĐS, 2981/SXD-QLN)." },
    { id: "u-2", date: "2026-02-28", projectSlug: "the-regency", textVi: "The Regency chính thức khởi công tại lô CR5-1B, Khu The Crescent." },
    { id: "u-3", date: "2026-02-10", projectSlug: "harmonie", textVi: "Harmonie nghiệm thu móng, chuẩn bị giai đoạn thi công thân tháp." },
  ];
}

/** Site settings — brand statement per SPEC §5.2 (≤80 words, fact-first), same copy as Local. */
export function buildSiteSettings(projects: FullProject[]): SiteSettings {
  const maxLastVerifiedAt = projects.map((p) => p.lastVerifiedAt).sort().at(-1) ?? "";
  return {
    brandStatementVi:
      "DED-PMH tổng hợp và xác minh dữ liệu công khai của 4 dự án Phú Mỹ Hưng — Hồng Hạc City, The Regency, The Sculptura, Harmonie — để đội ngũ nội bộ tra cứu pháp lý, tiến độ và quy mô từ một nguồn duy nhất, minh bạch về nguồn và ngày cập nhật.",
    maxLastVerifiedAt,
  };
}

/** Real WGS84 coordinates for the H6 map (Option E — MapLibre pins, not an abstract SVG). */
export const REGION_LNG_LAT: Record<string, { lng: number; lat: number }> = {
  "Bắc Ninh": { lng: 106.076, lat: 21.186 },
  "TP.HCM": { lng: 106.721, lat: 10.729 },
};

const CITY_SLUG: Record<string, string> = {
  "Bắc Ninh": "bac-ninh",
  "TP.HCM": "tp-hcm",
};

export function citySlug(city: string): string {
  return CITY_SLUG[city] ?? city.toLowerCase().replace(/\s+/g, "-");
}
