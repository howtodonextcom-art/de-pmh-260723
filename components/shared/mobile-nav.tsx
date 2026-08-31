"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDownIcon, MenuIcon } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import type { HeaderProject } from "@/lib/types";
import type { V0ImageAsset } from "@/lib/library-bridge";
import {
  PROJECT_NAV_ZONES,
  catalogLeavesForZone,
  resolveNavLeaves,
  type ProjectNavZoneId,
  type ResolvedNavLeaf,
} from "@/lib/project-nav-taxonomy";

/** SPEC §3.1 "Mobile nav (<1024)" — accessible Dialog-based panel, not dead links.
 *  Mirrors desktop's Phía Bắc / Phía Nam → Site A / Outsite taxonomy
 *  (`project-nav-dropdown.tsx`) as a two-level touch accordion: Phía Bắc's
 *  leaves show directly, Phía Nam expands into Site A / Outsite sub-groups. */
export function MobileNav({
  projects,
  activeKey,
}: {
  projects: HeaderProject[];
  /** Accepted for SiteHeader API parity; desktop dropdown consumes thumbs. */
  thumbBySlug?: Record<string, V0ImageAsset | null>;
  activeKey: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const [expandedZone, setExpandedZone] = React.useState<ProjectNavZoneId | null>(null);
  const { t } = useLocale();

  const bacZone = PROJECT_NAV_ZONES.find((z) => z.id === "bac");
  const namZone = PROJECT_NAV_ZONES.find((z) => z.id === "nam");

  const navItems = [
    { key: "du-an", label: t("nav.duAn"), href: "/du-an" },
    { key: "so-sanh", label: t("nav.soSanh"), href: "/so-sanh" },
    { key: "phap-ly", label: t("nav.phapLy"), href: "/phap-ly" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("nav.openMenu")}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg text-foreground",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "lg:hidden"
        )}
      >
        <MenuIcon className="size-5" />
      </button>
      <DialogContent
        showCloseButton
        className="left-auto top-0 right-0 h-full max-h-none w-[min(88vw,320px)] max-w-none translate-x-0 translate-y-0 rounded-none rounded-l-xl border-l border-border p-4 data-open:slide-in-from-right data-closed:slide-out-to-right"
      >
        <DialogTitle className="mb-4 text-sm font-semibold text-foreground">{t("nav.menuLabel")}</DialogTitle>

        <nav aria-label={t("nav.menuLabel")} className="mb-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={item.key === activeKey ? "page" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium",
                item.key === activeKey ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("nav.projectsUnit")}
        </p>
        <div className="space-y-2">
          {bacZone ? (
            <MobileNavZoneSection
              label={t("nav.zoneBac")}
              expanded={expandedZone === "bac"}
              onToggle={() => setExpandedZone((z) => (z === "bac" ? null : "bac"))}
            >
              <MobileNavLeafList
                leaves={resolveNavLeaves(catalogLeavesForZone(projects, "bac"), projects)}
                comingSoonLabel={t("nav.comingSoon")}
                onNavigate={() => setOpen(false)}
              />
            </MobileNavZoneSection>
          ) : null}

          {namZone && namZone.groups ? (
            <MobileNavZoneSection
              label={t("nav.zoneNam")}
              expanded={expandedZone === "nam"}
              onToggle={() => setExpandedZone((z) => (z === "nam" ? null : "nam"))}
            >
              <div className="space-y-3">
                {namZone.groups.map((group) => (
                  <div key={group.id}>
                    <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                      {group.id === "site-a" ? t("nav.siteA") : t("nav.outsite")}
                    </p>
                    <MobileNavLeafList
                      leaves={resolveNavLeaves(catalogLeavesForZone(projects, "nam", group.id), projects)}
                      comingSoonLabel={t("nav.comingSoon")}
                      onNavigate={() => setOpen(false)}
                    />
                  </div>
                ))}
              </div>
            </MobileNavZoneSection>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Top-level accordion row (Phía Bắc / Phía Nam). */
function MobileNavZoneSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted"
      >
        {label}
        <ChevronDownIcon
          aria-hidden
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded ? <div className="px-2 pb-2 pt-1">{children}</div> : null}
    </div>
  );
}

/** Leaf rows for a zone (or Nam sub-group): live projects link out, coming-soon leaves are muted. */
function MobileNavLeafList({
  leaves,
  comingSoonLabel,
  onNavigate,
}: {
  leaves: ResolvedNavLeaf[];
  comingSoonLabel: string;
  onNavigate: () => void;
}) {
  const live = leaves.filter((leaf) => leaf.href);
  const soon = leaves.filter((leaf) => !leaf.href);

  return (
    <div className="space-y-0.5">
      {live.map((leaf) => (
        <Link
          key={leaf.id}
          href={leaf.href as string}
          onClick={onNavigate}
          className="flex flex-col gap-0.5 rounded-lg px-2 py-1.5 hover:bg-muted"
        >
          <span className="text-sm font-medium text-foreground">{leaf.label}</span>
          <span className="text-xs text-muted-foreground">{leaf.location}</span>
        </Link>
      ))}

      {soon.length > 0 ? (
        <div className={cn(live.length > 0 && "mt-1.5 border-t border-border/60 pt-1.5")}>
          <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
            {comingSoonLabel}
          </p>
          {soon.map((leaf) => (
            <div
              key={leaf.id}
              aria-disabled="true"
              className="flex cursor-default flex-col gap-0.5 rounded-lg px-2 py-1.5 opacity-55"
            >
              <span className="text-sm font-medium text-foreground">{leaf.label}</span>
              <span className="text-xs text-muted-foreground">{leaf.location}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
