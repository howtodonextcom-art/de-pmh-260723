"use client";

import * as React from "react";
import { XIcon } from "lucide-react";

import { FlipbookContainer } from "@/components/flipbook/FlipbookContainer";
import { FlipbookEngine } from "@/components/flipbook/FlipbookEngine";
import { toFlipbookAssets } from "@/lib/flipbook/image-asset-adapter";
import { t } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/lib/types";

export interface ProjectFlipbookViewerProps {
  assets: ImageAsset[];
  initialIndex: number;
  onClose: () => void;
  className?: string;
}

/** Fullscreen modal flipbook viewer — replaces legacy Framer Lightbox. */
export function ProjectFlipbookViewer({
  assets,
  initialIndex,
  onClose,
  className,
}: ProjectFlipbookViewerProps) {
  const flipbookAssets = React.useMemo(() => toFlipbookAssets(assets), [assets]);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (flipbookAssets.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("detail.lightboxLabel")}
      className={cn("fixed inset-0 z-50 flex flex-col bg-[#111111]", className)}
    >
      <div className="absolute top-3 right-3 z-[60]">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label={t("detail.closeImage")}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg",
            "text-white/70 transition-colors hover:bg-white/10 hover:text-white",
            "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
          )}
        >
          <XIcon className="size-5" />
        </button>
      </div>

      <FlipbookContainer className="min-h-0 flex-1">
        <FlipbookEngine
          assets={flipbookAssets}
          initialIndex={initialIndex}
          onClose={onClose}
          className="h-full w-full"
        />
      </FlipbookContainer>
    </div>
  );
}
