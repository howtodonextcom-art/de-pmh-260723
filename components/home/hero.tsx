"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { buttonVariants } from "@/components/ui/button";
import { heroTextCascade, kenBurns } from "@/lib/motion/presets";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import type { V0ImageAsset } from "@/lib/library-bridge";
import { PROJECT_STATUS_LABEL } from "@library/components/layout/project-status-label";
import type { Project as FullProject } from "@library/types/project";

type HomeHeroProps = {
  variant?: "home";
  heroAsset?: V0ImageAsset | null;
  brandStatementVi: string;
};

type DetailHeroProps = {
  variant: "detail";
  heroAsset?: V0ImageAsset | null;
  project: FullProject;
};

export type HeroProps = HomeHeroProps | DetailHeroProps;

/**
 * HeroBlock — unified hero for both the home page and project detail page (DD audit F12).
 *
 * variant="home" (default) — Variant A (A/B winner 2026-08-12), full-bleed cinematic hero.
 * Image is the edge-to-edge plane; copy sits in a safe column with scrim.
 * No inset media card, no hero badges/stats.
 *
 * variant="detail" — D1, ~60vh hero with status/region badges; falls back to a brand
 * gradient when no hero image exists.
 */
export function Hero(props: HeroProps) {
  const { heroAsset } = props;
  const variant = props.variant ?? "home";
  const reduceMotion = useReducedMotion();
  const { t, messages } = useLocale();
  const imageUrl = heroAsset ? (heroAsset.resolvedUrl ?? heroAsset.sourceFileUrl) : null;

  if (variant === "detail") {
    const { project } = props as DetailHeroProps;
    const firstSentence = project.shortDescriptionVi?.split(". ")[0]
      ? `${project.shortDescriptionVi.split(". ")[0]}.`
      : null;

    return (
      <section className="relative flex h-[60vh] min-h-96 items-end overflow-hidden">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={heroAsset?.alt ?? project.displayNameVi}
            fill
            unoptimized
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 text-white sm:px-6">
          <div className="mb-3 flex gap-2">
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
              {PROJECT_STATUS_LABEL[project.status] ?? project.status}
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
              {project.region}
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-5xl">{project.displayNameVi}</h1>
          {firstSentence && (
            <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">{firstSentence}</p>
          )}
        </div>
      </section>
    );
  }

  const { brandStatementVi } = props as HomeHeroProps;
  const words = messages.home.titleWords;

  return (
    <section className="relative flex min-h-[calc(100dvh-60px)] items-end overflow-hidden sm:items-center">
      {/* Full-bleed visual plane */}
      <div className="absolute inset-0 bg-muted" aria-hidden={!imageUrl}>
        {imageUrl ? (
          <motion.div
            className="absolute inset-0"
            variants={reduceMotion ? undefined : kenBurns}
            animate={reduceMotion ? undefined : "animate"}
          >
            <ImageWithFallback
              src={imageUrl}
              alt=""
              fill
              unoptimized
              sizes="100vw"
              priority
              className="object-cover object-center"
            />
          </motion.div>
        ) : null}
        {/* Readable scrim — teal-ink wash, not purple glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/25 dark:from-background/95 dark:via-background/75 dark:to-background/35"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20 sm:hidden"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
        <div className="max-w-xl space-y-6 md:max-w-2xl">
          <motion.p
            initial={reduceMotion ? undefined : "hidden"}
            animate="show"
            variants={heroTextCascade}
            className="text-sm font-semibold tracking-wide text-primary uppercase"
          >
            {t("home.kicker")}
          </motion.p>
          <h1 className="flex flex-wrap gap-x-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {words.map((w, i) => (
              <motion.span
                key={w + i}
                custom={i}
                initial={reduceMotion ? undefined : "hidden"}
                animate="show"
                variants={heroTextCascade}
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={reduceMotion ? undefined : "hidden"}
            animate="show"
            custom={words.length + 1}
            variants={heroTextCascade}
            className="max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            {brandStatementVi}
          </motion.p>
          <motion.div
            initial={reduceMotion ? undefined : "hidden"}
            animate="show"
            custom={words.length + 2}
            variants={heroTextCascade}
            className="flex flex-wrap gap-3"
          >
            <Link href="/du-an" className={cn(buttonVariants({ size: "lg" }))}>
              {t("home.ctaExplore")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Alias matching the DD audit's `HeroBlock variant=` naming. */
export const HeroBlock = Hero;
