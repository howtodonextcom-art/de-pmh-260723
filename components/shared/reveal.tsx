"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { revealUp, viewportOnce } from "@/lib/motion/presets";

/**
 * Scroll-reveal wrapper for home sections that are Server Components — lets
 * them opt into the same `revealUp`/`viewportOnce` catalogue as other home sections.
 * without converting the whole section to a Client Component.
 *
 * `blur` swaps in the blur+fade treatment (SPEC H4, ex-`BlurFade`) used for card
 * imagery, with an optional stagger `delay`.
 */
export function Reveal({
  children,
  className,
  blur = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  blur?: boolean;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (blur) {
    return (
      <motion.div
        initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={revealUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}
