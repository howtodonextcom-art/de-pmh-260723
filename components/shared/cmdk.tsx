"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  BuildingIcon,
  FileTextIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  FileDownIcon,
  ScaleIcon,
  GitCompareIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { localizedDisplayName } from "@/lib/i18n/project-copy";
import type { HeaderProject } from "@/lib/types";

interface CmdKSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: HeaderProject[];
}

export function CmdKSearch({ open, onOpenChange, projects }: CmdKSearchProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { setTheme } = useTheme();

  // Was a module-level constant reading the old static t() — moved inside
  // the component since useTranslations() is a hook and can't be called at
  // module scope.
  const staticPages = React.useMemo(
    () => [
      { id: "so-sanh", label: t("cmdk.pageCompare"), href: "/so-sanh", icon: GitCompareIcon },
      { id: "phap-ly", label: t("cmdk.pageLegal"), href: "/phap-ly", icon: ScaleIcon },
    ],
    [t],
  );

  const handleSelect = React.useCallback(
    (href: string) => {
      router.push(href);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const handleTheme = React.useCallback(
    (theme: string) => {
      setTheme(theme);
      onOpenChange(false);
    },
    [setTheme, onOpenChange]
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("nav.search")}
      description={t("cmdk.description")}
    >
      <Command>
        <CommandInput placeholder={t("cmdk.placeholder")} />
        <CommandList>
          <CommandEmpty>{t("cmdk.noResults")}</CommandEmpty>

          {/* ── Projects ─────────────────────────────────────────────── */}
          <CommandGroup heading={t("cmdk.groupProjects")}>
            {projects.map((p) => {
              // Safe: alternateNames may be undefined/null (e.g. Harmonie)
              const name = localizedDisplayName(p, locale);
              const searchValue = [
                name,
                p.displayNameVi,
                p.displayNameEn,
                ...(p.alternateNames ?? []),
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <CommandItem
                  key={p.slug}
                  value={searchValue}
                  onSelect={() => handleSelect(`/du-an/${p.slug}`)}
                  className="flex items-center gap-2"
                >
                  <BuildingIcon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.region}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          {/* ── Static pages ─────────────────────────────────────────── */}
          <CommandGroup heading={t("cmdk.groupPages")}>
            {staticPages.map((page) => (
              <CommandItem
                key={page.id}
                value={page.label}
                onSelect={() => handleSelect(page.href)}
                className="flex items-center gap-2"
              >
                <page.icon className="size-4 shrink-0 text-muted-foreground" />
                <span>{page.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* ── Actions ──────────────────────────────────────────────── */}
          <CommandGroup heading={t("cmdk.groupActions")}>
            <CommandItem
              value="Giao diện sáng light"
              onSelect={() => handleTheme("light")}
              className="flex items-center gap-2"
            >
              <SunIcon className="size-4 shrink-0 text-muted-foreground" />
              <span>{t("cmdk.themeLight")}</span>
            </CommandItem>
            <CommandItem
              value="Giao diện tối dark"
              onSelect={() => handleTheme("dark")}
              className="flex items-center gap-2"
            >
              <MoonIcon className="size-4 shrink-0 text-muted-foreground" />
              <span>{t("cmdk.themeDark")}</span>
            </CommandItem>
            <CommandItem
              value="Theo hệ thống system"
              onSelect={() => handleTheme("system")}
              className="flex items-center gap-2"
            >
              <MonitorIcon className="size-4 shrink-0 text-muted-foreground" />
              <span>{t("cmdk.themeSystem")}</span>
            </CommandItem>

            <CommandSeparator />

            {projects.map((p) => (
              <CommandItem
                key={`export-${p.slug}`}
                value={`${t("cmdk.exportPdf")} ${localizedDisplayName(p, locale)} ${p.slug}`}
                onSelect={() => handleSelect(`/du-an/${p.slug}?export=pdf`)}
                className="flex items-center gap-2"
              >
                <FileDownIcon className="size-4 shrink-0 text-muted-foreground" />
                <span>{t("cmdk.exportPdf")}</span>
                <span className="text-muted-foreground">—</span>
                <span className="truncate text-muted-foreground">
                  {localizedDisplayName(p, locale)}
                </span>
              </CommandItem>
            ))}

            <CommandSeparator />

            <CommandItem
              value="Hồ sơ pháp lý legal"
              onSelect={() => handleSelect("/phap-ly")}
              className="flex items-center gap-2"
            >
              <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
              <span>{t("cmdk.legalDossierItem")}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
