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
  // pdf-parse's core PDFParse.js does `import * as pdfjs from
  // 'pdfjs-dist/legacy/build/pdf.mjs'` (static) and PDFParse.setWorker() also
  // points at a *dynamically constructed* file path
  // (node_modules/pdf-parse/dist/worker/pdf.worker.mjs). Verified locally: a
  // `next build` .nft.json trace for /resume/build includes 0 pdfjs-dist files
  // even though the import is static — @vercel/nft misses it — so on Vercel's
  // pruned deployment this throws a module-not-found error at import time,
  // before any of our own try/catch can run. outputFileTracingIncludes is
  // Next.js's documented fix for exactly this class of tracing gap. Scoped to
  // the one route that parses resume PDFs.
  outputFileTracingIncludes: {
    "/resume/build": ["node_modules/pdf-parse/**/*", "node_modules/pdfjs-dist/**/*"],
  },
  images: {
    // Local, trusted brand SVGs only (public/brand/) — next/image blocks SVG by
    // default since it can execute scripts; these are our own static assets.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;