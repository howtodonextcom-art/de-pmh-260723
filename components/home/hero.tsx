"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { buttonVariants } from "@/components/ui/button";
import { heroTextCascade, kenBurns } from "@/lib/motion/presets";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import type { V0ImageAsset } from "@/lib/library-bridge";

/**
 * Variant A (A/B winner 2026-08-12) — full-bleed cinematic hero.
 * Image is the edge-to-edge plane; copy sits in a safe column with scrim.
 * No inset media card, no hero badges/stats.
 */
export function Hero({
  brandStatementVi,
  heroAsset,
}: {
  brandStatementVi: string;
  heroAsset?: V0ImageAsset | null;
}) {
  const reduceMotion = useReducedMotion();
  const { t, messages } = useLocale();
  const words = messages.home.titleWords;
  const imageUrl = heroAsset ? (heroAsset.resolvedUrl ?? heroAsset.sourceFileUrl) : null;

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
