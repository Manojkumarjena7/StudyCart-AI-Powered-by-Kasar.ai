import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Raised from 10mb to accommodate the Library Contribution MVP's 20MB PDF
      // limit (src/lib/library/contribution-repository.ts) — this is a ceiling only;
      // each feature still enforces its own smaller limit on top of this.
      bodySizeLimit: "20mb",
    },
  },
  images: {
    // Local, trusted brand SVGs only (public/brand/) — next/image blocks SVG by
    // default since it can execute scripts; these are our own static assets.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;