import { canShowConceptArchitect } from "./architect-visibility";
import type { FieldStatus, Project } from "../../types/project";

export interface FactCell {
  label: string;
  value: string;
  status: FieldStatus;
  tooltip?: string;
}

function scaleDescriptor(p: Project): string {
  if (p.slug === "hong-hac-city") {
    return `${p.subdivisions?.length ?? 0} phân khu`;
  }
  const parts: string[] = [];
  if (p.blocks) parts.push(`${p.blocks} block${p.blocks > 1 ? "s" : ""}`);
  if (p.floors) parts.push(`${p.floors} tầng`);
  return parts.join(" · ") || "Chưa có";
}

function unitsDisplay(p: Project): { value: string; status: FieldStatus } {
  if (p.slug === "hong-hac-city" && p.unitsByPhase?.length) {
    return {
      value: p.unitsByPhase.map((u) => `${u.units} căn ${u.phase.split(" ")[0]}`).join(" · "),
      status: p.unitsByPhaseStatus ?? "da-co-du-lieu",
    };
  }
  if (p.totalUnits) return { value: `${p.totalUnits.toLocaleString("vi-VN")} căn`, status: p.totalUnitsStatus };
  return { value: "Chưa có", status: p.totalUnitsStatus };
}

/** D2 fact grid — 8 cells, GFA intentionally excluded (SPEC §3.4 D2). */
export function buildFactGrid(p: Project): FactCell[] {
  const units = unitsDisplay(p);
  return [
    { label: "Vị trí", value: p.address, status: "da-co-du-lieu" },
    {
      label: "Loại hình",
      value: p.projectType[0]?.replace(/-/g, " ") ?? "Chưa có",
      status: "da-co-du-lieu",
    },
    { label: "Quy mô", value: scaleDescriptor(p), status: "da-co-du-lieu" },
    {
      label: "Số căn",
      value: units.value,
      status: units.status,
      tooltip: p.slug === "hong-hac-city" ? "Chưa công bố tổng toàn khu" : undefined,
    },
    {
      label: "Diện tích đất",
      value: p.siteArea ? `${p.siteArea.toLocaleString("vi-VN")} m²` : "Chưa có",
      status: p.siteAreaStatus,
      tooltip: p.siteAreaNote,
    },
    {
      label: "Đơn vị concept KT",
      value: canShowConceptArchitect(p) && p.conceptArchitect?.value ? p.conceptArchitect.value : "Chưa có",
      status: canShowConceptArchitect(p) ? p.conceptArchitect.status : "chua-xac-thuc",
    },
    { label: "Trạng thái", value: p.statusNote ?? p.status ?? "Chưa có", status: "da-co-du-lieu" },
    { label: "Cập nhật", value: p.lastVerifiedAt, status: "da-co-du-lieu" },
  ];
}
