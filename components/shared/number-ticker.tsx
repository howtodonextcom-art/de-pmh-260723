"use client";

import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

/** Counts up once inView, ~1.2s (SPEC motion catalogue). */
export function NumberTicker({
  value,
  className,
  formatter = (n) => Math.round(n).toLocaleString("vi-VN"),
}: {
  value: number;
  className?: string;
  formatter?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1200, bounce: 0 });
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = formatter(latest);
    });
  }, [springValue, formatter]);

  if (reduceMotion) {
    return (
      <span className={className} suppressHydrationWarning>
        {formatter(value)}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
