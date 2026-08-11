"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  getBranchSlugs,
  parseNamGroupId,
  parseNavZoneId,
  type ProjectNamGroupId,
  type ProjectNavZoneId,
} from "@/lib/project-nav-taxonomy";
import { COMPARE_COLUMN_CAP, COMPARE_FIELDS } from "@library/lib/data/compare-fields";
import type { Project } from "@library/types/project";

/**
 * Variant A — Branch matrix: zone/group chips → candidates → multi-select (cap 4)
 * → attribute×project table. Does not render hundreds of columns by default.
 */
export function CompareTable({ projects }: { projects: Project[] }) {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hideIdentical, setHideIdentical] = useState(false);

  const zone = parseNavZoneId(searchParams.get("zone"));
  const nhom = zone === "nam" ? parseNamGroupId(searchParams.get("nhom")) : null;

  const candidates = useMemo(() => {
    if (!zone) return projects;
    const allowed = new Set(getBranchSlugs(zone, nhom));
    return projects.filter((p) => allowed.has(p.slug));
  }, [projects, zone, nhom]);

  const slugsParam = searchParams.get("slugs");
  const selectedSlugs = useMemo(() => {
    if (slugsParam) {
      const asked = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
      const allowed = new Set(candidates.map((p) => p.slug));
      const picked = asked.filter((s) => allowed.has(s)).slice(0, COMPARE_COLUMN_CAP);
      if (picked.length > 0) return picked;
    }
    // Auto-pick when the branch fits the soft cap.
    if (candidates.length > 0 && candidates.length <= COMPARE_COLUMN_CAP) {
      return candidates.map((p) => p.slug);
    }
    return [] as string[];
  }, [slugsParam, candidates]);

  const selectedProjects = useMemo(
    () =>
      selectedSlugs
        .map((slug) => candidates.find((p) => p.slug === slug) ?? projects.find((p) => p.slug === slug))
        .filter((p): p is Project => Boolean(p)),
    [selectedSlugs, candidates, projects]
  );

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `/so-sanh?${qs}` : "/so-sanh", { scroll: false });
    },
    [router, searchParams]
  );

  function setZoneFilter(next: ProjectNavZoneId | "all") {
    replaceParams((params) => {
      params.delete("slugs");
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
    });
  }

  function setNhomFilter(next: ProjectNamGroupId | "all") {
    replaceParams((params) => {
      params.delete("slugs");
      params.set("zone", "nam");
      if (next === "all") params.delete("nhom");
      else params.set("nhom", next);
    });
  }

  function toggleSlug(slug: string) {
    replaceParams((params) => {
      const allowed = new Set(candidates.map((p) => p.slug));
      let next = selectedSlugs.filter((s) => allowed.has(s));
      if (next.includes(slug)) {
        next = next.filter((s) => s !== slug);
      } else if (next.length < COMPARE_COLUMN_CAP) {
        next = [...next, slug];
      } else {
        return; // at cap — ignore add
      }
      if (
        next.length === candidates.length &&
        candidates.length <= COMPARE_COLUMN_CAP &&
        candidates.every((p) => next.includes(p.slug))
      ) {
        params.delete("slugs");
      } else if (next.length === 0) {
        params.delete("slugs");
      } else {
        params.set("slugs", next.join(","));
      }
    });
  }

  function selectAllCandidates() {
    replaceParams((params) => {
      if (candidates.length === 0) {
        params.delete("slugs");
        return;
      }
      if (candidates.length <= COMPARE_COLUMN_CAP) {
        params.delete("slugs");
        return;
      }
      params.set(
        "slugs",
        candidates
          .slice(0, COMPARE_COLUMN_CAP)
          .map((p) => p.slug)
          .join(",")
      );
    });
  }

  // Keep URL honest when auto-selection applies and stale slugs linger outside branch.
  useEffect(() => {
    if (!slugsParam) return;
    const asked = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
    const allowed = new Set(candidates.map((p) => p.slug));
    const cleaned = asked.filter((s) => allowed.has(s)).slice(0, COMPARE_COLUMN_CAP);
    if (cleaned.join(",") === asked.join(",")) return;
    replaceParams((params) => {
      if (cleaned.length === 0) params.delete("slugs");
      else params.set("slugs", cleaned.join(","));
    });
  }, [slugsParam, candidates, replaceParams]);

  const rows = useMemo(() => {
    return COMPARE_FIELDS.map((field) => ({
      field,
      cells: selectedProjects.map((p) => field.cell(p)),
    })).filter((row) => {
      if (!hideIdentical || selectedProjects.length < 2) return true;
      const values = row.cells.map((c) => c.display);
      return new Set(values).size > 1;
    });
  }, [selectedProjects, hideIdentical]);

  const needsManualPick = candidates.length > COMPARE_COLUMN_CAP && selectedProjects.length === 0;

  return (
    <div>
      {/* Scope — zone / group */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t("compare.zoneLabel")}>
          <ScopeChip
            active={zone === null}
            onClick={() => setZoneFilter("all")}
            label={t("compare.allZones")}
          />
          <ScopeChip
            active={zone === "bac"}
            onClick={() => setZoneFilter("bac")}
            label={t("compare.zoneBac")}
          />
          <ScopeChip
            active={zone === "nam"}
            onClick={() => setZoneFilter("nam")}
            label={t("compare.zoneNam")}
          />
          {zone === "nam" ? (
            <>
              <span className="mx-0.5 h-4 w-px bg-border" aria-hidden />
              <ScopeChip
                active={nhom === "site-a"}
                onClick={() => setNhomFilter("site-a")}
                label={t("compare.siteA")}
              />
              <ScopeChip
                active={nhom === "outsite"}
                onClick={() => setNhomFilter("outsite")}
                label={t("compare.outsite")}
              />
              <ScopeChip
                active={nhom === null}
                onClick={() => setNhomFilter("all")}
                label={t("compare.allGroups")}
              />
            </>
          ) : null}
        </div>

        {/* Project picker within scope */}
        <div className="rounded-xl border border-border/80 bg-muted/25 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-foreground">
              <span className="font-medium">
                {selectedProjects.length}/{COMPARE_COLUMN_CAP}
              </span>{" "}
              <span className="text-muted-foreground">{t("compare.selectedHint")}</span>
              <span className="text-muted-foreground">
                {" "}
                · {candidates.length} {t("compare.inScope")}
              </span>
            </p>
            <div className="flex items-center gap-2">
              {candidates.length > 0 ? (
                <Button type="button" variant="ghost" size="sm" onClick={selectAllCandidates}>
                  {candidates.length <= COMPARE_COLUMN_CAP
                    ? t("compare.selectAllInScope")
                    : t("compare.selectFirstCap", { count: COMPARE_COLUMN_CAP })}
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHideIdentical((v) => !v)}
                disabled={selectedProjects.length < 2}
              >
                {hideIdentical ? t("compare.showAllRows") : t("compare.hideIdentical")}
              </Button>
            </div>
          </div>

          {candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("compare.emptyScope")}</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {candidates.map((p) => {
                const on = selectedSlugs.includes(p.slug);
                const blocked = !on && selectedSlugs.length >= COMPARE_COLUMN_CAP;
                return (
                  <li key={p.slug}>
                    <button
                      type="button"
                      aria-pressed={on}
                      disabled={blocked}
                      onClick={() => toggleSlug(p.slug)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : blocked
                            ? "cursor-not-allowed border-border text-muted-foreground/50"
                            : "border-border bg-background text-foreground hover:bg-muted"
                      )}
                    >
                      {p.displayNameVi}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {candidates.length > COMPARE_COLUMN_CAP ? (
            <p className="mt-2 text-[11px] text-muted-foreground">
              {t("compare.capNote", { count: COMPARE_COLUMN_CAP })}
            </p>
          ) : null}
        </div>
      </div>

      {needsManualPick ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">{t("compare.pickProjects")}</p>
        </div>
      ) : selectedProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">{t("compare.emptySelection")}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="sticky left-0 z-10 bg-muted/40 p-3 text-left font-medium">
                    <span className="sr-only">{t("compare.fieldCol")}</span>
                  </th>
                  {selectedProjects.map((p) => (
                    <th key={p.slug} className="min-w-[160px] p-3 text-left font-medium">
                      <Link href={`/du-an/${p.slug}`} className="hover:underline">
                        {p.displayNameVi}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.field.id} className="border-b border-border last:border-0">
                    <td className="sticky left-0 z-10 bg-background p-3 font-medium">
                      {row.field.label}
                    </td>
                    {row.cells.map((cell, i) => (
                      <td key={selectedProjects[i]?.slug ?? i} className="p-3 align-top">
                        <Tooltip>
                          <TooltipTrigger render={<span className="cursor-help" />}>
                            {cell.display}
                          </TooltipTrigger>
                          <TooltipContent>
                            {cell.tooltip ??
                              `Cập nhật ${selectedProjects[i]?.lastVerifiedAt ?? "—"}`}
                          </TooltipContent>
                        </Tooltip>
                        {row.field.id !== "tinh-trang-ban" ? (
                          <div className="mt-1">
                            <StatusBadge status={cell.status} />
                          </div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile accordion */}
          <Accordion className="md:hidden">
            {selectedProjects.map((p) => (
              <AccordionItem key={p.slug} value={p.slug}>
                <AccordionTrigger>{p.displayNameVi}</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-3">
                    {COMPARE_FIELDS.map((field) => {
                      const cell = field.cell(p);
                      return (
                        <div key={field.id}>
                          <dt className="text-xs text-muted-foreground">{field.label}</dt>
                          <dd className="flex items-center gap-2 text-sm">
                            {cell.display}
                            {field.id !== "tinh-trang-ban" ? (
                              <StatusBadge status={cell.status} />
                            ) : null}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
}

function ScopeChip({
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
