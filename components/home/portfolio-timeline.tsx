"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

import { t } from "@/lib/i18n/t";
import type { Milestone } from "@/lib/home-content";
import type { Project as FullProject } from "@library/types/project";

export function PortfolioTimeline({ milestones, projects }: { milestones: Milestone[]; projects: FullProject[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollXProgress } = useScroll({ container: ref });
  const scaleX = useSpring(scrollXProgress, { stiffness: 200, damping: 30 });
  const nameBySlug = new Map(projects.map((p) => [p.slug, p.displayNameVi]));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 font-display text-2xl font-semibold">{t("home.timelineHeading")}</h2>

      {/* Mobile: vertical rail */}
      <div className="space-y-4 border-l border-border pl-4 md:hidden">
        {milestones.map((m) => (
          <MilestoneCard key={m.id} m={m} nameBySlug={nameBySlug} />
        ))}
      </div>

      {/* Desktop: horizontal scroll rail */}
      <div className="relative hidden md:block">
        <div className="absolute top-0 right-0 left-0 h-px bg-border" />
        {!reduceMotion && (
          <motion.div
            style={{ scaleX, transformOrigin: "0% 50%" }}
            className="absolute top-0 right-0 left-0 h-px bg-primary"
          />
        )}
        <div ref={ref} className="no-scrollbar flex gap-6 overflow-x-auto pt-6">
          {milestones.map((m) => (
            <div key={m.id} className="w-64 shrink-0">
              <MilestoneCard m={m} nameBySlug={nameBySlug} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MilestoneCard({ m, nameBySlug }: { m: Milestone; nameBySlug: Map<string, string> }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
      <p className="text-2xl font-bold text-primary tabular-nums">{m.year}</p>
      {m.projectSlug && (
        <Link href={`/du-an/${m.projectSlug}`} className="text-xs font-medium text-muted-foreground hover:underline">
          {nameBySlug.get(m.projectSlug) ?? m.projectSlug}
        </Link>
      )}
      <p className="text-sm">{m.label}</p>
    </div>
  );
}
