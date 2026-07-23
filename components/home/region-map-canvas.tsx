"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { t } from "@/lib/i18n/t";
import { addRegionEmphasisLayers, addRegionMarkers, createMap } from "@/lib/map-shell";
import type { RegionPin } from "@/lib/map-shell";

export type { RegionPin } from "@/lib/map-shell";

const GEO_URL = "/geo/portfolio-regions.geojson";

export function RegionMapCanvas({
  regions,
  onSelectRegion,
}: {
  regions: RegionPin[];
  onSelectRegion: (query: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current) return;
    if (regions.length === 0) return;

    let map: maplibregl.Map;
    try {
      map = createMap({ container: containerRef.current, regions });
    } catch {
      // Defer past the synchronous effect body (React discourages setState
      // called directly inline in an effect) — this only fires if the Map
      // constructor itself throws (e.g. no WebGL context).
      queueMicrotask(() => setStatus("error"));
      return;
    }
    mapRef.current = map;

    map.on("load", () => {
      try {
        addRegionEmphasisLayers(map, regions, { geoJsonUrl: GEO_URL });
      } catch {
        // Overlay failure must not kill the basemap + markers.
      }
      setStatus("ready");
      // Layout height settles after paint — keep WebGL buffer in sync.
      requestAnimationFrame(() => map.resize());
    });
    map.on("error", () => setStatus("error"));

    const markers = addRegionMarkers(map, regions, {
      onSelect: onSelectRegion,
      unitLabel: t("home.mapUnit"),
    });

    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      for (const m of markers) m.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions]);

  return (
    <div
      data-testid="region-map-stage"
      className="relative h-full min-h-[70vh] w-full overflow-hidden rounded-2xl border border-border md:min-h-[65vh]"
    >
      <div ref={containerRef} data-testid="region-map-canvas" className="absolute inset-0 h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-gradient-to-br from-muted via-primary/5 to-muted">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer-sweep" />
          {/* Decorative pin placeholders — evoke the 2 real markers about to appear. */}
          <span className="absolute left-[38%] top-[42%] size-3 animate-pulse rounded-full bg-primary/30" />
          <span className="absolute left-[62%] top-[58%] size-3 animate-pulse rounded-full bg-primary/30 [animation-delay:0.4s]" />
          <span className="sr-only">{t("home.mapLoading")}</span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted p-4 text-center text-sm text-muted-foreground">
          {t("home.mapWebglFallback")}
        </div>
      )}
    </div>
  );
}
