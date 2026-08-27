import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogPageShell } from "@/components/shared/catalog-page-shell";
import { CompareTable } from "@/components/project/compare-table";
import { CompareTableSkeleton } from "@/components/project/compare-table-skeleton";
import { getCatalogFromLibrary, getCompareProjects } from "@/lib/library-bridge";
import { t } from "@/lib/i18n/t";
import { buildTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: buildTitle("So sánh dự án"),
  description:
    "So sánh dự án Phú Mỹ Hưng theo vùng (Phía Bắc / Phía Nam), nhóm Site A / Outsite — tối đa 4 cột mỗi lần.",
};

export default async function ComparePage() {
  const [{ headerProjects, thumbBySlug }, { projects }] = await Promise.all([
    getCatalogFromLibrary(),
    getCompareProjects(),
  ]);

  return (
    <CatalogPageShell
      headerProjects={headerProjects}
      thumbBySlug={thumbBySlug}
      showMockBanner={false}
      mainClassName="max-w-5xl px-4"
    >
      <h1 className="mb-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t("compare.title")}
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">{t("compare.subtitle")}</p>
      <Suspense fallback={<CompareTableSkeleton />}>
        <CompareTable projects={projects} />
      </Suspense>
    </CatalogPageShell>
  );
}
