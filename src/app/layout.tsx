import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { brandConfig } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${brandConfig.productName} — ${brandConfig.endorsementText}`,
  description: brandConfig.productDescription,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
