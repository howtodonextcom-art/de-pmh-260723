import type { Transition, Variants } from "framer-motion";

/** Motion catalogue — SPEC_DED_PMH_V2.md §3.6. All `once: true`; reduced-motion callers must swap to *Reduced variants. */

export const EASE_REVEAL: Transition["ease"] = [0.21, 0.47, 0.32, 0.98];

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_REVEAL } },
};

export const revealUpReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.1, staggerChildren: 0.08 },
  },
};

export const staggerChildrenReduced: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0 } },
};

export const heroTextCascade: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: EASE_REVEAL },
  }),
};

export const kenBurns: Variants = {
  animate: {
    scale: [1, 1.06, 1],
    transition: { duration: 20, repeat: Infinity, repeatType: "mirror", ease: "linear" },
  },
};

export const cardHover = {
  whileHover: { scale: 1.0 },
  transition: { duration: 0.4 },
};

export const imageZoomHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.4 } },
};

export const press = {
  whileTap: { scale: 0.98 },
};

export const badgeStaggerScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE_REVEAL } },
};

export const viewportOnce = { once: true, margin: "-80px" } as const;

export const springLightbox: Transition = { type: "spring", stiffness: 260, damping: 26 };
