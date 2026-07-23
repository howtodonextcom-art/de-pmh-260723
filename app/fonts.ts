import { Fraunces, Inter } from "next/font/google";

/** Body — loaded for real this time (globals.css previously only *named* 'Inter' in the font stack without an actual next/font source, so it silently fell back to system-ui for most visitors). */
export const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

/** Display — H1 + major section headings only. Fraunces has full Vietnamese diacritic coverage (verified via build), an optical-size axis for elegant large sizes, and reads as editorial/premium rather than default-SaaS — the one expressive family added per the score-lift audit (02 Typography). Body copy stays on Inter. */
export const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display-heading",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal"],
});
