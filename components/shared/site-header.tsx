"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { CmdKSearch } from "@/components/shared/cmdk";
import { ProjectNavDropdown } from "@/components/shared/project-nav-dropdown";
import { MobileNav } from "@/components/shared/mobile-nav";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";
import type { HeaderProject } from "@/lib/types";
import type { V0ImageAsset } from "@/lib/library-bridge";

function activeNavKey(pathname: string): string | null {
  if (pathname === "/so-sanh") return "so-sanh";
  if (pathname === "/phap-ly") return "phap-ly";
  if (pathname === "/du-an" || pathname.startsWith("/du-an/")) return "du-an";
  return null;
}

interface SiteHeaderProps {
  headerProjects: HeaderProject[];
  thumbBySlug?: Record<string, V0ImageAsset | null>;
}

export function SiteHeader({ headerProjects, thumbBySlug = {} }: SiteHeaderProps) {
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const pathname = usePathname() ?? "";
  const activeKey = activeNavKey(pathname);
  const { t } = useLocale();

  const navItems = [
    { key: "so-sanh", label: t("nav.soSanh"), href: "/so-sanh" },
    { key: "phap-ly", label: t("nav.phapLy"), href: "/phap-ly" },
  ] as const;

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdkOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground select-none"
          >
            {t("brand.wordmark")}
          </Link>

          <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
            <ProjectNavDropdown projects={headerProjects} thumbBySlug={thumbBySlug} active={activeKey === "du-an"} />
            {navItems.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setCmdkOpen(true)}
            aria-label="Mở tìm kiếm (Ctrl+K)"
            className={cn(
              "flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5",
              "text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <SearchIcon className="size-4 shrink-0" />
            <span className="hidden sm:inline">{t("nav.search")}…</span>
            <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              {t("nav.searchShortcut")}
            </kbd>
          </button>

          <LocaleSwitcher />

          <ThemeToggle />

          <MobileNav projects={headerProjects} thumbBySlug={thumbBySlug} activeKey={activeKey} />
        </div>
      </header>

      <CmdKSearch open={cmdkOpen} onOpenChange={setCmdkOpen} projects={headerProjects} />
    </>
  );
}
