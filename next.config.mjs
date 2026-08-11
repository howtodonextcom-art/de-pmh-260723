import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Next.js 16 blocks cross-origin dev requests (HMR + client bundle fetches)
  // by default, which silently breaks hydration for interactive components
  // when the dev server is reached via 127.0.0.1 instead of localhost — the
  // page loads and looks fine, but click/hover handlers never attach. Both
  // are used interchangeably in this repo's tooling and docs, so allow both.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.phumyhung.vn" },
      { protocol: "https", hostname: "honghacphumyhung.vn" },
      { protocol: "https", hostname: "**.honghacphumyhung.vn" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // `@library` used to point at the parent monorepo's `../src` (cross-repo
  // read-only import). This app now deploys standalone (its own GitHub repo,
  // its own Vercel project) with no `../src` sibling available at build time,
  // so `@library` resolves to a local vendored copy instead — see
  // `vendor/library/` (code) and `vendor/data/` (13_PROJECT_DATA_SCHEMA.json
  // + image manifest), synced from the monorepo's `src/` on 2026-07-20.
  turbopack: {
    // This app is self-contained (its own package.json + lockfile) but sits
    // inside a monorepo that also has a root-level package-lock.json.
    // Without an explicit root, Next.js/Turbopack can't tell which of the
    // two lockfiles marks the real project boundary and prints a
    // "workspace root" warning on every dev/build run. v0/ IS the root.
    root: path.dirname(fileURLToPath(import.meta.url)),
    resolveAlias: {
      "@library": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./vendor/library"),
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@library": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./vendor/library"),
    };
    return config;
  },
};

export default nextConfig;
