"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { heroTextCascade, kenBurns } from "@/lib/motion/presets";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import type { V0ImageAsset } from "@/lib/library-bridge";

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
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-12 md:items-center md:py-24">
        <div className="order-2 space-y-6 md:order-1 md:col-span-7">
          <motion.p
            initial={reduceMotion ? undefined : "hidden"}
            animate="show"
            variants={heroTextCascade}
            className="text-sm font-semibold tracking-wide text-primary uppercase"
          >
            {t("home.kicker")}
          </motion.p>
          <h1 className="flex flex-wrap gap-x-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
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
            className="max-w-xl text-lg text-muted-foreground"
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

        <div className="relative order-1 md:order-2 md:col-span-5">
          {/* Soft halo behind the hero image — extends the atmosphere wash
              into a full-bleed feel around the frame instead of a hard-edged
              card floating on flat background. Teal only, no glow cliché. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-2xl dark:bg-primary/15"
          />
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="aspect-4/5 overflow-hidden rounded-2xl bg-muted md:aspect-3/2"
          >
            {imageUrl ? (
              <motion.div
                variants={reduceMotion ? undefined : kenBurns}
                animate={reduceMotion ? undefined : "animate"}
                className="relative h-full w-full"
              >
                <Image
                  src={imageUrl}
                  alt={heroAsset?.alt ?? "DED-PMH"}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  className="object-cover"
                />
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
