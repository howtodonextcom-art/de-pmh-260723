import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/shared/site-footer";
import { themeInitScript } from "@/lib/theme-init-script";
import { fraunces, inter } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("layoutTitle"),
    description: t("layoutDescription"),
  };
}

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
  // next-intl resolves the locale via i18n/request.ts (reads the
  // NEXT_LOCALE cookie that proxy.ts guarantees is present). Server
  // Components now get this through getTranslations()/getLocale() directly
  // — no more split-brain between a static vi-only t() and a client-only
  // reactive Context (see docs/ADR-002-i18n-strategy.md).
  const locale = await getLocale();
  const messages = await getMessages();

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
          <NextIntlClientProvider locale={locale} messages={messages}>
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
          </NextIntlClientProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
