"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  const t = useTranslations();
  return (
    <Button variant="outline" className="print:hidden" onClick={() => window.print()}>
      {t("common.printPage")}
    </Button>
  );
}
