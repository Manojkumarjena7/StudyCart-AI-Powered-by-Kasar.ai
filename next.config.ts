import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @napi-rs/canvas ships a native binary loaded via js-binding.js, which
  // Turbopack cannot bundle as an ESM chunk ("non-ecmascript placeable
  // asset"). Next.js auto-externalizes the plain `canvas` package for this
  // exact reason but not this one, so it must be opted out explicitly to use
  // native Node `require` instead of being bundled.
  serverExternalPackages: ["@napi-rs/canvas"],
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
  // Confirmed via a live production error ("ReferenceError: DOMMatrix is not
  // defined"): pdfjs-dist needs the browser-only DOMMatrix API even for plain
  // text extraction, and polyfills it internally via a lazy
  // `require("@napi-rs/canvas")` — which fails when that native addon's
  // platform-specific binary package isn't traced into the deployed bundle.
  // @napi-rs/canvas resolves to one of several optional per-platform packages
  // (e.g. @napi-rs/canvas-linux-x64-gnu on Vercel's Linux runtime); the glob
  // below covers whichever one actually gets installed.
  outputFileTracingIncludes: {
    "/resume/build": [
      "node_modules/pdf-parse/**/*",
      "node_modules/pdfjs-dist/**/*",
      "node_modules/@napi-rs/canvas/**/*",
      "node_modules/@napi-rs/canvas-*/**/*",
    ],
  },
  images: {
    // Local, trusted brand SVGs only (public/brand/) — next/image blocks SVG by
    // default since it can execute scripts; these are our own static assets.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;