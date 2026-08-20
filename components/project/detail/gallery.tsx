"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { ProjectFlipbookViewer } from "@/components/project/detail/project-flipbook-viewer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getImageUrl } from "@/lib/flipbook/image-asset-adapter";
import { t } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type ImageAsset } from "@/lib/types";

const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

interface GalleryTileProps {
  asset: ImageAsset;
  onClick: () => void;
}

function GalleryTile({ asset, onClick }: GalleryTileProps) {
  const shouldReduceMotion = useReducedMotion();
  const url = getImageUrl(asset);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Mở ảnh: ${asset.alt}`}
      className={cn(
        "group relative block w-full cursor-pointer overflow-hidden rounded-xl",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      )}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      transition={SPRING}
    >
      <div className="relative w-full">
        <ImageWithFallback
          src={url}
          alt={asset.alt}
          width={800}
          height={600}
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full rounded-xl object-cover transition-opacity duration-200 group-hover:opacity-95"
          style={{ display: "block" }}
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end rounded-xl",
          "bg-gradient-to-t from-black/60 via-transparent to-transparent",
          "p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
        )}
        aria-hidden
      >
        <p className="line-clamp-2 text-xs leading-snug text-white">{asset.alt}</p>
        <p className="mt-0.5 text-[10px] text-white/70">
          {asset.isRender ? "Phối cảnh minh họa" : "Ảnh thực tế"}
        </p>
      </div>
    </motion.button>
  );
}

interface DetailGalleryProps {
  assets: ImageAsset[];
  className?: string;
}

const GALLERY_CHUNK = 12;

export function DetailGallery({ assets, className }: DetailGalleryProps) {
  const [viewerIndex, setViewerIndex] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState("all");
  const [visibleByTab, setVisibleByTab] = React.useState<Record<string, number>>({});

  const visibleCount = visibleByTab[activeTab] ?? GALLERY_CHUNK;

  const verified = React.useMemo(
    () => (assets ?? []).filter((a) => a.verified === true),
    [assets],
  );

  const categories = React.useMemo(() => {
    const seen = new Set<string>();
    for (const a of verified) {
      if (!seen.has(a.category)) seen.add(a.category);
    }
    return Array.from(seen);
  }, [verified]);

  const visible = React.useMemo(
    () =>
      activeTab === "all"
        ? verified
        : verified.filter((a) => a.category === activeTab),
    [verified, activeTab],
  );

  if (verified.length < 4) return null;

  const shown = visible.slice(0, visibleCount);
  const remaining = visible.length - shown.length;

  return (
    <section
      id="gallery"
      aria-label={t("detail.gallery")}
      className={cn("mx-auto max-w-7xl px-4 py-16 sm:px-6", className)}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList
          variant="line"
          className="h-auto max-w-full flex-nowrap gap-1 overflow-x-auto no-scrollbar tabs-scroll-fade sm:flex-wrap sm:overflow-visible"
        >
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {getCategoryLabel(cat)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 focus-visible:ring-0">
          <div className="columns-2 gap-3 md:columns-3">
            {shown.map((asset, i) => (
              <div key={asset.assetId} className="mb-3 break-inside-avoid">
                <GalleryTile asset={asset} onClick={() => setViewerIndex(i)} />
              </div>
            ))}
          </div>

          {remaining > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleByTab((prev) => ({
                    ...prev,
                    [activeTab]: (prev[activeTab] ?? GALLERY_CHUNK) + GALLERY_CHUNK,
                  }))
                }
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Xem thêm ({remaining} ảnh)
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {viewerIndex !== null && (
        <ProjectFlipbookViewer
          assets={visible}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </section>
  );
}
