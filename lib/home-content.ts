import type { Project as FullProject } from "@library/types/project";

export interface Milestone {
  id: string;
  year: number;
  projectSlug: string | null;
  label: string;
}

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

export interface PortfolioStats {
  projectCount: number;
  regionCount: number;
  maxSiteAreaHa: number;
  maxSiteAreaProjectName: string;
  totalUnitsAnnounced: number;
}

/** Seed milestones — SPEC §H7. Same source-dated copy as the Local production site. */
export function buildMilestones(): Milestone[] {
  return [
    { id: "m-2010-hhc", year: 2010, projectSlug: "hong-hac-city", label: "GCNĐT Hồng Hạc City lần đầu (15/12/2010)" },
    { id: "m-2021-har", year: 2021, projectSlug: "harmonie", label: "Chấp thuận chủ trương đầu tư Harmonie (QĐ 3103/QĐ-UBND, 30/12/2021)" },
    { id: "m-2023-scu", year: 2023, projectSlug: "the-sculptura", label: "Quy hoạch chi tiết 1/500 The Sculptura (QĐ 73/QĐ-BQLKN, 28/11/2023)" },
    { id: "m-2024-scu", year: 2024, projectSlug: "the-sculptura", label: "Giấy phép xây dựng The Sculptura (13/GPXD-BQLKN, 27/12/2024)" },
    { id: "m-2025-scu-start", year: 2025, projectSlug: "the-sculptura", label: "Khởi công The Sculptura (25/06/2025)" },
    { id: "m-2025-scu-reg-eligible", year: 2025, projectSlug: "the-regency", label: "The Regency đủ điều kiện bán 114 căn (16348/SXD-PTĐT, 18/11/2025)" },
    { id: "m-2025-scu-eligible", year: 2025, projectSlug: "the-sculptura", label: "The Sculptura đủ điều kiện bán 75 căn (14411/SXD-PTĐT, 03/11/2025)" },
    { id: "m-2026-reg-start", year: 2026, projectSlug: "the-regency", label: "Khởi công The Regency (28/02/2026)" },
    { id: "m-2026-har-sale", year: 2026, projectSlug: "harmonie", label: "Harmonie mở bán đợt 1 (8139/SXD-PTĐT)" },
    { id: "m-2026-hhc-ph2", year: 2026, projectSlug: "hong-hac-city", label: "Hồng Hạc City đủ điều kiện bán 724 căn GĐ2 (15/04/2026)" },
    { id: "m-2028-har-completion", year: 2028, projectSlug: "harmonie", label: "Harmonie dự kiến hoàn thành (Quý 3/2028)" },
  ];
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

export function getPortfolioStats(projects: FullProject[]): PortfolioStats {
  const regions = new Set(projects.map((p) => p.region));
  const bySiteArea = [...projects].sort((a, b) => (b.siteArea ?? 0) - (a.siteArea ?? 0));
  const largest = bySiteArea[0];
  const totalUnitsAnnounced = projects.reduce((sum, p) => {
    if (p.totalUnits) return sum + p.totalUnits;
    if (p.unitsByPhase) return sum + p.unitsByPhase.reduce((s, ph) => s + ph.units, 0);
    return sum;
  }, 0);
  return {
    projectCount: projects.length,
    regionCount: regions.size,
    maxSiteAreaHa: Math.round(((largest?.siteArea ?? 0) / 10000) * 100) / 100,
    maxSiteAreaProjectName: largest?.displayNameVi ?? "",
    totalUnitsAnnounced,
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
