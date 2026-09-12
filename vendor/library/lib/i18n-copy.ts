/**
 * Data-layer chrome copy (VI/EN). Kept inside vendor/library so builders
 * never import the app's `/lib` or next-intl. UI call sites still own the
 * React dictionaries in `lib/i18n/*.json` — a unit test asserts the two
 * maps stay in lockstep for status / field-status / fact-grid / compare /
 * legal-group / project-type keys.
 */
import type { NumberLocale } from "./i18n-format";

export type CopyLocale = NumberLocale;

export const EMPTY_VALUE: Record<CopyLocale, string> = {
  vi: "Chưa có",
  en: "Not available",
};

export const UNPUBLISHED: Record<CopyLocale, string> = {
  vi: "Chưa công bố",
  en: "Not yet published",
};

export const PROJECT_STATUS_LABELS: Record<CopyLocale, Record<string, string>> = {
  vi: {
    "dang-trien-khai": "Đang triển khai",
    "dang-ban": "Đang mở bán",
    "da-ban-giao": "Đã bàn giao",
    "sap-mo-ban": "Sắp mở bán",
    "da-hoan-thanh": "Đã hoàn thành",
    "chuan-bi-mo-ban": "Chuẩn bị mở bán",
  },
  en: {
    "dang-trien-khai": "In development",
    "dang-ban": "Now selling",
    "da-ban-giao": "Handed over",
    "sap-mo-ban": "Coming soon",
    "da-hoan-thanh": "Completed",
    "chuan-bi-mo-ban": "Preparing to launch",
  },
};

export function projectStatusLabel(status: string, locale: CopyLocale = "vi"): string {
  return PROJECT_STATUS_LABELS[locale][status] ?? PROJECT_STATUS_LABELS.vi[status] ?? status;
}

export const FIELD_STATUS_LABELS: Record<CopyLocale, Record<string, string>> = {
  vi: {
    "da-co-du-lieu": "Đã có dữ liệu",
    "chua-xac-thuc": "Chưa xác thực",
    "mau-thuan": "Mâu thuẫn",
    "chua-co-du-lieu": "Chưa có dữ liệu",
    "bao-mat": "Bảo mật",
  },
  en: {
    "da-co-du-lieu": "Has data",
    "chua-xac-thuc": "Unverified",
    "mau-thuan": "Conflict",
    "chua-co-du-lieu": "No data",
    "bao-mat": "Restricted",
  },
};

export const FACT_GRID_LABELS: Record<CopyLocale, Record<string, string>> = {
  vi: {
    location: "Vị trí",
    type: "Loại hình",
    scale: "Quy mô",
    units: "Số căn",
    siteArea: "Diện tích đất",
    conceptArchitect: "Đơn vị concept KT",
    status: "Trạng thái",
    updated: "Cập nhật",
  },
  en: {
    location: "Location",
    type: "Type",
    scale: "Scale",
    units: "Units",
    siteArea: "Site area",
    conceptArchitect: "Concept architect",
    status: "Status",
    updated: "Updated",
  },
};

export const COMPARE_FIELD_LABELS: Record<CopyLocale, Record<string, string>> = {
  vi: {
    "lo-dat": "Lô đất",
    "khu-vuc": "Khu vực",
    "loai-hinh": "Loại hình",
    "quy-mo-dat": "Diện tích đất",
    gfa: "GFA",
    "so-can": "Số căn",
    "don-vi-thiet-ke": "Đơn vị thiết kế",
    "tong-thau": "Tổng thầu thi công",
    "tinh-trang-ban": "Tình trạng",
  },
  en: {
    "lo-dat": "Plot",
    "khu-vuc": "Area",
    "loai-hinh": "Type",
    "quy-mo-dat": "Site area",
    gfa: "GFA",
    "so-can": "Units",
    "don-vi-thiet-ke": "Design unit",
    "tong-thau": "Main contractor",
    "tinh-trang-ban": "Status",
  },
};

export const PROJECT_TYPE_LABELS: Record<CopyLocale, Record<string, string>> = {
  vi: {
    "do-thi-sinh-thai": "Đô thị sinh thái",
    "can-ho-hang-sang": "Căn hộ hạng sang",
    "can-ho-premium": "Căn hộ premium",
    "can-ho": "Căn hộ",
    "thap-tang": "Thấp tầng",
    "cao-tang": "Cao tầng",
  },
  en: {
    "do-thi-sinh-thai": "Ecological township",
    "can-ho-hang-sang": "Luxury apartment",
    "can-ho-premium": "Premium apartment",
    "can-ho": "Apartment",
    "thap-tang": "Low-rise",
    "cao-tang": "High-rise",
  },
};

export function projectTypeLabel(type: string, locale: CopyLocale = "vi"): string {
  return PROJECT_TYPE_LABELS[locale][type] ?? PROJECT_TYPE_LABELS.vi[type] ?? type.replace(/-/g, " ");
}

export const LEGAL_GROUP_LABELS: Record<CopyLocale, Record<string, string>> = {
  vi: {
    investmentApproval: "Chấp thuận chủ trương đầu tư",
    landAllocation: "Giao đất / cho thuê đất",
    detailedPlanning: "Quy hoạch chi tiết 1/500",
    constructionPermits: "Giấy phép xây dựng",
    constructionPermitsNote: "Ghi chú GPXD",
    salesEligibility: "Đủ điều kiện bán",
    designUnit: "Đơn vị thiết kế",
    mainContractor: "Tổng thầu thi công",
    disputes: "Tranh chấp / cảnh báo",
  },
  en: {
    investmentApproval: "Investment policy approval",
    landAllocation: "Land allocation / lease",
    detailedPlanning: "1/500 detailed planning",
    constructionPermits: "Construction permit",
    constructionPermitsNote: "Construction-permit note",
    salesEligibility: "Sales eligibility",
    designUnit: "Design unit",
    mainContractor: "Main contractor",
    disputes: "Disputes / warnings",
  },
};

export function legalGroupLabel(id: string, locale: CopyLocale = "vi"): string {
  return LEGAL_GROUP_LABELS[locale][id] ?? LEGAL_GROUP_LABELS.vi[id] ?? id;
}

export function scalePhrase(
  kind: "subdivision" | "block" | "floor",
  count: number,
  locale: CopyLocale,
): string {
  if (locale === "en") {
    if (kind === "subdivision") return `${count} ${count === 1 ? "zone" : "zones"}`;
    if (kind === "block") return `${count} ${count === 1 ? "block" : "blocks"}`;
    return `${count} ${count === 1 ? "floor" : "floors"}`;
  }
  if (kind === "subdivision") return `${count} phân khu`;
  if (kind === "block") return `${count} block${count > 1 ? "s" : ""}`;
  return `${count} tầng`;
}

export function unitsPhaseTooltip(locale: CopyLocale): string {
  return locale === "en" ? "Whole-site total not published" : "Chưa công bố tổng toàn khu";
}

export function unitsPhaseLine(units: number, phaseHead: string, locale: CopyLocale): string {
  return locale === "en" ? `${units} units ${phaseHead}` : `${units} căn ${phaseHead}`;
}

export function addressTooltip(address: string, locale: CopyLocale): string {
  return locale === "en" ? `Address: ${address}` : `Địa chỉ: ${address}`;
}

export function gfaTooltip(locale: CopyLocale): string {
  return locale === "en"
    ? "No published source covers every project."
    : "Chưa có nguồn công bố cho mọi dự án.";
}

export function updatedTooltip(date: string, locale: CopyLocale): string {
  return locale === "en" ? `Updated ${date}` : `Cập nhật ${date}`;
}
