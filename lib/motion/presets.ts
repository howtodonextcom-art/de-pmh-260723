import type { Transition, Variants } from "framer-motion";

/** Motion catalogue — SPEC_DED_PMH_V2.md §3.6. All `once: true`; reduced-motion callers must swap variants locally. */

export const EASE_REVEAL: Transition["ease"] = [0.21, 0.47, 0.32, 0.98];

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_REVEAL } },
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

export const viewportOnce = { once: true, margin: "-80px" } as const;
