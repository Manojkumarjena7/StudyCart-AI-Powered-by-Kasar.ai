import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider, themeInitScript } from "@/components/shared/theme-provider";
import { brandConfig } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${brandConfig.productName} — ${brandConfig.endorsementText}`,
  description: brandConfig.productDescription,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies a saved light-theme preference before paint, avoiding a flash of
            the dark default. See src/components/shared/theme-provider.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
