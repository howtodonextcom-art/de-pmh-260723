import { canShowConceptArchitect } from "./architect-visibility";
import { formatNumber, unitsWord, type NumberLocale } from "../i18n-format";
import {
  EMPTY_VALUE,
  FACT_GRID_LABELS,
  projectStatusLabel,
  projectTypeLabel,
  scalePhrase,
  unitsPhaseLine,
  unitsPhaseTooltip,
  updatedTooltip,
} from "../i18n-copy";
import type { FieldStatus, Project } from "../../types/project";

export interface FactCell {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
  tooltip?: string;
}

function scaleDescriptor(p: Project, locale: NumberLocale): string {
  if (p.subdivisions?.length) {
    return scalePhrase("subdivision", p.subdivisions.length, locale);
  }
  const parts: string[] = [];
  if (p.blocks) parts.push(scalePhrase("block", p.blocks, locale));
  if (p.floors) {
    if (typeof p.floors === "number") {
      parts.push(scalePhrase("floor", p.floors, locale));
    } else {
      parts.push(locale === "en" ? `${p.floors} floors` : `${p.floors} tầng`);
    }
  }
  return parts.join(" · ") || EMPTY_VALUE[locale];
}

function unitsDisplay(
  p: Project,
  locale: NumberLocale,
): { value: string; status: FieldStatus; tooltip?: string } {
  if (p.totalUnits) {
    return { value: `${formatNumber(p.totalUnits, locale)} ${unitsWord(locale)}`, status: p.totalUnitsStatus };
  }
  if (p.unitsByPhase?.length) {
    return {
      value: p.unitsByPhase.map((u) => unitsPhaseLine(u.units, u.phase.split(" ")[0], locale)).join(" · "),
      status: p.unitsByPhaseStatus ?? "da-co-du-lieu",
      tooltip: unitsPhaseTooltip(locale),
    };
  }
  return { value: EMPTY_VALUE[locale], status: p.totalUnitsStatus };
}

/** D2 fact grid — 8 cells, GFA intentionally excluded (SPEC §3.4 D2).
 *  Vị trí/Loại hình/Quy mô derive `status` from the value itself — `address`,
 *  `projectType[0]`, and the blocks/floors/subdivisions behind
 *  `scaleDescriptor()` are all optional-in-practice even though `address`
 *  and `projectType` are non-nullable in the type, so a hardcoded
 *  "da-co-du-lieu" here previously claimed "has data" for every project
 *  regardless of whether the field was actually empty. */
export function buildFactGrid(p: Project, locale: NumberLocale = "vi"): FactCell[] {
  const units = unitsDisplay(p, locale);
  const scale = scaleDescriptor(p, locale);
  const labels = FACT_GRID_LABELS[locale];
  const empty = EMPTY_VALUE[locale];
  return [
    {
      id: "location",
      label: labels.location,
      value: p.address || empty,
      status: p.address ? "da-co-du-lieu" : "chua-co-du-lieu",
    },
    {
      id: "type",
      label: labels.type,
      value: p.projectType[0] ? projectTypeLabel(p.projectType[0], locale) : empty,
      status: p.projectType[0] ? "da-co-du-lieu" : "chua-co-du-lieu",
    },
    {
      id: "scale",
      label: labels.scale,
      value: scale,
      status: scale === empty ? "chua-co-du-lieu" : "da-co-du-lieu",
    },
    {
      id: "units",
      label: labels.units,
      value: units.value,
      status: units.status,
      tooltip: units.tooltip,
    },
    {
      id: "siteArea",
      label: labels.siteArea,
      value: p.siteArea ? `${formatNumber(p.siteArea, locale)} m²` : empty,
      status: p.siteAreaStatus,
      tooltip: p.siteAreaNote,
    },
    {
      id: "conceptArchitect",
      label: labels.conceptArchitect,
      value: canShowConceptArchitect(p) && p.conceptArchitect?.value ? p.conceptArchitect.value : empty,
      status: canShowConceptArchitect(p) ? p.conceptArchitect.status : "chua-xac-thuc",
    },
    {
      id: "status",
      label: labels.status,
      value: p.statusNote ?? projectStatusLabel(p.status, locale),
      status: "da-co-du-lieu",
    },
    {
      id: "updated",
      label: labels.updated,
      value: p.lastVerifiedAt,
      status: "da-co-du-lieu",
      tooltip: updatedTooltip(p.lastVerifiedAt, locale),
    },
  ];
}
