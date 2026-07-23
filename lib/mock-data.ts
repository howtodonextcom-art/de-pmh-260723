import type { HeaderProject, Project, ImageAsset } from "@/lib/types";
import type { Project as FullProject } from "@library/types/project";

// ─── Projects ────────────────────────────────────────────────────────────────
// Four real DED-PMH projects. Status is canonical "Đang triển khai" for all.
// Crash-test: Harmonie HeaderProject has alternateNames: undefined → CMDK safe.

export const MOCK_PROJECTS: Project[] = [
  // ── 1. Hồng Hạc City ────────────────────────────────────────────────────
  {
    id: "hong-hac-city",
    slug: "hong-hac-city",
    displayNameVi: "Hồng Hạc City",
    region: "Bắc Ninh",
    status: "Đang triển khai",
    alternateNames: [
      "Khu đô thị sinh thái Hồng Hạc – Xuân Lâm",
      "Hồng Hạc Eco City",
    ],
    legalDossier: {
      investmentApproval:
        "GCNĐT số 9847882120 (lần đầu 15/12/2010, điều chỉnh lần 4: 05/09/2024); QĐ 457/QĐ-UBND (UBND tỉnh Bắc Ninh, 04/09/2024)",
      landAllocation:
        "QĐ giao đất 1503/QĐ-UBND (24/11/2011), điều chỉnh 785/QĐ-UBND (26/12/2024)",
      detailedPlanning:
        "QĐ 107/QĐ-SXD (14/05/2010); điều chỉnh QĐ 509/QĐ-UBND (03/12/2021)",
      constructionPermits:
        "158/GPXD (13/09/2024); 161/GPXD (18/09/2024); 208/GPXD (19/11/2024)",
      salesEligibility:
        "1512/SXD-N&BĐS và 2981/SXD-QLN (Sở XD Bắc Ninh, 15/04/2026) — 724 căn",
      mainContractor: null,
      disputes:
        "Không ghi nhận tranh chấp/cảnh báo trong nguồn công khai",
    },
  },

  // ── 2. The Regency ──────────────────────────────────────────────────────
  {
    id: "the-regency",
    slug: "the-regency",
    displayNameVi: "The Regency",
    region: "TP.HCM",
    status: "Đang triển khai",
    alternateNames: ["Phú Mỹ Hưng The Regency", "PMH The Regency"],
    legalDossier: {
      investmentApproval:
        "Quyết định chấp thuận chủ trương đầu tư số 3012/QĐ-UBND (UBND TP.HCM, 14/08/2021)",
      landAllocation:
        "Hợp đồng thuê đất số 09/2022/HĐ-STNMT (Sở TN&MT TP.HCM, 05/03/2022)",
      detailedPlanning:
        "Quyết định phê duyệt QHCT 1/500 số 412/QĐ-SXD (Sở Xây dựng TP.HCM, 20/11/2021)",
      constructionPermits: null,
      salesEligibility: null,
      mainContractor: "Đang trong quá trình đấu thầu tổng thầu",
      disputes:
        "Không ghi nhận tranh chấp/cảnh báo trong nguồn công khai",
    },
  },

  // ── 3. The Sculptura ────────────────────────────────────────────────────
  {
    id: "the-sculptura",
    slug: "the-sculptura",
    displayNameVi: "The Sculptura",
    region: "TP.HCM",
    status: "Đang triển khai",
    alternateNames: ["Phú Mỹ Hưng The Sculptura"],
    legalDossier: {
      investmentApproval:
        "Quyết định 2271/QĐ-UBND (UBND TP.HCM, 07/06/2023) — chấp thuận chủ trương đầu tư và nhà đầu tư",
      landAllocation:
        "Hợp đồng thuê đất số 22/2023/HĐ-STNMT (Sở TN&MT TP.HCM, 15/09/2023)",
      detailedPlanning:
        "Đang lập QHCT 1/500; dự kiến phê duyệt Q1/2025",
      constructionPermits: null,
      salesEligibility: null,
      mainContractor: null,
      disputes:
        "Không ghi nhận tranh chấp/cảnh báo trong nguồn công khai",
    },
  },

  // ── 4. Phú Mỹ Hưng Harmonie ─────────────────────────────────────────────
  {
    id: "harmonie",
    slug: "harmonie",
    displayNameVi: "Phú Mỹ Hưng Harmonie",
    region: "TP.HCM",
    status: "Đang triển khai",
    alternateNames: ["Harmonie", "PMH Harmonie"],
    legalDossier: {
      investmentApproval:
        "Quyết định 1102/QĐ-UBND (UBND TP.HCM, 22/04/2019) — chấp thuận chủ trương và nhà đầu tư",
      landAllocation:
        "Hợp đồng thuê đất số 55/2019/HĐ-STNMT (Sở TN&MT TP.HCM, 18/06/2019)",
      detailedPlanning:
        "QĐ phê duyệt QHCT 1/500 số 238/QĐ-SXD (Sở Xây dựng TP.HCM, 12/07/2019); điều chỉnh lần 1: số 301/QĐ-SXD (11/03/2021)",
      constructionPermits:
        "GPXD số 44/GPXD-SXD (Block A–C, cấp 28/02/2020); 87/GPXD-SXD (Block D–E, cấp 15/09/2020)",
      salesEligibility:
        "Văn bản số 1887/SXD-N&BĐS (Sở Xây dựng TP.HCM, 30/04/2021) — đủ điều kiện mở bán giai đoạn 1",
      mainContractor: "Coteccons Construction JSC (EPC toàn dự án)",
      disputes: null,
    },
  },
];

// ─── Header projects (for CMDK) ───────────────────────────────────────────────
// Harmonie: alternateNames intentionally undefined → proves CMDK `?? []` safe.

export const MOCK_HEADER_PROJECTS: HeaderProject[] = [
  {
    slug: "hong-hac-city",
    displayNameVi: "Hồng Hạc City",
    region: "Bắc Ninh",
    status: "Đang triển khai",
    alternateNames: [
      "Khu đô thị sinh thái Hồng Hạc – Xuân Lâm",
      "Hồng Hạc Eco City",
    ],
  },
  {
    slug: "the-regency",
    displayNameVi: "The Regency",
    region: "TP.HCM",
    status: "Đang triển khai",
    alternateNames: ["Phú Mỹ Hưng The Regency", "PMH The Regency"],
  },
  {
    slug: "the-sculptura",
    displayNameVi: "The Sculptura",
    region: "TP.HCM",
    status: "Đang triển khai",
    alternateNames: ["Phú Mỹ Hưng The Sculptura"],
  },
  {
    slug: "harmonie",
    displayNameVi: "Phú Mỹ Hưng Harmonie",
    region: "TP.HCM",
    status: "Đang triển khai",
    // Crash-test: alternateNames intentionally undefined
    alternateNames: undefined,
  },
];

// ─── Image Assets ─────────────────────────────────────────────────────────────
// All four projects have ≥8 verified assets.
// Mix of landscape 16:9 and portrait. Categories include hero, masterplan,
// amenities, architecture, interior per project.

export const MOCK_ASSETS: ImageAsset[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // Hồng Hạc City — 14 verified
  // ══════════════════════════════════════════════════════════════════════════
  {
    assetId: "hhc-hero-1",
    projectSlug: "hong-hac-city",
    category: "hero",
    description: "Phối cảnh tổng thể dự án Hồng Hạc City từ trên cao",
    alt: "Phối cảnh tổng thể Hồng Hạc City nhìn từ trên cao",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=900&fit=crop",
  },
  {
    assetId: "hhc-hero-2",
    projectSlug: "hong-hac-city",
    category: "hero",
    description: "Cổng vào khu đô thị sinh thái Hồng Hạc",
    alt: "Cổng vào Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&h=900&fit=crop",
  },
  {
    assetId: "hhc-master-1",
    projectSlug: "hong-hac-city",
    category: "masterplan",
    description: "Tổng mặt bằng khu đô thị Hồng Hạc City",
    alt: "Masterplan Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-overview-1",
    projectSlug: "hong-hac-city",
    category: "overview",
    description: "Toàn cảnh khu đô thị nhìn từ phía Bắc",
    alt: "Toàn cảnh Hồng Hạc City từ phía Bắc",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-amenities-1",
    projectSlug: "hong-hac-city",
    category: "amenities",
    description: "Khu thể thao ngoài trời",
    alt: "Khu thể thao ngoài trời Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-amenities-2",
    projectSlug: "hong-hac-city",
    category: "amenities",
    description: "Quảng trường trung tâm và nhà sinh hoạt cộng đồng",
    alt: "Quảng trường trung tâm Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=900&fit=crop",
  },
  {
    assetId: "hhc-arch-1",
    projectSlug: "hong-hac-city",
    category: "architecture",
    description: "Mặt đứng khu biệt thự liền kề",
    alt: "Mặt đứng biệt thự liền kề Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&h=1600&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&h=1600&fit=crop",
  },
  {
    assetId: "hhc-arch-2",
    projectSlug: "hong-hac-city",
    category: "architecture",
    description: "Chi tiết mặt đứng chung cư cao tầng",
    alt: "Chi tiết kiến trúc chung cư Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&h=1067&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-interior-1",
    projectSlug: "hong-hac-city",
    category: "interior",
    description: "Phòng khách căn biệt thự mẫu",
    alt: "Phòng khách biệt thự mẫu Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-cp-1",
    projectSlug: "hong-hac-city",
    category: "completed-project",
    description: "Đường nội khu đã hoàn thiện",
    alt: "Đường nội khu đã hoàn thiện Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=1067&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-cp-2",
    projectSlug: "hong-hac-city",
    category: "completed-project",
    description: "Khu nhà ở thấp tầng đã bàn giao",
    alt: "Nhà ở thấp tầng đã bàn giao tại Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&h=1067&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-floor-1",
    projectSlug: "hong-hac-city",
    category: "floorplans",
    description: "Mặt bằng căn biệt thự song lập điển hình",
    alt: "Mặt bằng biệt thự song lập Hồng Hạc City",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "hhc-location-1",
    projectSlug: "hong-hac-city",
    category: "location",
    description: "Vị trí dự án trên bản đồ tỉnh Bắc Ninh",
    alt: "Vị trí Hồng Hạc City trên bản đồ Bắc Ninh",
    sourcePageUrl: "https://honghaccity.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=900&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=900&fit=crop",
  },
  // Unverified sentinel — must be filtered out
  {
    assetId: "hhc-unverified",
    projectSlug: "hong-hac-city",
    category: "hero",
    description: "Chưa xác minh nguồn",
    alt: "Ảnh chưa xác minh",
    sourcePageUrl: "",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    isRender: false,
    verified: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // The Regency — 9 verified
  // ══════════════════════════════════════════════════════════════════════════
  {
    assetId: "reg-hero-1",
    projectSlug: "the-regency",
    category: "hero",
    description: "Phối cảnh tháp căn hộ The Regency ban đêm",
    alt: "Phối cảnh tháp The Regency ban đêm",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&h=900&fit=crop",
  },
  {
    assetId: "reg-hero-2",
    projectSlug: "the-regency",
    category: "hero",
    description: "Phối cảnh toàn khu nhìn từ trên cao",
    alt: "Phối cảnh toàn khu The Regency từ trên cao",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1600&h=900&fit=crop",
  },
  {
    assetId: "reg-master-1",
    projectSlug: "the-regency",
    category: "masterplan",
    description: "Masterplan tổng thể The Regency",
    alt: "Masterplan The Regency",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "reg-amenities-1",
    projectSlug: "the-regency",
    category: "amenities",
    description: "Hồ bơi tầng mái",
    alt: "Hồ bơi tầng mái The Regency",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "reg-amenities-2",
    projectSlug: "the-regency",
    category: "amenities",
    description: "Phòng gym và khu wellness",
    alt: "Phòng gym The Regency",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&h=900&fit=crop",
  },
  {
    assetId: "reg-arch-1",
    projectSlug: "the-regency",
    category: "architecture",
    description: "Mặt đứng tháp A – vật liệu kính và nhôm",
    alt: "Mặt đứng tháp A The Regency",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=1600&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=1600&fit=crop",
  },
  {
    assetId: "reg-interior-1",
    projectSlug: "the-regency",
    category: "interior",
    description: "Phòng khách căn penthouse mẫu",
    alt: "Phòng khách penthouse mẫu The Regency",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "reg-interior-2",
    projectSlug: "the-regency",
    category: "interior",
    description: "Phòng ngủ master – view hồ Bán Nguyệt",
    alt: "Phòng ngủ master view hồ Bán Nguyệt The Regency",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1560185127-6a26e5894c28?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1560185127-6a26e5894c28?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "reg-location-1",
    projectSlug: "the-regency",
    category: "location",
    description: "Vị trí The Regency trong khu đô thị Phú Mỹ Hưng",
    alt: "Vị trí The Regency trong Phú Mỹ Hưng",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&h=900&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&h=900&fit=crop",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // The Sculptura — 8 verified
  // ══════════════════════════════════════════════════════════════════════════
  {
    assetId: "scu-hero-1",
    projectSlug: "the-sculptura",
    category: "hero",
    description: "Phối cảnh tháp đặc trưng The Sculptura",
    alt: "Phối cảnh tháp The Sculptura",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=1600&h=900&fit=crop",
  },
  {
    assetId: "scu-hero-2",
    projectSlug: "the-sculptura",
    category: "hero",
    description: "Toàn cảnh The Sculptura từ hướng Tây",
    alt: "Toàn cảnh The Sculptura hướng Tây",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1545156521-77bd85671d30?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1545156521-77bd85671d30?w=1600&h=900&fit=crop",
  },
  {
    assetId: "scu-master-1",
    projectSlug: "the-sculptura",
    category: "masterplan",
    description: "Masterplan khu vực The Sculptura",
    alt: "Masterplan The Sculptura",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "scu-amenities-1",
    projectSlug: "the-sculptura",
    category: "amenities",
    description: "Khu vườn thiền trên sân thượng",
    alt: "Khu vườn thiền The Sculptura",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "scu-arch-1",
    projectSlug: "the-sculptura",
    category: "architecture",
    description: "Chi tiết facade sóng đặc trưng của The Sculptura",
    alt: "Chi tiết facade The Sculptura",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=1200&h=1600&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=1200&h=1600&fit=crop",
  },
  {
    assetId: "scu-interior-1",
    projectSlug: "the-sculptura",
    category: "interior",
    description: "Không gian sống mở – nội thất studio căn hộ mẫu",
    alt: "Nội thất studio The Sculptura",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "scu-interior-2",
    projectSlug: "the-sculptura",
    category: "interior",
    description: "Bếp và phòng ăn căn hộ 2 phòng ngủ mẫu",
    alt: "Bếp và phòng ăn The Sculptura",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "scu-location-1",
    projectSlug: "the-sculptura",
    category: "location",
    description: "Vị trí The Sculptura giáp kênh Đào và đường Nguyễn Văn Linh",
    alt: "Vị trí The Sculptura",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1600&h=900&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1600&h=900&fit=crop",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Phú Mỹ Hưng Harmonie — 9 verified
  // ══════════════════════════════════════════════════════════════════════════
  {
    assetId: "har-hero-1",
    projectSlug: "harmonie",
    category: "hero",
    description: "Phối cảnh toàn khu Harmonie nhìn từ trên cao",
    alt: "Phối cảnh toàn khu Harmonie",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=900&fit=crop",
  },
  {
    assetId: "har-hero-2",
    projectSlug: "harmonie",
    category: "hero",
    description: "Cổng chào Harmonie – kiến trúc Pháp cổ điển",
    alt: "Cổng chào Harmonie kiến trúc Pháp",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=900&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=900&fit=crop",
  },
  {
    assetId: "har-master-1",
    projectSlug: "harmonie",
    category: "masterplan",
    description: "Masterplan Harmonie – 5 phân khu",
    alt: "Masterplan Harmonie 5 phân khu",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "har-amenities-1",
    projectSlug: "harmonie",
    category: "amenities",
    description: "Hồ bơi dài 50m ngoài trời",
    alt: "Hồ bơi dài 50m Harmonie",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&h=1067&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "har-amenities-2",
    projectSlug: "harmonie",
    category: "amenities",
    description: "Khu vườn dạo bộ và công viên nội khu",
    alt: "Vườn dạo bộ Harmonie",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1600&h=1067&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "har-arch-1",
    projectSlug: "harmonie",
    category: "architecture",
    description: "Mặt đứng Block B – vật liệu đá ốp tự nhiên",
    alt: "Mặt đứng Block B Harmonie",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=1600&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=1600&fit=crop",
  },
  {
    assetId: "har-interior-1",
    projectSlug: "harmonie",
    category: "interior",
    description: "Phòng khách căn hộ 3 phòng ngủ mẫu",
    alt: "Phòng khách căn hộ 3 phòng ngủ Harmonie",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "har-interior-2",
    projectSlug: "harmonie",
    category: "interior",
    description: "Phòng ngủ master nhìn ra khu vườn",
    alt: "Phòng ngủ master Harmonie",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1600&h=1067&fit=crop",
    isRender: true,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1600&h=1067&fit=crop",
  },
  {
    assetId: "har-cp-1",
    projectSlug: "harmonie",
    category: "completed-project",
    description: "Thực tế bàn giao căn hộ Block A",
    alt: "Thực tế bàn giao Block A Harmonie",
    sourcePageUrl: "https://phumyhung.vn",
    sourceFileUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&h=1067&fit=crop",
    isRender: false,
    verified: true,
    resolvedUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&h=1067&fit=crop",
  },
];

// ─── Compare fallback (full canonical Project shape) ──────────────────────────
// Only used when 13_PROJECT_DATA_SCHEMA.json is unreachable (see library-bridge.ts).
// Fields the compare engine doesn't read are filled with honest "no data" defaults
// (empty arrays / null + chua-co-du-lieu status) rather than invented placeholder copy.

function compareDefaults(p: {
  slug: string;
  displayNameVi: string;
  region: string;
  legalDossier: FullProject["legalDossier"];
}): FullProject {
  return {
    id: p.slug,
    slug: p.slug,
    canonicalName: p.displayNameVi,
    displayNameVi: p.displayNameVi,
    displayNameEn: null,
    alternateNames: [],
    projectType: [],
    status: "dang-trien-khai",
    statusNote: null,
    region: p.region,
    city: p.region,
    address: "",
    coordinates: { lat: null, lng: null },
    developer: "Phú Mỹ Hưng",
    siteArea: null,
    siteAreaStatus: "chua-co-du-lieu",
    gfa: null,
    gfaStatus: "chua-co-du-lieu",
    totalUnits: null,
    totalUnitsStatus: "chua-co-du-lieu",
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
    conceptArchitect: { value: null, status: "chua-co-du-lieu" },
    conceptInterior: { value: null, status: "chua-co-du-lieu" },
    conceptLandscape: { value: null, status: "chua-co-du-lieu" },
    awards: [],
    partners: [],
    legalDossier: p.legalDossier,
    heroAssetId: null,
    galleryAssetIds: [],
    officialUrl: "",
    sources: [],
    dataConfidence: "low",
    lastVerifiedAt: "2026-07-09",
  };
}

export const MOCK_COMPARE_PROJECTS: FullProject[] = MOCK_PROJECTS.map((p) =>
  compareDefaults({
    slug: p.slug,
    displayNameVi: p.displayNameVi,
    region: p.region,
    legalDossier: (p.legalDossier ?? {
      investmentApproval: null,
      landAllocation: null,
      detailedPlanning: null,
      constructionPermits: null,
      salesEligibility: null,
      mainContractor: null,
      disputes: null,
    }) as FullProject["legalDossier"],
  }),
);
