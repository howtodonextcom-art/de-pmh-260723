import { canShowConceptArchitect } from "./architect-visibility";
import { projectStatusLabel } from "../../components/layout/project-status-label";
import type { FieldStatus, Project } from "../../types/project";

export interface FactCell {
  label: string;
  value: string;
  status: FieldStatus;
  tooltip?: string;
}

function scaleDescriptor(p: Project): string {
  if (p.subdivisions?.length) {
    return `${p.subdivisions.length} phân khu`;
  }
  const parts: string[] = [];
  if (p.blocks) parts.push(`${p.blocks} block${p.blocks > 1 ? "s" : ""}`);
  if (p.floors) parts.push(`${p.floors} tầng`);
  return parts.join(" · ") || "Chưa có";
}

function unitsDisplay(p: Project): { value: string; status: FieldStatus; tooltip?: string } {
  if (p.totalUnits) return { value: `${p.totalUnits.toLocaleString("vi-VN")} căn`, status: p.totalUnitsStatus };
  if (p.unitsByPhase?.length) {
    return {
      value: p.unitsByPhase.map((u) => `${u.units} căn ${u.phase.split(" ")[0]}`).join(" · "),
      status: p.unitsByPhaseStatus ?? "da-co-du-lieu",
      tooltip: "Chưa công bố tổng toàn khu",
    };
  }
  return { value: "Chưa có", status: p.totalUnitsStatus };
}

/** D2 fact grid — 8 cells, GFA intentionally excluded (SPEC §3.4 D2).
 *  Vị trí/Loại hình/Quy mô derive `status` from the value itself — `address`,
 *  `projectType[0]`, and the blocks/floors/subdivisions behind
 *  `scaleDescriptor()` are all optional-in-practice even though `address`
 *  and `projectType` are non-nullable in the type, so a hardcoded
 *  "da-co-du-lieu" here previously claimed "has data" for every project
 *  regardless of whether the field was actually empty. */
export function buildFactGrid(p: Project): FactCell[] {
  const units = unitsDisplay(p);
  const scale = scaleDescriptor(p);
  return [
    {
      label: "Vị trí",
      value: p.address || "Chưa có",
      status: p.address ? "da-co-du-lieu" : "chua-co-du-lieu",
    },
    {
      label: "Loại hình",
      value: p.projectType[0]?.replace(/-/g, " ") ?? "Chưa có",
      status: p.projectType[0] ? "da-co-du-lieu" : "chua-co-du-lieu",
    },
    {
      label: "Quy mô",
      value: scale,
      status: scale === "Chưa có" ? "chua-co-du-lieu" : "da-co-du-lieu",
    },
    {
      label: "Số căn",
      value: units.value,
      status: units.status,
      tooltip: units.tooltip,
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
    { label: "Trạng thái", value: p.statusNote ?? projectStatusLabel(p.status), status: "da-co-du-lieu" },
    { label: "Cập nhật", value: p.lastVerifiedAt, status: "da-co-du-lieu" },
  ];
}
