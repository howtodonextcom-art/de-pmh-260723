import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { getCatalogFromLibrary } from "@/lib/library-bridge";

export const metadata: Metadata = {
  title: "Lab — DED-PMH v0",
  description: "Track A component lab: legal dossier + gallery demo shell (moved off the home route).",
  robots: { index: false, follow: false },
};

export default async function LabPage() {
  const { headerProjects, projects, assets, source, thumbBySlug } = await getCatalogFromLibrary();

  return (
    <>
      <p className="bg-muted px-4 py-2 text-center text-xs text-muted-foreground">
        Khu vực thử nghiệm nội bộ — không phải trang sản phẩm chính, không lập chỉ mục tìm kiếm.
      </p>
      {source === "mock" ? (
        <p className="bg-amber-500/15 px-4 py-2 text-center text-xs text-amber-800 dark:text-amber-200">
          Library seed unavailable — using v0 mock-data fallback. Run from repo with{" "}
          <code>13_PROJECT_DATA_SCHEMA.json</code>.
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
