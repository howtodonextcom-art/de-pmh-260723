"use client";

import { useEffect, useMemo, useState } from "react";
import { TableIcon } from "lucide-react";
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
  const khuVuc = searchParams.get("khu-vuc") ?? "all";
  const loai = searchParams.get("loai") ?? "all";
  const nhan = searchParams.get("nhan") ?? "all";
  const sapXep = searchParams.get("sap-xep") ?? "ten";

  // Option A: `/so-sanh` is the sole compare surface — legacy `?xem=bang` bookmarks redirect.
  useEffect(() => {
    if (searchParams.get("xem") === "bang") {
      router.replace("/so-sanh");
    }
  }, [router, searchParams]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("xem");
    if (value === "all" || !value) params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `/du-an?${qs}` : "/du-an", { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = projects;
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
    else if (sapXep === "cap-nhat") sorted.sort((a, b) => (b.lastVerifiedAt ?? "").localeCompare(a.lastVerifiedAt ?? ""));
    return sorted;
  }, [projects, query, khuVuc, loai, nhan, sapXep]);

  function clearFilters() {
    setQuery("");
    router.replace("/du-an", { scroll: false });
  }

  const hasActiveFilters = query || khuVuc !== "all" || loai !== "all" || nhan !== "all";

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder={t("duAn.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-64"
          // Base UI's Input sets `caretColor` client-side only (touch-device
          // caret handling), which can never match SSR output — cosmetic-only,
          // not a real content/logic mismatch.
          suppressHydrationWarning
        />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={khuVuc} onValueChange={(v) => v && updateParam("khu-vuc", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue>{khuVuc === "all" ? t("duAn.allRegions") : khuVuc}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("duAn.allRegions")}</SelectItem>
              <SelectItem value="bac-ninh">Bắc Ninh</SelectItem>
              <SelectItem value="tp-hcm">TP.HCM</SelectItem>
            </SelectContent>
          </Select>

          <Select value={loai} onValueChange={(v) => v && updateParam("loai", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue>
                {loai === "all" ? t("duAn.allTypes") : (TYPE_OPTIONS.find((opt) => opt.value === loai)?.label ?? loai)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("duAn.allTypes")}</SelectItem>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={nhan} onValueChange={(v) => v && updateParam("nhan", v)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue>{nhan === "all" ? t("duAn.allStatus") : STATUS_LABEL[nhan as FieldStatus]}</SelectValue>
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

          <Select value={sapXep} onValueChange={(v) => v && updateParam("sap-xep", v)}>
            <SelectTrigger className="w-[190px]">
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">{t("duAn.noMatch")}</p>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            {t("duAn.clearFilters")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProjectCard key={p.slug} project={p} heroAsset={heroAssetsBySlug[p.slug]} priority={i === 0} />
          ))}
        </div>
      )}

      {hasActiveFilters && filtered.length > 0 && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {filtered.length} / {projects.length} {t("duAn.unit")} {t("duAn.matchSuffix")} ·{" "}
          <button type="button" onClick={clearFilters} className="underline hover:text-foreground">
            {t("duAn.clearFilters")}
          </button>
        </p>
      )}
    </div>
  );
}
