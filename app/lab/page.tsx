import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { getCatalogFromLibrary } from "@/lib/library-bridge";
import { buildTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: buildTitle("Lab", "DED-PMH v0"),
  description: "Track A component lab: legal dossier + gallery demo shell (moved off the home route).",
  robots: { index: false, follow: false },
};

export default async function LabPage() {
  const { headerProjects, projects, assets, thumbBySlug } = await getCatalogFromLibrary();

  return (
    <>
      <p className="bg-muted px-4 py-2 text-center text-xs text-muted-foreground">
        Khu vực thử nghiệm nội bộ — không phải trang sản phẩm chính, không lập chỉ mục tìm kiếm.
      </p>
      {projects.length === 0 ? (
        <p className="bg-muted px-4 py-2 text-center text-xs text-muted-foreground">
          Chưa có dự án trong danh mục.
        </p>
      ) : null}
      <DemoShell
        headerProjects={headerProjects}
        projects={projects}
        assets={assets}
        thumbBySlug={thumbBySlug}
      />
    </>
  );
}
