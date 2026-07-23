import { canShowConceptArchitect } from "./architect-visibility";
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

const PROJECT_TYPE_LABEL: Record<string, string> = {
  "do-thi-sinh-thai": "Đô thị sinh thái",
  "can-ho-hang-sang": "Căn hộ hạng sang",
  "can-ho-premium": "Căn hộ premium",
  "can-ho": "Căn hộ",
  "thap-tang": "Thấp tầng",
  "cao-tang": "Cao tầng",
};

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

/** The 7 core fields shared by /so-sanh and the /du-an table view (SPEC §3.3, F4). */
export const COMPARE_FIELDS: CompareField[] = [
  {
    id: "khu-vuc",
    label: "Khu vực",
    cell: (p) => ({ display: p.region ?? "Chưa có", status: p.region ? "da-co-du-lieu" : "chua-co-du-lieu" }),
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
        ? { display: `${(p.siteArea / 10000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} ha`, status: p.siteAreaStatus, tooltip: p.siteAreaNote }
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
    id: "concept-kt",
    label: "Concept kiến trúc",
    cell: (p) =>
      canShowConceptArchitect(p) && p.conceptArchitect?.value
        ? { display: p.conceptArchitect.value, status: p.conceptArchitect.status }
        : {
            display: "Chưa có",
            status: p.conceptArchitect?.status === "da-co-du-lieu" ? "chua-xac-thuc" : (p.conceptArchitect?.status ?? "chua-co-du-lieu"),
          },
  },
  {
    id: "tinh-trang-ban",
    label: "Tình trạng bán",
    cell: (p) => ({
      display: p.legalDossier?.salesEligibility ?? p.statusNote ?? "Chưa có",
      status: p.legalDossier?.salesEligibility ? "da-co-du-lieu" : "chua-co-du-lieu",
    }),
  },
];
