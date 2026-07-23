/** Mirrors 13_PROJECT_DATA_SCHEMA.json — do not hand-edit values, only shape. */

export type FieldStatus =
  | "da-co-du-lieu"
  | "chua-xac-thuc"
  | "mau-thuan"
  | "chua-co-du-lieu"
  | "bao-mat";

export interface SourceRef {
  sourceId: string;
  field: string;
  sourceUrl: string;
  sourceDomain: string;
  sourceType: "internal" | "official" | "secondary";
  accessedAt: string;
  confidence: "high" | "medium" | "low";
  notes?: string;
}

export interface UnitsByPhase {
  phase: string;
  units: number;
}

export interface UnitMixRow {
  type: string;
  count: number;
  areaRange: string;
}

export interface ValueWithStatus<T = string> {
  value: T | null;
  status: FieldStatus;
  note?: string;
  publicNameApproved?: boolean;
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

export interface Project {
  id: string;
  slug: string;
  canonicalName: string;
  displayNameVi: string;
  displayNameEn: string | null;
  alternateNames: string[];
  projectType: string[];
  status: string;
  statusNote: string | null;
  region: string;
  city: string;
  address: string;
  coordinates: { lat: number | null; lng: number | null };
  developer: string;
  siteArea: number | null;
  siteAreaStatus: FieldStatus;
  siteAreaNote?: string;
  gfa: number | null;
  gfaStatus: FieldStatus;
  gfaNote?: string;
  plotRatio?: number;
  totalUnits: number | null;
  totalUnitsStatus: FieldStatus;
  shops?: number;
  blocks?: number | null;
  blockNames?: string[];
  floors?: number | string | null;
  basements?: number;
  densityPercent?: number;
  plannedPopulation?: number;
  unitsByPhase?: UnitsByPhase[];
  unitsByPhaseStatus?: FieldStatus;
  unitMix?: UnitMixRow[];
  subdivisions?: string[];
  launchYear: number | null;
  completionYear: number | null;
  completionNote?: string;
  handoverYear: number | null;
  shortDescriptionVi: string | null;
  shortDescriptionEn: string | null;
  longDescriptionVi: string | null;
  longDescriptionEn: string | null;
  highlights: string[];
  amenities: string[];
  productTypes: string[];
  conceptArchitect: ValueWithStatus;
  conceptInterior: ValueWithStatus;
  conceptLandscape: ValueWithStatus;
  awards: string[];
  partners: string[];
  legalDossier: LegalDossier;
  heroAssetId: string | null;
  galleryAssetIds: string[];
  officialUrl: string;
  sources: SourceRef[];
  dataConfidence: "high" | "medium-high" | "medium" | "low";
  lastVerifiedAt: string;
  featured?: boolean;
}

export interface ImageAsset {
  assetId: string;
  projectSlug: string;
  category: string;
  description: string;
  alt: string;
  sourcePageUrl: string;
  sourceFileUrl: string;
  dimensions: string;
  aspectRatio: string;
  format: string;
  watermark: string;
  usageStatus: string;
  quality: string;
  suggestedUse: string;
  isRender: boolean;
  storagePath?: string;
  variants?: { thumb?: string; card?: string; full?: string; og?: string };
  verified?: boolean;
  /** Actual URL to render — same as sourceFileUrl unless the WordPress
   *  thumbnail suffix (e.g. "-1024x576") had to be stripped to reach a live original. */
  resolvedUrl?: string;
  verificationNote?: string;
}

export interface Milestone {
  id: string;
  year: number;
  projectSlug: string | null;
  label: string;
  sourceRef?: string;
}

export interface UpdateEntry {
  id: string;
  date: string;
  projectSlug: string;
  textVi: string;
}

export interface SiteSettings {
  brandStatementVi: string;
  heroAssetId: string | null;
  transparencyIntro: string;
  contact: {
    hotlineHcm?: string;
    hotlineHn?: string;
    hotlineBacNinh?: string;
  };
  maxLastVerifiedAt: string;
}

export type UserRole = "viewer" | "editor" | "admin";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
}

export interface PendingChange {
  id: string;
  projectSlug: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  newStatus: FieldStatus;
  sourceUrl?: string;
  note?: string;
  submittedBy: string;
  submittedAt: string;
  state: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectReason?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  diff: string;
}
