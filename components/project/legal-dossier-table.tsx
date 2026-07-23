"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n/t";
import {
  LEGAL_DOSSIER_LABELS,
  LEGAL_DOSSIER_TABLE_KEYS,
  type Project,
  type LegalDossierKey,
} from "@/lib/types";

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
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
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={t("legal.copyLabel")}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
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

// ─── LegalDossierTable ────────────────────────────────────────────────────────

interface LegalDossierTableProps {
  project: Project;
  className?: string;
}

export function LegalDossierTable({
  project,
  className,
}: LegalDossierTableProps) {
  return (
    <div className={cn("w-full", className)}>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-[38%] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("legal.tableGroupCol")}
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("legal.tableContentCol")}
              </th>
              <th className="w-10 px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {LEGAL_DOSSIER_TABLE_KEYS.map((key: LegalDossierKey) => {
              // Defensive: legalDossier may be null/undefined
              const value = project.legalDossier?.[key] ?? null;
              const hasValue =
                typeof value === "string" && value.trim().length > 0;
              const isDisputes = key === "disputes";
              // Only treat disputes as a real warning if it doesn't start with "Không ghi nhận"
              const isRealDispute =
                isDisputes &&
                hasValue &&
                !value!.trimStart().startsWith("Không ghi nhận");

              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    "odd:bg-muted/20 hover:bg-muted/40",
                    isRealDispute
                      ? "bg-destructive/5 dark:bg-destructive/10"
                      : ""
                  )}
                >
                  {/* Label */}
                  <td className="px-4 py-3 align-top">
                    <span className="font-medium text-foreground">
                      {LEGAL_DOSSIER_LABELS[key]}
                    </span>
                    {isRealDispute && (
                      <Badge variant="destructive" className="ml-2 text-[10px]">
                        {t("legal.note")}
                      </Badge>
                    )}
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3 align-top">
                    {hasValue ? (
                      <span className="leading-relaxed text-foreground">
                        {value}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {t("legal.noData")}
                      </span>
                    )}

                    {/* constructionPermitsNote shown inline below permits */}
                    {key === "constructionPermits" &&
                      project.legalDossier?.constructionPermitsNote && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {project.legalDossier.constructionPermitsNote}
                        </p>
                      )}
                  </td>

                  {/* Copy */}
                  <td className="px-2 py-3 align-top">
                    {hasValue && <CopyButton value={value as string} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── LegalTimeline ────────────────────────────────────────────────────────────

interface LegalTimelineProps {
  project: Project;
  className?: string;
}

const TIMELINE_KEYS: LegalDossierKey[] = [
  "investmentApproval",
  "landAllocation",
  "detailedPlanning",
  "constructionPermits",
  "salesEligibility",
  "mainContractor",
  "disputes",
];

export function LegalTimeline({ project, className }: LegalTimelineProps) {
  return (
    <ol className={cn("relative border-l border-border pl-6", className)}>
      {TIMELINE_KEYS.map((key: LegalDossierKey) => {
        // Defensive: legalDossier may be null/undefined
        const value = project.legalDossier?.[key] ?? null;
        const hasValue =
          typeof value === "string" && value.trim().length > 0;
        const isDisputes = key === "disputes";
        const isRealDispute =
          isDisputes &&
          hasValue &&
          !value!.trimStart().startsWith("Không ghi nhận");

        return (
          <li key={key} className="group mb-6 last:mb-0">
            {/* Timeline dot */}
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

            <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {LEGAL_DOSSIER_LABELS[key]}
            </p>

            {hasValue ? (
              <p className="text-sm leading-relaxed text-foreground">
                {value}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{t("legal.noData")}</p>
            )}

            {key === "constructionPermits" &&
              project.legalDossier?.constructionPermitsNote && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.legalDossier.constructionPermitsNote}
                </p>
              )}
          </li>
        );
      })}
    </ol>
  );
}
