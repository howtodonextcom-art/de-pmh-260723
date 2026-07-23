"use client";

import * as React from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";

import { t } from "@/lib/i18n/t";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CATEGORY_LABELS, type ImageAsset } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getImageUrl(asset: ImageAsset): string {
  return asset.resolvedUrl ?? asset.sourceFileUrl;
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

// ─── GalleryTile ──────────────────────────────────────────────────────────────

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
      layoutId={shouldReduceMotion ? undefined : asset.assetId}
      className={cn(
        "group relative block w-full overflow-hidden rounded-xl",
        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      transition={SPRING}
    >
      {/* Natural aspect ratio via padding-bottom trick — NO forced aspect-square */}
      <div className="relative w-full">
        <Image
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

      {/* Hover caption overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end rounded-xl",
          "bg-gradient-to-t from-black/60 via-transparent to-transparent",
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          "p-3"
        )}
        aria-hidden
      >
        <p className="line-clamp-2 text-xs leading-snug text-white">
          {asset.alt}
        </p>
        <p className="mt-0.5 text-[10px] text-white/70">
          {asset.isRender ? "Phối cảnh minh họa" : "Ảnh thực tế"}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  assets: ImageAsset[];
  initialIndex: number;
  onClose: () => void;
}

function Lightbox({ assets, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = React.useState(initialIndex);
  const [direction, setDirection] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  const current = assets[index];
  const total = assets.length;

  const prev = React.useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = React.useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  // Keyboard navigation
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Scroll-lock
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const url = current ? getImageUrl(current) : "";

  const variants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  if (!current) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t("detail.lightboxLabel")}
      className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        {/* Counter */}
        <span className="text-sm tabular-nums text-white/60">
          {index + 1} / {total}
        </span>

        {/* Badges */}
        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className="bg-white/10 text-white/80 hover:bg-white/10"
          >
            {current.isRender ? "Phối cảnh minh họa" : "Ảnh thực tế"}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-white/10 text-white/80 hover:bg-white/10"
          >
            {getCategoryLabel(current.category)}
          </Badge>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label={t("detail.closeImage")}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg",
            "text-white/60 transition-colors hover:bg-white/10 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          )}
        >
          <XIcon className="size-5" />
        </button>
      </div>

      {/* Main image area */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12">
        {/* Prev */}
        <button
          type="button"
          onClick={prev}
          aria-label={t("detail.prevImage")}
          className={cn(
            "absolute left-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl",
            "text-white/60 transition-colors hover:bg-white/10 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          )}
        >
          <ChevronLeftIcon className="size-6" />
        </button>

        {/* Image — shared-element morph from tile */}
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={current.assetId}
            layoutId={shouldReduceMotion ? undefined : current.assetId}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING}
            drag={shouldReduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_e, info) => {
              if (info.offset.x < -50) next();
              if (info.offset.x > 50) prev();
            }}
            className="flex max-h-full max-w-full items-center justify-center"
          >
            <Image
              src={url}
              alt={current.alt}
              width={1600}
              height={1067}
              unoptimized
              sizes="100vw"
              priority
              className="max-h-[65vh] w-auto rounded-xl object-contain"
              style={{ userSelect: "none" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next */}
        <button
          type="button"
          onClick={next}
          aria-label={t("detail.nextImage")}
          className={cn(
            "absolute right-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl",
            "text-white/60 transition-colors hover:bg-white/10 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          )}
        >
          <ChevronRightIcon className="size-6" />
        </button>
      </div>

      {/* Caption */}
      <div className="shrink-0 px-4 py-2 text-center">
        <p className="text-sm text-white/80">{current.alt}</p>
        {current.sourcePageUrl && (
          <a
            href={current.sourcePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-white/40 transition-colors hover:text-white/60"
          >
            <ExternalLinkIcon className="size-3" />
            Nguồn
          </a>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="shrink-0 overflow-x-auto px-4 pb-4 pt-2">
        <div className="flex gap-2">
          {assets.map((asset, i) => (
            <button
              key={asset.assetId}
              type="button"
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Chuyển tới ảnh ${i + 1}: ${asset.alt}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                i === index
                  ? "ring-2 ring-white opacity-100"
                  : "opacity-40 hover:opacity-70"
              )}
            >
              <Image
                src={getImageUrl(asset)}
                alt={asset.alt}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── DetailGallery ────────────────────────────────────────────────────────────

interface DetailGalleryProps {
  assets: ImageAsset[];
  className?: string;
}

export function DetailGallery({ assets, className }: DetailGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState("all");

  // Product rule: show nothing if fewer than 4 verified assets
  const verified = React.useMemo(
    () => (assets ?? []).filter((a) => a.verified === true),
    [assets]
  );

  // Unique categories present in verified assets
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
    [verified, activeTab]
  );

  if (verified.length < 4) return null;

  return (
    <section id="gallery" aria-label={t("detail.gallery")} className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6", className)}>
      {/* Category tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList
          variant="line"
          className="h-auto flex-wrap gap-1"
        >
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {getCategoryLabel(cat)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All content in one panel to avoid duplicate rendering */}
        <TabsContent value={activeTab} className="mt-4 focus-visible:ring-0">
          {/* Responsive masonry-style grid — 2 cols on mobile, 3 on md+ */}
          <div className="columns-2 gap-3 md:columns-3">
            {visible.map((asset, i) => (
              <div key={asset.assetId} className="mb-3 break-inside-avoid">
                <GalleryTile
                  asset={asset}
                  onClick={() => setLightboxIndex(i)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            assets={visible}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
