"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  LEGAL_TABLE_ROW_LABELS,
  LEGAL_TABLE_ROW_ORDER,
  getDossierRaw,
  isLegalDossierKey,
  splitLegalContent,
  type LegalDocLine,
  type LegalTableRowId,
} from "@/lib/legal-documents";
import type { LegalDossier } from "@/lib/types";
import type { Project as FullProject } from "@library/types/project";

/** Minimal project shape for legal table (FullProject or slim demo project). */
export type LegalTableProject = {
  slug: string;
  displayNameVi: string;
  legalDossier?: LegalDossier | null;
  conceptArchitect?: FullProject["conceptArchitect"] | null;
};

function CopyButton({ value }: { value: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(t("legal.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("legal.copyFailed"));
    }
  }, [value, t]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={t("legal.copyLabel")}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-green-600 dark:text-green-400" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  );
}

type ViewerState = {
  groupId: LegalTableRowId;
  line: LegalDocLine;
} | null;

/** Live viewport height (visualViewport when available) for modal sizing. */
function useViewportHeightPx(enabled: boolean): number | null {
  const [height, setHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    const read = () => {
      const next = Math.round(window.visualViewport?.height ?? window.innerHeight);
      setHeight(next > 0 ? next : null);
    };

    read();
    window.addEventListener("resize", read);
    window.visualViewport?.addEventListener("resize", read);
    window.visualViewport?.addEventListener("scroll", read);

    return () => {
      window.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("scroll", read);
    };
  }, [enabled]);

  return height;
}

/** Modal box: ~92% viewport tall, 4% top inset — updates on resize/orientation. */
function useViewportModalBox(enabled: boolean): {
  style: React.CSSProperties;
  viewportHeight: number | null;
} {
  const viewportHeight = useViewportHeightPx(enabled);

  const style = React.useMemo<React.CSSProperties>(() => {
    // Horizontal centering is already handled by DialogContent's
    // `left-1/2 translate-x-[-50%]` classes, which (Tailwind v4) set the
    // native CSS `translate` property. Do NOT also set `transform:
    // translateX(-50%)` here — `translate` and `transform` are separate CSS
    // properties that compose, so setting both doubles the offset and
    // shoves the dialog off-screen to the left.
    if (!viewportHeight) {
      return {
        height: "92dvh",
        maxHeight: "92dvh",
        top: "4dvh",
      };
    }
    const height = Math.max(320, Math.round(viewportHeight * 0.92));
    const top = Math.max(8, Math.round((viewportHeight - height) / 2));
    return {
      height: `${height}px`,
      maxHeight: `${height}px`,
      top: `${top}px`,
    };
  }, [viewportHeight]);

  return { style, viewportHeight };
}

function resolveDesignUnitLines(project: LegalTableProject): LegalDocLine[] {
  const ca = project.conceptArchitect;
  if (!ca?.value?.trim() || ca.status !== "da-co-du-lieu") return [];
  // Same honesty rule as compare/fact-grid for Hồng Hạc.
  if (project.slug === "hong-hac-city" && ca.publicNameApproved !== true) return [];
  return [{ id: "design-unit", text: ca.value.trim(), scanAssetId: null }];
}

function resolveGroupLines(project: LegalTableProject, rowId: LegalTableRowId): LegalDocLine[] {
  if (rowId === "designUnit") return resolveDesignUnitLines(project);
  if (rowId === "constructionPermitsNote") return [];
  if (!isLegalDossierKey(rowId)) return [];
  return splitLegalContent(getDossierRaw(project.legalDossier, rowId));
}

export function LegalDossierTable({
  project,
  className,
}: {
  project: LegalTableProject;
  className?: string;
}) {
  const { t } = useLocale();
  const [viewer, setViewer] = React.useState<ViewerState>(null);
  const { style: modalBoxStyle } = useViewportModalBox(viewer !== null);

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-[28%] px-4 py-2.5 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t("legal.tableGroupCol")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t("legal.tableContentCol")}
              </th>
            </tr>
          </thead>
          <tbody>
            {LEGAL_TABLE_ROW_ORDER.map((rowId) => {
              const lines = resolveGroupLines(project, rowId);
              const hasValue = lines.length > 0;
              const isDisputes = rowId === "disputes";
              const isRealDispute =
                isDisputes &&
                hasValue &&
                !lines[0]!.text.trimStart().startsWith("Không ghi nhận");

              return (
                <tr
                  key={rowId}
                  className={cn(
                    "border-b border-border transition-colors last:border-0",
                    "odd:bg-muted/20 hover:bg-muted/40",
                    isRealDispute ? "bg-destructive/5 dark:bg-destructive/10" : ""
                  )}
                >
                  <td className="px-4 py-3 align-top">
                    <span className="font-medium text-foreground">
                      {LEGAL_TABLE_ROW_LABELS[rowId]}
                    </span>
                    {isRealDispute ? (
                      <Badge variant="destructive" className="ml-2 text-[10px]">
                        {t("legal.note")}
                      </Badge>
                    ) : null}
                  </td>

                  <td className="px-4 py-3 align-top">
                    {hasValue ? (
                      <ul className="space-y-2">
                        {lines.map((line) => (
                          <li key={line.id} className="flex items-start gap-2">
                            <button
                              type="button"
                              data-testid="legal-doc-line"
                              onClick={() => setViewer({ groupId: rowId, line })}
                              className={cn(
                                "min-w-0 flex-1 rounded-md px-1.5 py-1 text-left leading-relaxed text-foreground",
                                "transition-colors hover:bg-primary/5 hover:text-primary",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              )}
                            >
                              <span className="inline-flex items-start gap-1.5">
                                <FileTextIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                                <span>
                                  {line.text}
                                  {line.date ? (
                                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                      {t("legal.docDate")}: {line.date}
                                    </span>
                                  ) : null}
                                </span>
                              </span>
                            </button>
                            <CopyButton value={line.text} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">{t("legal.noData")}</span>
                    )}

                    {rowId === "constructionPermits" &&
                    project.legalDossier?.constructionPermitsNote ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {project.legalDossier.constructionPermitsNote}
                      </p>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog
        open={viewer !== null}
        onOpenChange={(open) => {
          if (!open) setViewer(null);
        }}
      >
        {viewer ? (
          <DialogContent
            data-testid="legal-doc-viewer"
            showCloseButton
            style={modalBoxStyle}
            className={cn(
              "flex w-[min(96vw,1100px)] flex-col gap-0 overflow-hidden p-0",
              "max-w-[min(96vw,1100px)] sm:max-w-[min(96vw,1100px)]",
              "left-1/2 translate-x-[-50%] translate-y-0"
            )}
          >
            <DialogHeader className="shrink-0 border-b border-border px-5 py-4 pr-12 text-left">
              <DialogTitle className="font-display text-lg sm:text-xl">
                {LEGAL_TABLE_ROW_LABELS[viewer.groupId]}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {viewer.line.code ?? t("legal.docDetail")}
                {viewer.line.date ? ` · ${viewer.line.date}` : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
              <section className="flex min-h-0 flex-col border-b border-border lg:border-r lg:border-b-0">
                <p className="shrink-0 px-5 pt-4 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {t("legal.docText")}
                </p>
                <div
                  data-testid="legal-doc-text-scroll"
                  className="min-h-0 flex-1 overflow-y-auto px-5 pb-5"
                >
                  <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
                    <p className="text-sm leading-7 whitespace-pre-wrap text-foreground sm:text-[15px] sm:leading-8">
                      {viewer.line.text}
                    </p>
                  </div>
                </div>
              </section>

              <section className="flex min-h-0 flex-col">
                <p className="shrink-0 px-5 pt-4 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {t("legal.docScan")}
                </p>
                <div
                  data-testid="legal-doc-scan-pane"
                  className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-5 pb-5"
                >
                  <div className="flex h-full min-h-[min(50vh,360px)] w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 bg-muted/20 px-6 py-10 text-center dark:border-muted-foreground/70">
                    <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {t("legal.scanEmpty")}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3">
              <CopyButton value={viewer.line.text} />
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

/** Timeline of dossier groups (still group-level; per-doc dates when parseable). */
export function LegalTimeline({
  project,
  className,
}: {
  project: LegalTableProject;
  className?: string;
}) {
  const { t } = useLocale();

  return (
    <ol className={cn("relative border-l border-border pl-6", className)}>
      {LEGAL_TABLE_ROW_ORDER.map((rowId) => {
        const lines = resolveGroupLines(project, rowId);
        const hasValue = lines.length > 0;
        const isDisputes = rowId === "disputes";
        const isRealDispute =
          isDisputes && hasValue && !lines[0]!.text.trimStart().startsWith("Không ghi nhận");

        return (
          <li key={rowId} className="group mb-6 last:mb-0">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[0.3125rem] mt-1 size-2.5 rounded-full border-2 transition-colors",
                hasValue
                  ? isRealDispute
                    ? "border-destructive bg-destructive/20"
                    : "border-primary bg-primary"
                  : "border-border bg-background"
              )}
            />

            <p className="mb-0.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {LEGAL_TABLE_ROW_LABELS[rowId]}
            </p>

            {hasValue ? (
              <ul className="space-y-1.5">
                {lines.map((line) => (
                  <li key={line.id} className="text-sm leading-relaxed text-foreground">
                    {line.text}
                    {line.date ? (
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {line.date}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t("legal.noData")}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
