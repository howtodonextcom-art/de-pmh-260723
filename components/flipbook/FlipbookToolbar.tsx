"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n/t";

interface FlipbookToolbarProps {
  currentPage: number;
  totalPages: number;
  pageLabel?: string;
  className?: string;
  fullscreenTargetRef?: React.RefObject<HTMLElement | null>;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onSetZoom?: (zoom: number) => void;
  zoomLevel?: number;
  onGoToSpread?: (spreadIdx: number) => void;
  onToggleGrid?: () => void;
  variant?: "gallery" | "magazine";
}

function ToolbarIconButton({
  onClick,
  disabled,
  ariaLabel,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "group flex h-9 w-9 items-center justify-center rounded-[3px]",
        "text-[#ededed] transition-all duration-150",
        "hover:bg-[#2a2a2a] hover:text-white",
        "active:scale-[0.985] active:bg-[#1f1f1f]",
        "focus-visible:ring-1 focus-visible:ring-[#c5a46e]/60 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

function IconZoomOut() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
    </svg>
  );
}

function IconZoomIn() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function IconFullscreenEnter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  );
}

function IconFullscreenExit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 9L4.5 4.5M4.5 4.5v4.5m0-4.5h4.5M9 15l-4.5 4.5M4.5 19.5h4.5m0 0v-4.5m10.5-1.5l4.5 4.5m0 0v-4.5m0 4.5h-4.5M15 9l4.5-4.5m0 0v4.5m0-4.5h-4.5" />
    </svg>
  );
}

export function FlipbookToolbar({
  currentPage,
  totalPages,
  pageLabel,
  className,
  fullscreenTargetRef,
  onZoomIn,
  onZoomOut,
  onSetZoom,
  zoomLevel = 1,
  onGoToSpread,
  onToggleGrid,
  variant = "gallery",
}: FlipbookToolbarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    const target = fullscreenTargetRef?.current || document.documentElement;

    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  }, [fullscreenTargetRef]);

  const handleSliderMouseDown = useCallback(
    (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
      const track = mouseDownEvent.currentTarget;
      const updateZoom = (clientX: number) => {
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        onSetZoom?.(1 + ratio * 2);
      };

      updateZoom(mouseDownEvent.clientX);

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        updateZoom(mouseMoveEvent.clientX);
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onSetZoom],
  );

  const handleSliderTouchStart = useCallback(
    (touchStartEvent: React.TouchEvent<HTMLDivElement>) => {
      const track = touchStartEvent.currentTarget;
      const updateZoom = (clientX: number) => {
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        onSetZoom?.(1 + ratio * 2);
      };

      if (touchStartEvent.touches[0]) {
        updateZoom(touchStartEvent.touches[0].clientX);
      }

      const handleTouchMove = (touchMoveEvent: TouchEvent) => {
        if (touchMoveEvent.touches[0]) {
          updateZoom(touchMoveEvent.touches[0].clientX);
        }
      };

      const handleTouchEnd = () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    },
    [onSetZoom],
  );

  return (
    <div
      role="toolbar"
      aria-label={t("flipbook.controls")}
      className={cn(
        "z-30 flex h-16 w-full items-center justify-between px-5 text-[#ededed] select-none",
        !className?.includes("bg-transparent") &&
          "border-t border-[var(--border-toolbar)] bg-[var(--bg-reader-toolbar)] backdrop-blur-md",
        className,
      )}
    >
      <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
        <div
          className="text-[12px] leading-none font-medium tracking-[1.5px] whitespace-nowrap text-[#ededed]/95 tabular-nums"
          aria-live="polite"
        >
          {pageLabel || `${currentPage} / ${totalPages}`}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center px-4">
        <div
          className="relative h-[3px] w-full cursor-pointer overflow-visible rounded-full bg-[#3a3a3a]"
          title={pageLabel || `${t("flipbook.page")} ${currentPage} / ${totalPages}`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onGoToSpread?.(Math.round(ratio * (totalPages - 1)));
          }}
          role="progressbar"
          aria-valuenow={currentPage}
          aria-valuemin={1}
          aria-valuemax={totalPages}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#ededed]/60 transition-[width] duration-300"
            style={{ width: `${((currentPage - 1) / Math.max(totalPages - 1, 1)) * 100}%` }}
          />
          <div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ededed] shadow-sm transition-[left] duration-300"
            style={{ left: `${((currentPage - 1) / Math.max(totalPages - 1, 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <ToolbarIconButton onClick={onToggleGrid} ariaLabel={t("flipbook.thumbnailGrid")}>
          <IconGrid />
        </ToolbarIconButton>

        <div className="flex items-center gap-1">
          <ToolbarIconButton onClick={onZoomOut} ariaLabel={t("flipbook.zoomOut")}>
            <IconZoomOut />
          </ToolbarIconButton>
          <div
            className="group relative h-[3px] w-[80px] cursor-pointer rounded-full bg-[#3a3a3a]"
            onMouseDown={handleSliderMouseDown}
            onTouchStart={handleSliderTouchStart}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#ededed]/50 transition-[width] duration-150"
              style={{ width: `${((zoomLevel - 1) / 2) * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ededed] shadow-sm transition-[left] duration-150 group-hover:scale-125"
              style={{ left: `${((zoomLevel - 1) / 2) * 100}%` }}
            />
          </div>
          <ToolbarIconButton onClick={onZoomIn} ariaLabel={t("flipbook.zoomIn")}>
            <IconZoomIn />
          </ToolbarIconButton>
        </div>

        {variant !== "gallery" && <div className="h-4 w-px bg-[#2a2a2a]" aria-hidden="true" />}

        <ToolbarIconButton
          onClick={handleFullscreenToggle}
          ariaLabel={isFullscreen ? t("flipbook.exitFullscreen") : t("flipbook.enterFullscreen")}
        >
          {isFullscreen ? <IconFullscreenExit /> : <IconFullscreenEnter />}
        </ToolbarIconButton>
      </div>
    </div>
  );
}
