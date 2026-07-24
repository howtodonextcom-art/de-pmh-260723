"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * R4 (commercial audit Wave-2) — minimal route-transition craft. `template.tsx`
 * remounts on every navigation (unlike `layout.tsx`), so this re-triggers a
 * short fade on route change. Opacity-only on purpose: a `transform` (e.g. a
 * `y` offset) on this wrapper would create a new CSS containing block for
 * every `position: fixed`/`sticky` descendant — breaking the sticky header,
 * the gallery lightbox (`fixed inset-0`), and CMDK/dialog overlays. Opacity
 * doesn't have that side effect, so it's the safe choice here.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
