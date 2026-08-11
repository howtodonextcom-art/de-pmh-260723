// DED-PMH v2 — shared data interfaces

export interface HeaderProject {
  slug: string;
  displayNameVi: string;
  region: string;
  status: string;
  alternateNames?: string[] | null; // MAY be missing from Firestore
}

export interface LegalDossier {
  investmentApproval: string | null;
  landAllocation: string | null;
  detailedPlanning: string | null;
  constructionPermits: string | null;
  constructionPermitsNote?: string;
  salesEligibility: string | null;
  mainContractor: string | null;
  disputes: string | null;
}

export type LegalDossierKey = keyof LegalDossier;

export interface Project {
  id: string;
  slug: string;
  displayNameVi: string;
  region: string;
  status: string;
  alternateNames?: string[] | null;
  legalDossier?: LegalDossier | null; // MAY be missing
}

export interface ImageAsset {
  assetId: string;
  projectSlug: string;
  category: string;
  description: string;
  alt: string;
  sourcePageUrl: string;
  sourceFileUrl: string;
  isRender: boolean;
  verified?: boolean;
  resolvedUrl?: string;
}

export const LEGAL_DOSSIER_LABELS: Record<LegalDossierKey, string> = {
  investmentApproval: "Chấp thuận chủ trương đầu tư",
  landAllocation: "Giao đất / cho thuê đất",
  detailedPlanning: "Quy hoạch chi tiết 1/500",
  constructionPermits: "Giấy phép xây dựng",
  constructionPermitsNote: "Ghi chú GPXD",
  salesEligibility: "Đủ điều kiện bán",
  mainContractor: "Tổng thầu thi công",
  disputes: "Tranh chấp / cảnh báo",
};

// Keys shown in legacy consumers — full table order (incl. designUnit) lives in
// `lib/legal-documents.ts` → LEGAL_TABLE_ROW_ORDER.
export const LEGAL_DOSSIER_TABLE_KEYS: LegalDossierKey[] = [
  "investmentApproval",
  "landAllocation",
  "detailedPlanning",
  "constructionPermits",
  "salesEligibility",
  "mainContractor",
  "disputes",
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: "Tất cả",
  hero: "Hero",
  masterplan: "Masterplan",
  overview: "Tổng quan",
  location: "Vị trí",
  amenities: "Tiện ích",
  architecture: "Kiến trúc",
  "completed-project": "Thực tế",
  interior: "Nội thất",
  floorplans: "Mặt bằng",
  logos: "Logo",
};
