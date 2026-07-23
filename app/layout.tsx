import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { SiteFooter } from "@/components/shared/site-footer";
import { fraunces, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "DED-PMH — Hồ sơ dự án",
  description: "Tra cứu pháp lý và thư viện ảnh các dự án Phú Mỹ Hưng và Hồng Hạc City",
  generator: "v0.app",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`bg-background ${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider>
            {/* R10 — sitewide `prefers-reduced-motion` respect: several
                scroll-triggered sections (StatStrip, ExplorerPreview)
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
