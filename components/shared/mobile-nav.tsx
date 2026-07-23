"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { HeaderProject } from "@/lib/types";
import type { V0ImageAsset } from "@/lib/library-bridge";

const STATUS_LABEL: Record<string, string> = {
  "dang-trien-khai": "Đang triển khai",
  "dang-ban": "Đang mở bán",
  "da-ban-giao": "Đã bàn giao",
  "sap-mo-ban": "Sắp mở bán",
};

const NAV_ITEMS = [
  { key: "du-an", label: "Dự án", href: "/du-an" },
  { key: "so-sanh", label: "So sánh", href: "/so-sanh" },
  { key: "phap-ly", label: "Pháp lý", href: "/phap-ly" },
] as const;

/** SPEC §3.1 "Mobile nav (<1024)" — accessible Dialog-based panel, not dead links. */
export function MobileNav({
  projects,
  thumbBySlug,
  activeKey,
}: {
  projects: HeaderProject[];
  thumbBySlug: Record<string, V0ImageAsset | null>;
  activeKey: string | null;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở menu điều hướng"
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg text-foreground",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "lg:hidden"
        )}
      >
        <MenuIcon className="size-5" />
      </button>
      <DialogContent
        showCloseButton
        className="left-auto top-0 right-0 h-full max-h-none w-[min(88vw,320px)] max-w-none translate-x-0 translate-y-0 rounded-none rounded-l-xl border-l border-border p-4 data-open:slide-in-from-right data-closed:slide-out-to-right"
      >
        <DialogTitle className="mb-4 text-sm font-semibold text-foreground">Điều hướng</DialogTitle>

        <nav aria-label="Điều hướng chính (di động)" className="mb-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={item.key === activeKey ? "page" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium",
                item.key === activeKey ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">4 dự án</p>
        <div className="space-y-1">
          {projects.map((p) => {
            const thumb = thumbBySlug[p.slug];
            const url = thumb ? (thumb.resolvedUrl ?? thumb.sourceFileUrl) : null;
            return (
              <Link
                key={p.slug}
                href={`/du-an/${p.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
              >
                <span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  {url ? (
                    <Image src={url} alt={thumb?.alt ?? p.displayNameVi} fill unoptimized sizes="64px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
                  )}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">{p.displayNameVi}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.region} · {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
