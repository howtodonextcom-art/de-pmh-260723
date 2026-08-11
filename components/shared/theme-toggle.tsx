"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { SunIcon, MoonIcon, MonitorIcon, CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/locale-context";

/**
 * Header theme control — Variant B (icon trigger + radio-group popup menu).
 * Shares the same `next-themes` store as the theme actions in `cmdk.tsx`;
 * there is no second theme state, both paths call `setTheme()`.
 */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();

  // next-themes only knows the real theme after mount (resolvedTheme is
  // `undefined` on the server-rendered HTML) — render a neutral icon until
  // then to avoid a flash of the wrong icon.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const TriggerIcon = !mounted
    ? MonitorIcon
    : resolvedTheme === "light"
      ? SunIcon
      : resolvedTheme === "dark"
        ? MoonIcon
        : MonitorIcon;

  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        aria-label={t("nav.themeSwitcherLabel")}
        aria-haspopup="menu"
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition-colors",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <TriggerIcon className="size-4" />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner side="bottom" align="end" sideOffset={10} className="z-50">
          <MenuPrimitive.Popup
            className={cn(
              "w-44 overflow-hidden rounded-2xl border border-border/80 bg-popover p-1 text-popover-foreground shadow-[0_12px_40px_-12px_rgba(15,40,30,0.28)]",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            )}
          >
            <MenuPrimitive.RadioGroup value={theme ?? "system"} onValueChange={setTheme}>
              <ThemeRadioItem value="light" icon={SunIcon} label={t("cmdk.themeLight")} />
              <ThemeRadioItem value="dark" icon={MoonIcon} label={t("cmdk.themeDark")} />
              <ThemeRadioItem value="system" icon={MonitorIcon} label={t("cmdk.themeSystem")} />
            </MenuPrimitive.RadioGroup>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}

function ThemeRadioItem({
  value,
  icon: Icon,
  label,
}: {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <MenuPrimitive.RadioItem
      value={value}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground outline-none transition-colors",
        "data-highlighted:bg-accent"
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      <MenuPrimitive.RadioItemIndicator className="flex size-4 shrink-0 items-center justify-center text-foreground">
        <CheckIcon className="size-3.5" />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}
