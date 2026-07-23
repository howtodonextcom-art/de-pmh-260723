"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { HeaderProject } from "@/lib/types";
import type { V0ImageAsset } from "@/lib/library-bridge";

const STATUS_LABEL: Record<string, string> = {
  "dang-trien-khai": "Đang triển khai",
  "dang-ban": "Đang mở bán",
  "da-ban-giao": "Đã bàn giao",
  "sap-mo-ban": "Sắp mở bán",
};

/** SPEC §3.1 header: "Dự án" dropdown — 4 items, 96×64 thumb + name + region + status badge. */
export function ProjectNavDropdown({
  projects,
  thumbBySlug,
  active,
}: {
  projects: HeaderProject[];
  thumbBySlug: Record<string, V0ImageAsset | null>;
  active: boolean;
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        openOnHover
        delay={80}
        className={cn(
          "group relative flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        Dự án
        <ChevronDownIcon className="size-3.5 transition-transform group-data-popup-open:rotate-180" />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner side="bottom" align="start" sideOffset={10} className="z-50">
          <MenuPrimitive.Popup className="w-[340px] rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            {projects.map((p) => {
              const thumb = thumbBySlug[p.slug];
              const url = thumb ? (thumb.resolvedUrl ?? thumb.sourceFileUrl) : null;
              return (
                <MenuPrimitive.LinkItem
                  key={p.slug}
                  render={<Link href={`/du-an/${p.slug}`} />}
                  className="flex items-center gap-3 rounded-lg p-2 outline-none data-highlighted:bg-accent"
                >
                  <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                    {url ? (
                      <Image src={url} alt={thumb?.alt ?? p.displayNameVi} fill unoptimized sizes="96px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">{p.displayNameVi}</span>
                    <span className="text-xs text-muted-foreground">{p.region}</span>
                  </span>
                  <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </MenuPrimitive.LinkItem>
              );
            })}
            <MenuPrimitive.Separator className="my-1 h-px bg-border" />
            <MenuPrimitive.LinkItem
              render={<Link href="/du-an" />}
              className="flex items-center justify-center rounded-lg p-2 text-sm font-medium text-primary outline-none data-highlighted:bg-accent"
            >
              Xem tất cả & bộ lọc dự án →
            </MenuPrimitive.LinkItem>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}
