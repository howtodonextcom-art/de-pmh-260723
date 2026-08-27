import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { LocaleProvider, type Locale } from "@/lib/i18n/locale-context";
import { SiteFooter } from "@/components/shared/site-footer";
import { publicEnv } from "@/lib/config/env";
import { themeInitScript } from "@/lib/theme-init-script";
import { fraunces, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${publicEnv.siteName} — Hồ sơ dự án`,
  description: "Tra cứu pháp lý và thư viện ảnh các dự án đang quản lý",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // F18 — server-side half of the locale split-brain fix. `middleware.ts`
  // guarantees a NEXT_LOCALE cookie is present (defaulted from
  // Accept-Language on first visit) before this render runs, so we just
  // read it here — a Server Component can read cookies but never set them.
  // `<html lang>` and LocaleProvider's initial client state both derive
  // from this same value, so first paint (SSR) and hydration (CSR) agree
  // instead of always defaulting to "vi" regardless of the visitor's
  // actual selected/detected locale.
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = localeCookie === "en" ? "en" : "vi";

  return (
    <html lang={locale} suppressHydrationWarning className={`bg-background ${inter.variable} ${fraunces.variable}`}>
      <head>
        {/* F04 — inline blocking script (not next/script beforeInteractive): the
            Script component pulled layout into a slow client chunk and triggered
            ChunkLoadError timeouts on hydration; raw script keeps FOUC prevention
            without extra chunk loading. */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider initialLocale={locale}>
            {/* R10 — sitewide `prefers-reduced-motion` respect: several
                scroll-triggered sections (ExplorerPreview, map, legal, updates)
                use Framer Motion variants without an individual
                useReducedMotion() guard; MotionConfig covers them all
                in one place instead of touching each component. */}
            <MotionConfig reducedMotion="user">
              {children}
              <SiteFooter />
              <Toaster richColors position="bottom-right" />
            </MotionConfig>
          </LocaleProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
