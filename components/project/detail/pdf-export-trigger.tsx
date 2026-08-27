"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { publicEnv } from "@/lib/config/env";
import { t } from "@/lib/i18n/t";

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
export async function exportFactSheetPdf(slug?: string) {
  const functionUrl = publicEnv.pdfFunctionUrl || undefined;

  if (!functionUrl) {
    toast.message(t("pdf.printToast"), { duration: 4000 });
    window.print();
    return;
  }

  toast.message(t("pdf.functionAttemptToast"), { duration: 4000 });
  try {
    const res = await fetch(`${functionUrl}?slug=${encodeURIComponent(slug ?? "")}`);
    if (!res.ok) throw new Error(`PDF function responded ${res.status}`);
    const body: unknown = await res.json();
    const url = (body as { url?: unknown })?.url;
    if (typeof url !== "string" || !url) throw new Error("PDF function response missing a download url");

    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(t("pdf.functionSuccessToast"));
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("exportFactSheetPdf: PDF function request failed", err);
    }
    toast.error(t("pdf.functionErrorToast"));
  }
}

/** Fires automatically when the page loads with `?export=pdf` (CMDK entry point). */
export function PdfExportTrigger({ slug }: { slug?: string } = {}) {
  const searchParams = useSearchParams();
  const triggered = useRef(false);

  useEffect(() => {
    if (searchParams.get("export") !== "pdf" || triggered.current) return;
    triggered.current = true;
    void exportFactSheetPdf(slug);
  }, [searchParams, slug]);

  return null;
}
