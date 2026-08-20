"use client";

import { useReducedMotion } from "framer-motion";
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { FlipbookToolbar } from "./FlipbookToolbar";
import { ThumbnailGrid } from "./ThumbnailGrid";
import { PAGE_ASPECT_RATIO, type FlipbookAsset } from "@/lib/flipbook/types";
import { t } from "@/lib/i18n/t";

const STABLE_STYLE = {};

const SinglePage = React.forwardRef<
  HTMLDivElement,
  { asset: FlipbookAsset; number: number }
>(({ asset, number }, ref) => {
  const [failed, setFailed] = useState(false);
  const fitMode = asset.fitMode ?? "contain";
  const bg = asset.letterboxColor ?? "#f8f5f0";

  return (
    <div
      ref={ref}
      className="flipbook-page"
      data-page={number}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bg,
      }}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center text-xs text-[#888]">
          {asset.label}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.src}
          alt={asset.label}
          draggable={false}
          loading="eager"
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: fitMode,
            objectPosition: "center center",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,0.08) 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </div>
  );
});
SinglePage.displayName = "SinglePage";

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export interface FlipbookEngineProps {
  assets: FlipbookAsset[];
  initialIndex?: number;
  onClose?: () => void;
  className?: string;
}

export function FlipbookEngine({
  assets,
  initialIndex = 0,
  onClose,
  className,
}: FlipbookEngineProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void; flip: (page: number) => void } } | null>(null);

  // F06 — react-pageflip drives its own page-flip animation outside of
  // framer-motion (MotionConfig's `reducedMotion="user"` in app/layout.tsx
  // doesn't reach it), so honor the user's preference explicitly via its
  // `flippingTime` prop.
  const prefersReducedMotion = useReducedMotion();
  const flippingTime = prefersReducedMotion ? 1 : 520;

  const totalPages = assets.length;
  const safeInitial = Math.min(Math.max(initialIndex, 0), Math.max(totalPages - 1, 0));

  const [currentPage, setCurrentPage] = useState(safeInitial);
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 550, height: 700 });
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const SIDE_ZONE = isMobile ? 40 : 72;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    const calc = () => {
      if (!viewerRef.current) return;
      const rect = viewerRef.current.getBoundingClientRect();
      const mobile = rect.width < 768;
      setIsMobile(mobile);

      const sideZone = mobile ? 40 : 72;
      const stageW = rect.width - sideZone * 2;
      const stageH = rect.height - 64 - 40;

      const pageH = Math.min(stageH, stageW / (mobile ? 1 : 2) / PAGE_ASPECT_RATIO);
      const pageW = Math.round(pageH * PAGE_ASPECT_RATIO);
      const finalH = Math.round(pageH);

      setDimensions({ width: Math.max(pageW, 200), height: Math.max(finalH, 300) });
    };

    calc();
    window.addEventListener("resize", calc);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", calc);
    };
  }, []);

  const touchStartRef = useRef<{ dist: number; zoom: number } | null>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const getDistance = (t1: Touch, t2: Touch) =>
      Math.sqrt((t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2);

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && e.touches[0] && e.touches[1]) {
        touchStartRef.current = { dist: getDistance(e.touches[0], e.touches[1]), zoom: zoomLevel };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && e.touches[0] && e.touches[1] && touchStartRef.current) {
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        const factor = dist / touchStartRef.current.dist;
        setZoomLevel(Math.max(1, Math.min(3, touchStartRef.current.zoom * factor)));
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) touchStartRef.current = null;
    };

    viewer.addEventListener("touchstart", handleTouchStart, { passive: false });
    viewer.addEventListener("touchmove", handleTouchMove, { passive: false });
    viewer.addEventListener("touchend", handleTouchEnd);

    return () => {
      viewer.removeEventListener("touchstart", handleTouchStart);
      viewer.removeEventListener("touchmove", handleTouchMove);
      viewer.removeEventListener("touchend", handleTouchEnd);
    };
  }, [zoomLevel]);

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const goNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const goPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const goToPage = useCallback((pageIdx: number) => {
    bookRef.current?.pageFlip()?.flip(pageIdx);
  }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") {
        if (showGrid) setShowGrid(false);
        else onClose?.();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [goNext, goPrev, showGrid, onClose]);

  const handleZoomIn = useCallback(() => setZoomLevel((z) => Math.min(z + 0.25, 3)), []);
  const handleZoomOut = useCallback(() => setZoomLevel((z) => Math.max(z - 0.25, 1)), []);
  const handleSetZoom = useCallback((z: number) => setZoomLevel(Math.max(1, Math.min(3, z))), []);

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const getPageLabel = (): string => `${currentPage + 1} / ${totalPages}`;

  const bookPages = useMemo(
    () =>
      assets.map((asset, i) => (
        <SinglePage key={asset.id} asset={asset} number={i + 1} />
      )),
    [assets],
  );

  if (totalPages === 0) return null;

  return (
    <div
      ref={viewerRef}
      className={`relative h-full w-full overflow-hidden bg-[#1a1a1a] select-none ${className ?? ""}`}
      data-flipbook-viewer
    >
      <div className="absolute inset-x-0 top-0" style={{ bottom: "64px" }}>
        <div
          className="absolute flex items-center justify-center"
          style={{ top: "20px", bottom: "20px", left: `${SIDE_ZONE}px`, right: `${SIDE_ZONE}px` }}
        >
          <div
            className="flipbook-scaler"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: "transform 400ms cubic-bezier(0.23, 1, 0.32, 1)",
              willChange: "transform",
              transformStyle: "preserve-3d",
            }}
          >
            {isMounted && (
              <HTMLFlipBook
                key={isMobile ? "mobile" : "desktop"}
                ref={bookRef}
                width={dimensions.width}
                height={dimensions.height}
                size="fixed"
                minWidth={200}
                maxWidth={800}
                minHeight={300}
                maxHeight={1000}
                showCover={false}
                mobileScrollSupport
                onFlip={onFlip}
                className="flipbook-container"
                style={STABLE_STYLE}
                startPage={safeInitial}
                drawShadow
                flippingTime={flippingTime}
                usePortrait={isMobile}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.75}
                showPageCorners
                disableFlipByClick={false}
                swipeDistance={20}
                clickEventForward
                useMouseEvents
              >
                {bookPages}
              </HTMLFlipBook>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label={t("detail.prevImage")}
          className={`absolute top-0 bottom-0 left-0 z-40 flex items-center justify-center transition-opacity duration-200 ${
            !canGoPrev ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ width: SIDE_ZONE }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-lg transition-colors duration-150 hover:bg-white/25">
            <ChevronLeft />
          </div>
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label={t("detail.nextImage")}
          className={`absolute top-0 right-0 bottom-0 z-40 flex items-center justify-center transition-opacity duration-200 ${
            !canGoNext ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ width: SIDE_ZONE }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-lg transition-colors duration-150 hover:bg-white/25">
            <ChevronRight />
          </div>
        </button>
      </div>

      <div className="absolute right-0 bottom-16 left-0 z-30">
        <FlipbookToolbar
          currentPage={currentPage + 1}
          totalPages={totalPages}
          pageLabel={getPageLabel()}
          fullscreenTargetRef={viewerRef}
          onGoToSpread={goToPage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onSetZoom={handleSetZoom}
          zoomLevel={zoomLevel}
          onToggleGrid={() => setShowGrid((g) => !g)}
          variant="gallery"
        />
      </div>

      {showGrid && (
        <ThumbnailGrid
          assets={assets}
          currentPageIdx={currentPage}
          onSelectPage={(idx) => {
            goToPage(idx);
            setShowGrid(false);
          }}
          onClose={() => setShowGrid(false)}
        />
      )}
    </div>
  );
}
