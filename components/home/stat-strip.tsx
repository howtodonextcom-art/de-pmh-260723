"use client";

import { motion } from "framer-motion";

import { NumberTicker } from "@/components/shared/number-ticker";
import { staggerChildren, revealUp, viewportOnce } from "@/lib/motion/presets";
import { useLocale } from "@/lib/i18n/locale-context";
import type { PortfolioStats } from "@/lib/home-content";

export function StatStrip({ stats }: { stats: PortfolioStats }) {
  const { t } = useLocale();
  const tiles = [
    { label: t("home.statProjects"), value: stats.projectCount, suffix: "" },
    { label: t("home.statRegions"), value: stats.regionCount, suffix: "" },
    {
      label: t("home.statMaxSiteArea", { project: stats.maxSiteAreaProjectName }),
      value: stats.maxSiteAreaHa,
      suffix: " ha",
    },
    { label: t("home.statUnitsAnnounced"), value: stats.totalUnitsAnnounced, suffix: "" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={staggerChildren}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {tiles.map((tile) => (
          <motion.div key={tile.label} variants={revealUp}>
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-muted py-6 text-center transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 motion-reduce:hover:translate-y-0">
              <p className="text-3xl font-bold tabular-nums text-primary">
                <NumberTicker value={tile.value} />
                {tile.suffix}
              </p>
              <p className="mt-1 px-2 text-xs font-medium text-foreground/70">{tile.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-3 text-center text-xs text-muted-foreground">{t("home.statFootnote")}</p>
    </section>
  );
}
