import type { Metadata, Viewport } from "next";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ThemeProvider, themeInitScript } from "@/components/shared/theme-provider";
import { brandConfig } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${brandConfig.siteName} — ${brandConfig.sitePositioning}`,
  description: brandConfig.productDescription,
  icons: {
    // src/app/favicon.ico is picked up automatically by Next.js's file convention;
    // this adds the explicit sizes the supplied favicon.ico (16x16 only) doesn't
    // cover on its own, plus the larger PWA-style sizes from the brand pack.
    icon: [
      { url: "/brand/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // src/app/apple-icon.png also exists as the file-convention source, but an
    // explicit metadata.icons.icon array (above) suppresses Next's automatic
    // apple-icon merge in this version — declaring it here directly is the
    // reliable path (verified: file-convention alone did not emit the tag once
    // metadata.icons.icon was set, per node_modules/next/dist/docs/.../app-icons.md).
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // No metadataBase set — the production domain isn't confirmed, and inventing one
  // isn't appropriate. The image below resolves relative to request origin; Next
  // will print an informational build warning recommending metadataBase once a
  // real domain is known.
  openGraph: {
    title: `${brandConfig.siteName} — ${brandConfig.sitePositioning}`,
    description: brandConfig.productDescription,
    images: [{ url: "/brand/social/og-image.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E7A5F",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies a saved Day/Night preference before paint, avoiding a flash of
            the KasarTech Green default. See src/components/shared/theme-provider.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
