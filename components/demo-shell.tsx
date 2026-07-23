"use client";

import * as React from "react";
import Image from "next/image";
import {
  MapPinIcon,
  CircleDotIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { SiteHeader } from "@/components/shared/site-header";
import { LegalDossierTable, LegalTimeline } from "@/components/project/legal-dossier-table";
import { DetailGallery } from "@/components/project/detail/gallery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n/t";

import type { HeaderProject, Project, ImageAsset } from "@/lib/types";
import type { V0ImageAsset } from "@/lib/library-bridge";

interface DemoShellProps {
  headerProjects: HeaderProject[];
  projects: Project[];
  assets: ImageAsset[];
  thumbBySlug?: Record<string, V0ImageAsset | null>;
}

// ─── HeroBand ─────────────────────────────────────────────────────────────────

interface HeroBandProps {
  slug: string;
  assets: ImageAsset[];
}

function HeroBand({ slug, assets }: HeroBandProps) {
  const shouldReduceMotion = useReducedMotion();

  const heroAsset = React.useMemo(() => {
    const verified = assets.filter((a) => a.verified);
    return (
      verified.find((a) => a.category === "hero") ?? verified[0] ?? null
    );
  }, [assets]);

  const url = heroAsset
    ? (heroAsset.resolvedUrl ?? heroAsset.sourceFileUrl)
    : null;

  if (!url) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(240px, 46vh, 520px)" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slug}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
        >
          <Image
            src={url}
            alt={heroAsset?.alt ?? "Hero image"}
            fill
            unoptimized
            sizes="100vw"
            priority
            className="object-cover"
          />
          {/* Bottom gradient for legibility — no floating chips */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── DemoShell ────────────────────────────────────────────────────────────────

export function DemoShell({ headerProjects, projects, assets, thumbBySlug }: DemoShellProps) {
  // P0-1: default slug = hong-hac-city (first in array)
  const [selectedSlug, setSelectedSlug] = React.useState<string>("hong-hac-city");

  const selectedProject = React.useMemo(
    () => projects.find((p) => p.slug === selectedSlug) ?? null,
    [projects, selectedSlug]
  );

  // Assets for the active project, verified only
  const projectAssets = React.useMemo(
    () => assets.filter((a) => a.projectSlug === selectedSlug && a.verified),
    [assets, selectedSlug]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">

      <SiteHeader headerProjects={headerProjects} thumbBySlug={thumbBySlug} />

      {/* ── P0-4: Hero band ────────────────────────────────────────────── */}
      <HeroBand slug={selectedSlug} assets={assets.filter((a) => a.projectSlug === selectedSlug)} />

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8">

        {/* ── Project meta row ─────────────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-balance font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {selectedProject?.displayNameVi ?? "—"}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {selectedProject?.region && (
                <span className="flex items-center gap-1">
                  <MapPinIcon className="size-3.5 shrink-0" />
                  {selectedProject.region}
                </span>
              )}
              {selectedProject?.status && (
                <span className="flex items-center gap-1">
                  <CircleDotIcon className="size-3.5 shrink-0" />
                  {selectedProject.status}
                </span>
              )}
            </div>
          </div>

          {/* P0-3: shadcn/Radix Select — no native <select> */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">{t("lab.selectProject")}</span>
            <Select value={selectedSlug} onValueChange={(v) => { if (v) setSelectedSlug(v); }}>
              <SelectTrigger
                className={cn(
                  "h-9 min-w-[180px] rounded-[0.75rem] border border-border bg-background px-3",
                  "text-sm text-foreground shadow-none",
                  "transition-colors hover:border-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
              >
                <SelectValue>
                  {projects.find((p) => p.slug === selectedSlug)?.displayNameVi ?? selectedSlug}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.displayNameVi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Legal section ────────────────────────────────────────────── */}
        {selectedProject && (
          <section aria-labelledby="legal-heading" className="mb-12">
            <h2
              id="legal-heading"
              className="mb-4 text-base font-medium text-foreground"
            >
              {t("lab.legalHeading")}
            </h2>
            <Tabs defaultValue="table">
              <TabsList variant="line">
                <TabsTrigger value="table">{t("lab.tabTable")}</TabsTrigger>
                <TabsTrigger value="timeline">{t("lab.tabTimeline")}</TabsTrigger>
              </TabsList>
              <TabsContent value="table" className="mt-5">
                <LegalDossierTable project={selectedProject} />
              </TabsContent>
              <TabsContent value="timeline" className="mt-5">
                <LegalTimeline project={selectedProject} />
              </TabsContent>
            </Tabs>
          </section>
        )}

        {/* ── Gallery section ───────────────────────────────────────────── */}
        <section aria-labelledby="gallery-heading">
          <h2
            id="gallery-heading"
            className="mb-4 text-base font-medium text-foreground"
          >
            {t("lab.galleryHeading")}
          </h2>
          {projectAssets.length >= 4 ? (
            <DetailGallery assets={projectAssets} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("lab.noVerifiedGallery")}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
