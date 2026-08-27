import type { FieldStatus, LegalDossier, Project, ValueWithStatus } from "@library/types/project";
import type { CmsProjectDoc } from "@/lib/cms/types";

const EMPTY_STATUS: FieldStatus = "chua-co-du-lieu";

function emptyValue(): ValueWithStatus {
  return { value: null, status: EMPTY_STATUS };
}

export function emptyLegalDossier(): LegalDossier {
  return {
    investmentApproval: null,
    landAllocation: null,
    detailedPlanning: null,
    constructionPermits: null,
    salesEligibility: null,
    mainContractor: null,
    disputes: null,
  };
}

export function createEmptyProject(slug: string, displayNameVi: string): CmsProjectDoc {
  const today = new Date().toISOString().slice(0, 10);
  const project: Project = {
    id: slug,
    slug,
    canonicalName: displayNameVi,
    displayNameVi,
    displayNameEn: null,
    alternateNames: [],
    projectType: [],
    status: "dang-trien-khai",
    statusNote: null,
    region: "",
    city: "",
    address: "",
    coordinates: { lat: null, lng: null },
    developer: "",
    siteArea: null,
    siteAreaStatus: EMPTY_STATUS,
    gfa: null,
    gfaStatus: EMPTY_STATUS,
    totalUnits: null,
    totalUnitsStatus: EMPTY_STATUS,
    launchYear: null,
    completionYear: null,
    handoverYear: null,
    shortDescriptionVi: null,
    shortDescriptionEn: null,
    longDescriptionVi: null,
    longDescriptionEn: null,
    highlights: [],
    amenities: [],
    productTypes: [],
    conceptArchitect: emptyValue(),
    conceptInterior: emptyValue(),
    conceptLandscape: emptyValue(),
    awards: [],
    partners: [],
    legalDossier: emptyLegalDossier(),
    heroAssetId: null,
    galleryAssetIds: [],
    officialUrl: "",
    sources: [],
    dataConfidence: "low",
    lastVerifiedAt: today,
    featured: false,
  };

  return {
    ...project,
    plotCode: null,
    navZone: "nam",
    namGroup: "site-a",
    navLabel: displayNameVi,
    saBanUrl: null,
    assets: [],
    updatedAt: new Date().toISOString(),
    updatedBy: null,
  };
}

export const DEFAULT_SITE_BRAND =
  "DED-PMH tổng hợp và xác minh dữ liệu công khai của các dự án để đội ngũ nội bộ tra cứu pháp lý, tiến độ và quy mô từ một nguồn duy nhất, minh bạch về nguồn và ngày cập nhật.";
