"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, SlidersHorizontalIcon, TableIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ProjectCard } from "@/components/project/project-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABEL } from "@/components/shared/status-badge";
import { t } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";
import {
  getBranchSlugs,
  parseNamGroupId,
  parseNavZoneId,
  type ProjectNamGroupId,
  type ProjectNavZoneId,
} from "@/lib/project-nav-taxonomy";
import { computeFieldStatusSummary } from "@library/lib/data/status-summary";
import { citySlug } from "@library/lib/data/region-slug";
import type { Project as FullProject, FieldStatus } from "@library/types/project";
import type { V0ImageAsset } from "@/lib/library-bridge";

const SORT_OPTIONS = [
  { value: "ten", label: "Tên A-Z" },
  { value: "quy-mo", label: "Quy mô đất giảm dần" },
  { value: "cap-nhat", label: "Cập nhật mới nhất" },
] as const;

const TYPE_OPTIONS = [
  { value: "do-thi-sinh-thai", label: "Đô thị sinh thái" },
  { value: "cao-tang", label: "Căn hộ cao tầng" },
];

const STATUS_FILTER_OPTIONS: FieldStatus[] = [
  "da-co-du-lieu",
  "chua-xac-thuc",
  "mau-thuan",
  "chua-co-du-lieu",
  "bao-mat",
];

/** Variant A — Editorial compact catalog chrome: chips + secondary filters drawer. */
export function ProjectExplorer({
  projects,
  heroAssetsBySlug,
}: {
  projects: FullProject[];
  heroAssetsBySlug: Record<string, V0ImageAsset | null>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [moreOpen, setMoreOpen] = useState(false);
  const khuVuc = searchParams.get("khu-vuc") ?? "all";
  const zone = parseNavZoneId(searchParams.get("zone"));
  const nhom = zone === "nam" ? parseNamGroupId(searchParams.get("nhom")) : null;
  const loai = searchParams.get("loai") ?? "all";
  const nhan = searchParams.get("nhan") ?? "all";
  const sapXep = searchParams.get("sap-xep") ?? "ten";

  const secondaryActive = khuVuc !== "all" || loai !== "all" || nhan !== "all";

  useEffect(() => {
    if (searchParams.get("xem") === "bang") {
      router.replace("/so-sanh");
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (secondaryActive) setMoreOpen(true);
  }, [secondaryActive]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("xem");
    if (value === "all" || !value) params.delete(key);
    else params.set(key, value);
    if (key === "zone" && value !== "nam") params.delete("nhom");
    if (key === "zone" && value === "all") params.delete("nhom");
    const qs = params.toString();
    router.replace(qs ? `/du-an?${qs}` : "/du-an", { scroll: false });
  }

  function setZoneFilter(next: ProjectNavZoneId | "all") {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("xem");
    if (next === "all") {
      params.delete("zone");
      params.delete("nhom");
    } else {
      params.set("zone", next);
      if (next === "nam") {
        if (!parseNamGroupId(params.get("nhom"))) params.set("nhom", "site-a");
      } else {
        params.delete("nhom");
      }
    }
    const qs = params.toString();
    router.replace(qs ? `/du-an?${qs}` : "/du-an", { scroll: false });
  }

  function setNhomFilter(next: ProjectNamGroupId | "all") {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("xem");
    params.set("zone", "nam");
    if (next === "all") params.delete("nhom");
    else params.set("nhom", next);
    const qs = params.toString();
    router.replace(qs ? `/du-an?${qs}` : "/du-an", { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = projects;
    if (zone) {
      const slugs = new Set(getBranchSlugs(zone, nhom));
      list = list.filter((p) => slugs.has(p.slug));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.displayNameVi.toLowerCase().includes(q) ||
          (p.alternateNames ?? []).some((n) => n.toLowerCase().includes(q)) ||
          (p.region ?? "").toLowerCase().includes(q)
      );
    }
    if (khuVuc !== "all") {
      list = list.filter((p) => citySlug(p.city ?? p.region ?? "") === khuVuc);
    }
    if (loai !== "all") {
      list = list.filter((p) => (p.projectType ?? []).includes(loai));
    }
    if (nhan !== "all") {
      list = list.filter((p) => {
        const summary = computeFieldStatusSummary(p);
        return !!summary[nhan as FieldStatus];
      });
    }

    const sorted = [...list];
    if (sapXep === "ten") sorted.sort((a, b) => a.displayNameVi.localeCompare(b.displayNameVi, "vi"));
    else if (sapXep === "quy-mo") sorted.sort((a, b) => (b.siteArea ?? 0) - (a.siteArea ?? 0));
    else if (sapXep === "cap-nhat")
      sorted.sort((a, b) => (b.lastVerifiedAt ?? "").localeCompare(a.lastVerifiedAt ?? ""));
    return sorted;
  }, [projects, query, khuVuc, zone, nhom, loai, nhan, sapXep]);

  function clearFilters() {
    setQuery("");
    setMoreOpen(false);
    router.replace("/du-an", { scroll: false });
  }

  const hasActiveFilters =
    Boolean(query) || khuVuc !== "all" || zone !== null || loai !== "all" || nhan !== "all";

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (zone === "bac") {
    activeChips.push({ key: "zone", label: t("duAn.zoneBac"), clear: () => setZoneFilter("all") });
  } else if (zone === "nam") {
    activeChips.push({ key: "zone", label: t("duAn.zoneNam"), clear: () => setZoneFilter("all") });
    if (nhom === "site-a") {
      activeChips.push({ key: "nhom", label: t("duAn.siteA"), clear: () => setNhomFilter("all") });
    } else if (nhom === "outsite") {
      activeChips.push({
        key: "nhom",
        label: t("duAn.outsite"),
        clear: () => setNhomFilter("all"),
      });
    }
  }
  if (khuVuc !== "all") {
    activeChips.push({
      key: "khu-vuc",
      label: khuVuc === "bac-ninh" ? "Bắc Ninh" : khuVuc === "tp-hcm" ? "TP.HCM" : khuVuc,
      clear: () => updateParam("khu-vuc", "all"),
    });
  }
  if (loai !== "all") {
    activeChips.push({
      key: "loai",
      label: TYPE_OPTIONS.find((o) => o.value === loai)?.label ?? loai,
      clear: () => updateParam("loai", "all"),
    });
  }
  if (nhan !== "all") {
    activeChips.push({
      key: "nhan",
      label: STATUS_LABEL[nhan as FieldStatus] ?? nhan,
      clear: () => updateParam("nhan", "all"),
    });
  }

  const sparse = filtered.length > 0 && filtered.length <= 2;

  return (
    <div>
      {/* Primary toolbar — one calm row */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder={t("duAn.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-56"
            suppressHydrationWarning
          />

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t("duAn.allZones")}>
            <FilterChip
              active={zone === null}
              onClick={() => setZoneFilter("all")}
              label={t("duAn.allZones")}
            />
            <FilterChip
              active={zone === "bac"}
              onClick={() => setZoneFilter("bac")}
              label={t("duAn.zoneBac")}
            />
            <FilterChip
              active={zone === "nam"}
              onClick={() => setZoneFilter("nam")}
              label={t("duAn.zoneNam")}
            />
            {zone === "nam" ? (
              <>
                <span className="mx-0.5 h-4 w-px bg-border" aria-hidden />
                <FilterChip
                  active={nhom === "site-a"}
                  onClick={() => setNhomFilter("site-a")}
                  label={t("duAn.siteA")}
                />
                <FilterChip
                  active={nhom === "outsite"}
                  onClick={() => setNhomFilter("outsite")}
                  label={t("duAn.outsite")}
                />
                <FilterChip
                  active={nhom === null}
                  onClick={() => setNhomFilter("all")}
                  label={t("duAn.allGroups")}
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={moreOpen || secondaryActive ? "secondary" : "outline"}
            size="sm"
            className="gap-1.5"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((o) => !o)}
          >
            <SlidersHorizontalIcon />
            {t("duAn.moreFilters")}
            {secondaryActive ? (
              <span className="rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
                {[khuVuc !== "all", loai !== "all", nhan !== "all"].filter(Boolean).length}
              </span>
            ) : null}
            <ChevronDownIcon className={cn("size-3.5 transition-transform", moreOpen && "rotate-180")} />
          </Button>

          <Select value={sapXep} onValueChange={(v) => v && updateParam("sap-xep", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue>{SORT_OPTIONS.find((s) => s.value === sapXep)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link
            href="/so-sanh"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            aria-label={t("duAn.openCompare")}
          >
            <TableIcon />
            {t("duAn.openCompare")}
          </Link>
        </div>
      </div>

      {/* Secondary filters — collapsed by default */}
      {moreOpen ? (
        <div className="mb-4 rounded-xl border border-border/80 bg-muted/30 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={khuVuc} onValueChange={(v) => v && updateParam("khu-vuc", v)}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue>{khuVuc === "all" ? t("duAn.allRegions") : khuVuc}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("duAn.allRegions")}</SelectItem>
                <SelectItem value="bac-ninh">Bắc Ninh</SelectItem>
                <SelectItem value="tp-hcm">TP.HCM</SelectItem>
              </SelectContent>
            </Select>

            <Select value={loai} onValueChange={(v) => v && updateParam("loai", v)}>
              <SelectTrigger className="w-[170px] bg-background">
                <SelectValue>
                  {loai === "all"
                    ? t("duAn.allTypes")
                    : (TYPE_OPTIONS.find((opt) => opt.value === loai)?.label ?? loai)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("duAn.allTypes")}</SelectItem>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={nhan} onValueChange={(v) => v && updateParam("nhan", v)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue>
                  {nhan === "all" ? t("duAn.allStatus") : STATUS_LABEL[nhan as FieldStatus]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("duAn.allStatus")}</SelectItem>
                {STATUS_FILTER_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}

      {/* Active filter story */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filtered.length}</span>
          {" / "}
          {projects.length} {t("duAn.unit")}
          {hasActiveFilters ? ` ${t("duAn.matchSuffix")}` : null}
        </p>
        {activeChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.clear}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted"
          >
            {chip.label}
            <XIcon className="size-3 text-muted-foreground" />
          </button>
        ))}
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {t("duAn.clearFilters")}
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center">
          <p className="text-sm text-muted-foreground">{t("duAn.noMatch")}</p>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            {t("duAn.clearFilters")}
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-6",
            sparse
              ? "max-w-3xl grid-cols-1 sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              heroAsset={heroAssetsBySlug[p.slug]}
              priority={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
