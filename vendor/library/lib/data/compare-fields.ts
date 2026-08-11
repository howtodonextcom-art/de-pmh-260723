import { canShowConceptArchitect } from "./architect-visibility";
import { projectStatusLabel } from "../../components/layout/project-status-label";
import type { FieldStatus, Project } from "../../types/project";

export interface CompareCell {
  display: string;
  status: FieldStatus;
  tooltip?: string;
}

export interface CompareField {
  id: string;
  label: string;
  cell: (p: Project) => CompareCell;
}

/** Soft cap for side-by-side project columns (Variant A — Branch matrix). */
export const COMPARE_COLUMN_CAP = 4;

const PROJECT_TYPE_LABEL: Record<string, string> = {
  "do-thi-sinh-thai": "Đô thị sinh thái",
  "can-ho-hang-sang": "Căn hộ hạng sang",
  "can-ho-premium": "Căn hộ premium",
  "can-ho": "Căn hộ",
  "thap-tang": "Thấp tầng",
  "cao-tang": "Cao tầng",
};

/** Plot codes known from portfolio IA / addresses (honest fallbacks only). */
const PLOT_CODE_BY_SLUG: Record<string, string> = {
  "the-regency": "CR5-1B",
  "the-sculptura": "H14-3",
};

function plotCell(p: Project): CompareCell {
  const mapped = PLOT_CODE_BY_SLUG[p.slug];
  if (mapped) {
    return { display: mapped, status: "da-co-du-lieu" };
  }
  const lo = p.address?.match(/Lô\s+([A-Za-z0-9][A-Za-z0-9/-]*)/i)?.[1];
  if (lo) {
    return { display: lo, status: "da-co-du-lieu", tooltip: p.address };
  }
  const thua = p.address?.match(/Thửa đất số\s+\d+/i)?.[0];
  if (thua) {
    return { display: thua, status: "da-co-du-lieu", tooltip: p.address };
  }
  return {
    display: "Chưa có",
    status: "chua-co-du-lieu",
    tooltip: p.address ? `Địa chỉ: ${p.address}` : undefined,
  };
}

function unitsCell(p: Project): CompareCell {
  if (p.slug === "hong-hac-city" && p.unitsByPhase?.length) {
    return {
      display: p.unitsByPhase.map((u) => `${u.units} căn ${u.phase.split(" ")[0]}`).join(" · "),
      status: p.unitsByPhaseStatus ?? "da-co-du-lieu",
      tooltip: "Chưa công bố tổng toàn khu — số liệu theo từng giai đoạn.",
    };
  }
  if (p.totalUnits) {
    return { display: `${p.totalUnits.toLocaleString("vi-VN")} căn`, status: p.totalUnitsStatus };
  }
  return { display: "Chưa có", status: p.totalUnitsStatus };
}

function designUnitCell(p: Project): CompareCell {
  if (canShowConceptArchitect(p) && p.conceptArchitect?.value) {
    return { display: p.conceptArchitect.value, status: p.conceptArchitect.status };
  }
  return {
    display: "Chưa có",
    status:
      p.conceptArchitect?.status === "da-co-du-lieu"
        ? "chua-xac-thuc"
        : (p.conceptArchitect?.status ?? "chua-co-du-lieu"),
  };
}

/**
 * Compare matrix rows — Lô đất first; trade name omitted (duplicates column headers).
 * Shared by `/so-sanh` (and any future table view).
 */
export const COMPARE_FIELDS: CompareField[] = [
  {
    id: "lo-dat",
    label: "Lô đất",
    cell: plotCell,
  },
  {
    id: "khu-vuc",
    label: "Khu vực",
    cell: (p) => ({
      display: p.region ?? "Chưa có",
      status: p.region ? "da-co-du-lieu" : "chua-co-du-lieu",
    }),
  },
  {
    id: "loai-hinh",
    label: "Loại hình",
    cell: (p) => {
      const types = p.projectType ?? [];
      const label = types.map((t) => PROJECT_TYPE_LABEL[t] ?? t).filter(Boolean).join(", ") || types[0];
      return { display: label || "Chưa có", status: label ? "da-co-du-lieu" : "chua-co-du-lieu" };
    },
  },
  {
    id: "quy-mo-dat",
    label: "Diện tích đất",
    cell: (p) =>
      p.siteArea
        ? {
            display: `${(p.siteArea / 10000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} ha`,
            status: p.siteAreaStatus,
            tooltip: p.siteAreaNote,
          }
        : { display: "Chưa có", status: p.siteAreaStatus },
  },
  {
    id: "gfa",
    label: "GFA",
    cell: () => ({
      display: "—",
      status: "chua-co-du-lieu",
      tooltip: "Chưa có nguồn công bố cho mọi dự án.",
    }),
  },
  {
    id: "so-can",
    label: "Số căn",
    cell: unitsCell,
  },
  {
    id: "don-vi-thiet-ke",
    label: "Đơn vị thiết kế",
    cell: designUnitCell,
  },
  {
    id: "tong-thau",
    label: "Tổng thầu thi công",
    cell: (p) => {
      const value = p.legalDossier?.mainContractor;
      return {
        display: value || "Chưa có",
        status: value ? "da-co-du-lieu" : "chua-co-du-lieu",
      };
    },
  },
  {
    id: "tinh-trang-ban",
    label: "Tình trạng",
    cell: (p) => {
      const label = p.status ? projectStatusLabel(p.status) : null;
      const eligibility = p.legalDossier?.salesEligibility ?? p.statusNote ?? undefined;
      return {
        display: label || "Chưa có",
        status: label ? "da-co-du-lieu" : "chua-co-du-lieu",
        tooltip: eligibility || undefined,
      };
    },
  },
];
