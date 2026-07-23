# map-shell

Thin, dependency-light MapLibre GL wrapper used by the DED-PMH v2 home page
(`components/home/region-map-canvas.tsx`). It owns three things:

- `createMap(options)` — construct a `maplibregl.Map` with a sane default
  style (tokenless MapLibre demotiles), `fitBounds` to a set of pins, and the
  standard nav control.
- `addRegionMarkers(map, regions, options)` — one keyboard-accessible marker
  per region, wired to an `onSelect(query)` callback.
- `addRegionEmphasisLayers(map, regions, options)` — the pin "halo" plus an
  optional GeoJSON AOI fill/outline overlay.

## What this is (and isn't)

This is an **MVP extract**, not a port of the sa-ban interactive map. It
exists so the home page's map code isn't hand-rolled inline, and so a future
L2 effort has a real seam to build from. It intentionally does **not**
include:

- `SaBanInteractiveMap` or any tile-gatekeeper/auth logic
- The 397-lot GeoJSON inventory or any per-lot filter schema
- Marzipano / 360° panorama viewers

`RegionPin.query` is an opaque string the host app defines (currently a URL
query fragment like `"khu-vuc=bac-ninh"`) — map-shell never interprets it.
That keeps the package's filter surface at "region id + count", not a lot
inventory schema.

## The L2 story: how sa-ban could depend on this later

Today, `sa-ban` (`260530-bdskimquyen`) and `v0` (`260719-de-pmh`) are separate
repos with separate map stacks. If/when sa-ban wants a MapLibre base layer
(instead of, or alongside, its current lot-level tooling), the intended path
is:

1. Publish `map-shell` as its own versioned package (npm private registry,
   or a git-dependency reference) rather than a path import — it has zero
   dependency on anything else in `v0/`, only `maplibre-gl` as a peer dep.
2. sa-ban imports `createMap` + the marker/emphasis helpers for its
   *portfolio-level* overview map (the "which region/project" zoom level),
   keeping its existing per-lot interactive map (tile-gatekeeper, 397-lot
   GeoJSON, Marzipano panoramas) entirely separate and untouched.
3. Any lot-filter-specific types sa-ban needs stay in sa-ban's own codebase —
   `map-shell`'s `RegionPin`/`CreateMapOptions` types are deliberately generic
   (region id, count, lng/lat, opaque query) so they don't need to know about
   lot status enums, pricing tiers, or sa-ban's auth model.
4. This is a **package dependency**, not a repo merge — v0 and sa-ban stay
   independently deployable; only the map-rendering primitive is shared.

No work toward step 1–2 is done in this wave; this section documents the
seam so a future prompt can pick it up without re-deriving the shape.

## Usage

```tsx
import { createMap, addRegionMarkers, addRegionEmphasisLayers } from "@/lib/map-shell";

const map = createMap({ container, regions });
map.on("load", () => {
  addRegionEmphasisLayers(map, regions, { geoJsonUrl: "/geo/portfolio-regions.geojson" });
  const markers = addRegionMarkers(map, regions, { onSelect, unitLabel: t("home.mapUnit") });
});
```

See `components/home/region-map-canvas.tsx` for the full lifecycle
(loading/error state, `ResizeObserver`, cleanup on unmount).
