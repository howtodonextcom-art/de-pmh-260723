"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { publicEnv } from "@/lib/config/env";

export interface PdfExportMessages {
  printToast: string;
  functionAttemptToast: string;
  functionSuccessToast: string;
  functionErrorToast: string;
}

/**
 * F6 — "Xuất PDF" must never silently do nothing.
 *
 * Default path (NEXT_PUBLIC_PDF_FUNCTION_URL unset, the current/CI state):
 * honest print-CSS fallback (A4 fact sheet via the browser's native print),
 * not a fake download.
 *
 * Optional path (env set): attempts a real fetch against a deployed PDF
 * Cloud Function (see `docs/PDF_EXPORT.md` for the wire contract, mirrored
 * from `functions/src/export-fact-sheet-pdf.ts` in Local). On any failure —
 * network error, non-2xx, malformed body — shows a clear error toast and
 * stops; it never falls back to print silently and never claims success it
 * didn't have.
 */
/** Takes translated messages as a param — useTranslations() is a hook and
 *  this is a plain async function called from multiple components (this
 *  file's own trigger, and sources.tsx's export button). */
export async function exportFactSheetPdf(slug: string | undefined, messages: PdfExportMessages) {
  const functionUrl = publicEnv.pdfFunctionUrl || undefined;

  if (!functionUrl) {
    toast.message(messages.printToast, { duration: 4000 });
    window.print();
    return;
  }

  toast.message(messages.functionAttemptToast, { duration: 4000 });
  try {
    const res = await fetch(`${functionUrl}?slug=${encodeURIComponent(slug ?? "")}`);
    if (!res.ok) throw new Error(`PDF function responded ${res.status}`);
    const body: unknown = await res.json();
    const url = (body as { url?: unknown })?.url;
    if (typeof url !== "string" || !url) throw new Error("PDF function response missing a download url");

    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(messages.functionSuccessToast);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("exportFactSheetPdf: PDF function request failed", err);
    }
    toast.error(messages.functionErrorToast);
  }
}

/** Fires automatically when the page loads with `?export=pdf` (CMDK entry point). */
export function PdfExportTrigger({ slug }: { slug?: string } = {}) {
  const t = useTranslations("pdf");
  const searchParams = useSearchParams();
  const triggered = useRef(false);

  useEffect(() => {
    if (searchParams.get("export") !== "pdf" || triggered.current) return;
    triggered.current = true;
    void exportFactSheetPdf(slug, {
      printToast: t("printToast"),
      functionAttemptToast: t("functionAttemptToast"),
      functionSuccessToast: t("functionSuccessToast"),
      functionErrorToast: t("functionErrorToast"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, slug]);

  return null;
}
