"use client";

import React, { useEffect } from "react";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { t } from "@/lib/i18n/t";
import type { FlipbookAsset } from "@/lib/flipbook/types";

interface ThumbnailGridProps {
  assets: readonly FlipbookAsset[];
  currentPageIdx: number;
  onSelectPage: (idx: number) => void;
  onClose: () => void;
}

/** Full-screen thumbnail overlay — Issuu-style grid for quick page jump. */
export function ThumbnailGrid({
  assets,
  currentPageIdx,
  onSelectPage,
  onClose,
}: ThumbnailGridProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 overflow-auto"
      style={{
        backgroundColor: "rgba(17, 17, 17, 0.96)",
        backdropFilter: "blur(8px)",
        animation: "gridFadeIn 200ms ease-out",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("flipbook.allPages")}
    >
      <div
        className="mx-auto max-w-5xl px-6 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-[13px] font-medium tracking-[2px] text-[#ededed] uppercase">
            {t("flipbook.allPages")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 p-2 text-2xl leading-none text-[#ededed]/60 transition-colors duration-150 hover:text-white"
            aria-label={t("flipbook.closeThumbnails")}
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {assets.map((asset, idx) => {
            const isActive = idx === currentPageIdx;

            return (
              <button
                key={asset.id}
                type="button"
                className={`group relative overflow-hidden rounded-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#c5a46e] focus-visible:outline-none ${
                  isActive
                    ? "ring-2 ring-[#c5a46e] ring-offset-2 ring-offset-[#111]"
                    : "hover:ring-1 hover:ring-white/30 hover:ring-offset-1 hover:ring-offset-[#111]"
                }`}
                style={{ aspectRatio: "923 / 1176" }}
                onClick={() => onSelectPage(idx)}
                aria-label={`${t("flipbook.page")} ${idx + 1}: ${asset.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                <ImageWithFallback
                  src={asset.src}
                  alt={asset.label}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 33vw, 16vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pt-6 pb-1.5">
                  <span className="text-[10px] font-medium tracking-wide text-white/80 tabular-nums">
                    {idx + 1}
                  </span>
                </div>
                <div className="absolute inset-0 bg-white/0 transition-colors duration-150 group-hover:bg-white/5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
