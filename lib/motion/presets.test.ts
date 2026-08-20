import { describe, expect, it } from "vitest";

import {
  EASE_REVEAL,
  heroTextCascade,
  kenBurns,
  revealUp,
  viewportOnce,
} from "@/lib/motion/presets";

describe("motion presets", () => {
  it("EASE_REVEAL is a 4-number cubic-bezier tuple", () => {
    expect(EASE_REVEAL).toHaveLength(4);
    (EASE_REVEAL as unknown as number[]).forEach((n) => expect(typeof n).toBe("number"));
  });

  it("revealUp has hidden/show variants with opacity + y", () => {
    expect(revealUp).toHaveProperty("hidden");
    expect(revealUp).toHaveProperty("show");
    expect(revealUp.hidden).toMatchObject({ opacity: 0, y: 24 });
    const show = revealUp.show as Record<string, unknown>;
    expect(show).toMatchObject({ opacity: 1, y: 0 });
    expect(show.transition).toBeTruthy();
  });

  it("heroTextCascade has hidden/show variants and show is a function (per-index delay)", () => {
    expect(heroTextCascade).toHaveProperty("hidden");
    expect(heroTextCascade).toHaveProperty("show");
    expect(typeof heroTextCascade.show).toBe("function");
    const showFn = heroTextCascade.show as (i?: number) => Record<string, unknown>;
    const result = showFn(2);
    expect(result).toMatchObject({ opacity: 1, y: 0 });
    expect(result.transition).toMatchObject({ delay: 2 * 0.04 });
  });

  it("kenBurns has an animate variant with a scale keyframe array", () => {
    expect(kenBurns).toHaveProperty("animate");
    const animate = kenBurns.animate as Record<string, unknown>;
    expect(Array.isArray(animate.scale)).toBe(true);
    expect(animate.transition).toMatchObject({ repeat: Infinity });
  });

  it("viewportOnce is a frozen-shape viewport config", () => {
    expect(viewportOnce).toMatchObject({ once: true, margin: "-80px" });
  });
});
