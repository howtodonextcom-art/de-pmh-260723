import type { LegalDossier, LegalDossierKey } from "@/lib/types";

/** Table/timeline row ids — dossier keys plus design unit (from conceptArchitect). */
export type LegalTableRowId = LegalDossierKey | "designUnit";

export const LEGAL_TABLE_ROW_ORDER: LegalTableRowId[] = [
  "investmentApproval",
  "landAllocation",
  "detailedPlanning",
  "constructionPermits",
  "salesEligibility",
  "designUnit",
  "mainContractor",
  "disputes",
];

export const LEGAL_TABLE_ROW_LABELS: Record<LegalTableRowId, string> = {
  investmentApproval: "Chấp thuận chủ trương đầu tư",
  landAllocation: "Giao đất / cho thuê đất",
  detailedPlanning: "Quy hoạch chi tiết 1/500",
  constructionPermits: "Giấy phép xây dựng",
  constructionPermitsNote: "Ghi chú GPXD",
  salesEligibility: "Đủ điều kiện bán",
  designUnit: "Đơn vị thiết kế",
  mainContractor: "Tổng thầu thi công",
  disputes: "Tranh chấp / cảnh báo",
};

/** One logical document line inside a dossier group (MVP: split from prose string). */
export type LegalDocLine = {
  id: string;
  text: string;
  /** Best-effort doc code e.g. 158/GPXD */
  code?: string;
  /** Best-effort date dd/mm/yyyy */
  date?: string;
  /** Phase-2 hook — no signed scan in seed today */
  scanAssetId?: string | null;
};

const DOSSIER_KEYS = new Set<string>([
  "investmentApproval",
  "landAllocation",
  "detailedPlanning",
  "constructionPermits",
  "constructionPermitsNote",
  "salesEligibility",
  "mainContractor",
  "disputes",
]);

export function isLegalDossierKey(id: LegalTableRowId): id is LegalDossierKey {
  return DOSSIER_KEYS.has(id);
}

/**
 * Split a dossier prose blob into per-document lines.
 * Primary delimiter: semicolons (seed style). Fallback: keep single line.
 */
export function splitLegalContent(raw: string | null | undefined): LegalDocLine[] {
  if (!raw || !raw.trim()) return [];
  const parts = raw
    .split(/\s*;\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.map((text, index) => {
    const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    const codeMatch =
      text.match(
        /\b(\d+\/[A-ZĐƯỜỚỚỨÀ-Ỹ0-9-]+(?:-[A-ZĐƯỜỚỚỨÀ-Ỹ0-9]+)*)\b/i
      ) ?? text.match(/\b([A-Z]{2,}Đ?T?\s*số\s*[\d/A-Z-]+)\b/i);

    return {
      id: `doc-${index}`,
      text,
      date: dateMatch?.[1],
      code: codeMatch?.[1],
      scanAssetId: null,
    };
  });
}

export function getDossierRaw(
  dossier: LegalDossier | null | undefined,
  key: LegalDossierKey
): string | null {
  if (!dossier) return null;
  const value = dossier[key];
  return typeof value === "string" && value.trim() ? value : null;
}

/** Proposed Phase-2 registry shape (not persisted yet). */
export type LegalDocumentRecord = {
  id: string;
  groupId: LegalTableRowId;
  title: string;
  issuedOn?: string;
  issuer?: string;
  text: string;
  scanAssetId?: string | null;
};
