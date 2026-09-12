"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * W7 (commercial audit Phase-1) — project images are 100% hotlinked from
 * `honghacphumyhung.vn`, a third party with no contractual obligation to
 * keep those URLs alive. This does NOT self-host anything (that's Wave-2);
 * it just swaps a broken hotlink for an honest local placeholder instead of
 * a browser broken-image icon, on the two highest-visibility surfaces
 * (detail hero + gallery).
 */
export function ImageWithFallback({ className, alt, fill, width, height, ...props }: ImageProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "failed">("loading");

  if (status === "failed") {
    return (
      <div
        role="img"
        aria-label={alt}
        style={!fill && width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-muted via-primary/10 to-muted text-muted-foreground",
          fill && "absolute inset-0",
          className,
        )}
      >
        <ImageOffIcon className="size-5 opacity-50" aria-hidden />
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <div
          aria-hidden
          style={!fill && width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
          className={cn("animate-skeleton", fill ? "absolute inset-0" : "block w-full", className)}
        />
      )}
      <Image
        alt={alt}
        // Defaults go first so a caller's own transition/duration (e.g. a
        // slower hover-zoom) wins the tailwind-merge conflict instead of
        // silently losing to this component's fade-in — `transition-opacity`
        // and `transition-transform` share one merge group, so whichever
        // side loses gets NO transition at all, not just a shorter one.
        // `scale` (not `transform`) is listed because Tailwind v4's
        // `scale-*`/`group-hover:scale-*` utilities set the standalone CSS
        // `scale` property (CSS Transforms Level 2), which `transform`
        // alone does not cover.
        className={cn(
          "transition-[opacity,scale] duration-300",
          className,
          status === "loaded" ? "opacity-100" : "opacity-0",
        )}
        fill={fill}
        width={width}
        height={height}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("failed")}
        {...props}
      />
    </>
  );
}
