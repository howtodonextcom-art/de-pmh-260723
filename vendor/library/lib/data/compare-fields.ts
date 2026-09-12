import { canShowConceptArchitect } from "./architect-visibility";
import { formatNumber, unitsWord, type NumberLocale } from "../i18n-format";
import {
  addressTooltip,
  COMPARE_FIELD_LABELS,
  EMPTY_VALUE,
  gfaTooltip,
  projectStatusLabel,
  projectTypeLabel,
  unitsPhaseLine,
  unitsPhaseTooltip,
} from "../i18n-copy";
import type { FieldStatus, Project } from "../../types/project";

export interface CompareCell {
  display: string;
  status: FieldStatus;
  tooltip?: string;
}

export interface CompareField {
  id: string;
  label: string;
  cell: (p: Project, locale?: NumberLocale) => CompareCell;
}

/** Soft cap for side-by-side project columns (Variant A — Branch matrix). */
export const COMPARE_COLUMN_CAP = 4;

function plotCell(p: Project, locale: NumberLocale = "vi"): CompareCell {
  if (p.plotCode?.trim()) {
    return { display: p.plotCode.trim(), status: "da-co-du-lieu" };
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
    display: EMPTY_VALUE[locale],
    status: "chua-co-du-lieu",
    tooltip: p.address ? addressTooltip(p.address, locale) : undefined,
  };
}

function unitsCell(p: Project, locale: NumberLocale = "vi"): CompareCell {
  if (p.totalUnits) {
    return { display: `${formatNumber(p.totalUnits, locale)} ${unitsWord(locale)}`, status: p.totalUnitsStatus };
  }
  if (p.unitsByPhase?.length) {
    return {
      display: p.unitsByPhase.map((u) => unitsPhaseLine(u.units, u.phase.split(" ")[0], locale)).join(" · "),
      status: p.unitsByPhaseStatus ?? "da-co-du-lieu",
      tooltip: unitsPhaseTooltip(locale),
    };
  }
  return { display: EMPTY_VALUE[locale], status: p.totalUnitsStatus };
}

function designUnitCell(p: Project, locale: NumberLocale = "vi"): CompareCell {
  if (canShowConceptArchitect(p) && p.conceptArchitect?.value) {
    return { display: p.conceptArchitect.value, status: p.conceptArchitect.status };
  }
  return {
    display: EMPTY_VALUE[locale],
    status:
      p.conceptArchitect?.status === "da-co-du-lieu"
        ? "chua-xac-thuc"
        : (p.conceptArchitect?.status ?? "chua-co-du-lieu"),
  };
}

type CompareFieldId = keyof (typeof COMPARE_FIELD_LABELS)["vi"];

const COMPARE_FIELD_CELLS: Record<CompareFieldId, CompareField["cell"]> = {
  "lo-dat": plotCell,
  "khu-vuc": (p, locale = "vi") => ({
    display: p.region || EMPTY_VALUE[locale],
    status: p.region ? "da-co-du-lieu" : "chua-co-du-lieu",
  }),
  "loai-hinh": (p, locale = "vi") => {
    const types = p.projectType ?? [];
    const label = types.map((type) => projectTypeLabel(type, locale)).filter(Boolean).join(", ");
    return { display: label || EMPTY_VALUE[locale], status: label ? "da-co-du-lieu" : "chua-co-du-lieu" };
  },
  "quy-mo-dat": (p, locale = "vi") =>
    p.siteArea
      ? {
          display: `${formatNumber(p.siteArea / 10000, locale, { maximumFractionDigits: 2 })} ha`,
          status: p.siteAreaStatus,
          tooltip: p.siteAreaNote,
        }
      : { display: EMPTY_VALUE[locale], status: p.siteAreaStatus },
  gfa: (_p, locale = "vi") => ({
    display: "—",
    status: "chua-co-du-lieu",
    tooltip: gfaTooltip(locale),
  }),
  "so-can": unitsCell,
  "don-vi-thiet-ke": designUnitCell,
  "tong-thau": (p, locale = "vi") => {
    const value = p.legalDossier?.mainContractor;
    return {
      display: value || EMPTY_VALUE[locale],
      status: value ? "da-co-du-lieu" : "chua-co-du-lieu",
    };
  },
  "tinh-trang-ban": (p, locale = "vi") => {
    const label = p.status ? projectStatusLabel(p.status, locale) : null;
    const eligibility = p.legalDossier?.salesEligibility ?? p.statusNote ?? undefined;
    return {
      display: label || EMPTY_VALUE[locale],
      status: label ? "da-co-du-lieu" : "chua-co-du-lieu",
      tooltip: eligibility || undefined,
    };
  },
};

const COMPARE_FIELD_ORDER: CompareFieldId[] = [
  "lo-dat",
  "khu-vuc",
  "loai-hinh",
  "quy-mo-dat",
  "gfa",
  "so-can",
  "don-vi-thiet-ke",
  "tong-thau",
  "tinh-trang-ban",
];

/**
 * Compare matrix rows — Lô đất first; trade name omitted (duplicates column headers).
 * Shared by `/so-sanh` (and any future table view). Pass `locale` so row labels
 * match cell copy; `COMPARE_FIELDS` stays the Vietnamese snapshot used by CLI backups.
 */
export function getCompareFields(locale: NumberLocale = "vi"): CompareField[] {
  const labels = COMPARE_FIELD_LABELS[locale];
  return COMPARE_FIELD_ORDER.map((id) => ({
    id,
    label: labels[id],
    cell: COMPARE_FIELD_CELLS[id],
  }));
}

export const COMPARE_FIELDS: CompareField[] = getCompareFields("vi");
