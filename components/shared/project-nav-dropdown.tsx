"use client";

import * as React from "react";
import Link from "next/link";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import type { HeaderProject } from "@/lib/types";
import type { V0ImageAsset } from "@/lib/library-bridge";
import {
  PROJECT_NAV_ZONES,
  buildCatalogHref,
  getZoneProjects,
  previewNavLeaves,
  resolveNavLeaves,
  type ProjectNamGroupId,
  type ProjectNavZoneId,
  type ResolvedNavLeaf,
} from "@/lib/project-nav-taxonomy";

/**
 * Desktop “Dự án” mega-menu — Variant A (Editorial compact).
 * Curated preview + single contextual CTA; full browse on `/du-an`.
 * Mobile accordion deferred (`mobile-nav.tsx`).
 */
export function ProjectNavDropdown({
  projects,
  thumbBySlug,
  active,
}: {
  projects: HeaderProject[];
  thumbBySlug: Record<string, V0ImageAsset | null>;
  active: boolean;
}) {
  const { t } = useLocale();
  const [zoneId, setZoneId] = React.useState<ProjectNavZoneId>("bac");
  const [namGroupId, setNamGroupId] = React.useState<ProjectNamGroupId>("site-a");

  const zone = PROJECT_NAV_ZONES.find((z) => z.id === zoneId) ?? PROJECT_NAV_ZONES[0];
  const leaves = resolveNavLeaves(getZoneProjects(zone, namGroupId), projects);
  const { preview, hiddenCount } = previewNavLeaves(leaves);
  const live = preview.filter((l) => l.href);
  const soon = preview.filter((l) => !l.href);

  const branchTitle =
    zone.id === "bac"
      ? t("nav.zoneBac")
      : namGroupId === "site-a"
        ? t("nav.siteA")
        : t("nav.outsite");

  const catalogHref =
    zone.id === "bac" ? buildCatalogHref("bac") : buildCatalogHref("nam", namGroupId);

  const viewAllLabel =
    zone.id === "bac"
      ? t("nav.viewAllZoneBac")
      : namGroupId === "site-a"
        ? t("nav.viewAllSiteA")
        : t("nav.viewAllOutsite");

  return (
    <MenuPrimitive.Root
      modal={false}
      onOpenChange={(open) => {
        if (!open) return;
        setZoneId("bac");
        setNamGroupId("site-a");
      }}
    >
      <MenuPrimitive.Trigger
        openOnHover
        delay={80}
        className={cn(
          "group relative flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        {t("nav.duAn")}
        <ChevronDownIcon className="size-3.5 transition-transform group-data-popup-open:rotate-180" />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner side="bottom" align="start" sideOffset={10} className="z-50">
          <MenuPrimitive.Popup
            className={cn(
              "w-[520px] overflow-hidden rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-[0_12px_40px_-12px_rgba(15,40,30,0.28)]",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            )}
          >
            <div className="flex">
              {/* Left rail */}
              <aside className="flex w-[148px] shrink-0 flex-col gap-4 bg-[color-mix(in_oklch,var(--muted)_70%,transparent)] px-2.5 py-3">
                <NavRailSection label={t("nav.zoneLabel")}>
                  {PROJECT_NAV_ZONES.map((z) => (
                    <NavRailButton
                      key={z.id}
                      selected={z.id === zoneId}
                      onSelect={() => setZoneId(z.id)}
                      label={z.id === "bac" ? t("nav.zoneBac") : t("nav.zoneNam")}
                    />
                  ))}
                </NavRailSection>

                {zone.id === "nam" ? (
                  <NavRailSection label={t("nav.siteGroupLabel")}>
                    {zone.groups.map((g) => (
                      <NavRailButton
                        key={g.id}
                        selected={g.id === namGroupId}
                        tone="accent"
                        onSelect={() => setNamGroupId(g.id)}
                        label={g.id === "site-a" ? t("nav.siteA") : t("nav.outsite")}
                      />
                    ))}
                  </NavRailSection>
                ) : null}
              </aside>

              {/* Right panel */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-end justify-between gap-3 px-4 pb-2 pt-3.5">
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                      {t("nav.duAn")}
                    </p>
                    <h3 className="font-display text-lg leading-tight text-foreground">{branchTitle}</h3>
                  </div>
                  <span className="pb-0.5 text-[11px] tabular-nums text-muted-foreground">
                    {leaves.length} {t("nav.projectsCountSuffix")}
                  </span>
                </div>

                <div className="flex-1 px-2 pb-2">
                  {live.length > 0 ? (
                    <ul className="space-y-0.5">
                      {live.map((leaf) => (
                        <li key={leaf.id}>
                          <ProjectNavLeafRow leaf={leaf} thumbBySlug={thumbBySlug} />
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {soon.length > 0 ? (
                    <div className={cn(live.length > 0 && "mt-2 border-t border-border/60 pt-2")}>
                      <p className="px-2 pb-1 text-[10px] font-medium tracking-wide text-muted-foreground/80 uppercase">
                        {t("nav.comingSoon")}
                      </p>
                      <ul className="space-y-0.5">
                        {soon.map((leaf) => (
                          <li key={leaf.id}>
                            <ProjectNavLeafRow leaf={leaf} thumbBySlug={thumbBySlug} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {hiddenCount > 0 ? (
                    <p className="px-2 pt-2 text-[11px] text-muted-foreground">
                      {t("nav.previewMore", { count: hiddenCount })}
                    </p>
                  ) : null}
                </div>

                <div className="px-3 pb-3">
                  <MenuPrimitive.LinkItem
                    render={<Link href={catalogHref} />}
                    className={cn(
                      "flex items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground outline-none",
                      "transition-colors hover:bg-primary/90 data-highlighted:bg-primary/90"
                    )}
                  >
                    {viewAllLabel}
                  </MenuPrimitive.LinkItem>
                </div>
              </div>
            </div>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}

function NavRailSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-2 pb-1.5 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function NavRailButton({
  label,
  selected,
  onSelect,
  tone = "neutral",
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  tone?: "neutral" | "accent";
}) {
  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative w-full rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? tone === "accent"
            ? "bg-primary/12 font-medium text-primary"
            : "bg-background font-medium text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
      )}
    >
      {selected ? (
        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" aria-hidden />
      ) : null}
      {label}
    </button>
  );
}

function ProjectNavLeafRow({
  leaf,
  thumbBySlug,
}: {
  leaf: ResolvedNavLeaf;
  thumbBySlug: Record<string, V0ImageAsset | null>;
}) {
  const thumb = leaf.slug ? thumbBySlug[leaf.slug] : null;
  const url = thumb ? (thumb.resolvedUrl ?? thumb.sourceFileUrl) : null;
  const subtitle = leaf.project
    ? leaf.project.displayNameVi !== leaf.label
      ? `${leaf.project.displayNameVi} · ${leaf.location}`
      : leaf.location
    : leaf.location;

  const body = (
    <>
      <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
        {url ? (
          <ImageWithFallback
            src={url}
            alt={thumb?.alt ?? leaf.label}
            fill
            unoptimized
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 bg-gradient-to-br from-primary/10 to-muted" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[13px] font-medium text-foreground">{leaf.label}</span>
        <span className="truncate text-[11px] text-muted-foreground">{subtitle}</span>
      </span>
    </>
  );

  if (leaf.href) {
    return (
      <MenuPrimitive.LinkItem
        render={<Link href={leaf.href} />}
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 outline-none transition-colors data-highlighted:bg-accent"
      >
        {body}
      </MenuPrimitive.LinkItem>
    );
  }

  return (
    <div className="flex cursor-default items-center gap-2.5 rounded-lg px-2 py-1.5 opacity-55" aria-disabled="true">
      {body}
    </div>
  );
}
