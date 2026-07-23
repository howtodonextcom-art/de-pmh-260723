"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { revealUp, viewportOnce } from "@/lib/motion/presets";

/**
 * Scroll-reveal wrapper for home sections that are Server Components — lets
 * them opt into the same `revealUp`/`viewportOnce` catalogue as StatStrip
 * without converting the whole section to a Client Component.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
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
