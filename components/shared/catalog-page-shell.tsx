import type { ReactNode } from "react";

import { SiteHeader } from "@/components/shared/site-header";
import { cn } from "@/lib/utils";
import type { HeaderProject } from "@/lib/types";
import type { V0ImageAsset } from "@/lib/library-bridge";

interface CatalogPageShellProps {
  headerProjects: HeaderProject[];
  thumbBySlug?: Record<string, V0ImageAsset | null>;
  /** Show the amber "using v0 mock-data fallback" banner — pass `source === "mock"`. */
  showMockBanner: boolean;
  /** Extra classes on `<main>` — page-specific max-width / padding. */
  mainClassName?: string;
  children: ReactNode;
}

/**
 * F14 — shared shell for the 3 catalog-style routes (`/du-an`, `/so-sanh`, `/phap-ly`):
 * SiteHeader + dev/mock-data banner + `<main>` wrapper. Page-specific content (H1, body)
 * is passed as `children`; only the `<main>` width/padding and mock-banner visibility vary.
 */
export function CatalogPageShell({
  headerProjects,
  thumbBySlug,
  showMockBanner,
  mainClassName,
  children,
}: CatalogPageShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />

      {showMockBanner ? (
        <p className="bg-amber-500/15 px-4 py-2 text-center text-xs text-amber-800 dark:text-amber-200">
          Library seed unavailable — using v0 mock-data fallback. Run from repo with{" "}
          <code>13_PROJECT_DATA_SCHEMA.json</code>.
        </p>
      ) : null}

      <main className={cn("mx-auto pb-16 pt-8", mainClassName)}>{children}</main>
    </div>
  );
}
