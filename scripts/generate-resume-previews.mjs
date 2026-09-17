// Generates page-1 preview thumbnails for the resume templates shown on /resume.
// Run: node scripts/generate-resume-previews.mjs
// Output: public/resumes/template-0N/preview.png
//
// Renders the ACTUAL first page of each approved template PDF to a PNG — never a
// hand-built HTML/CSS recreation. Uses pdfjs-dist (already a project dependency,
// already used by src/features/parser/adapters/pdf/colorExtractor.ts) together with
// @napi-rs/canvas (already a project dependency — it's the exact native canvas
// backend pdfjs-dist's own built-in NodeCanvasFactory uses for this purpose). No new
// dependency was added. See docs/RESUME-ENHANCEMENT.md §Resume Templates.

import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESUMES_DIR = join(__dirname, "..", "public", "resumes");
const STANDARD_FONT_DATA_URL = join(__dirname, "..", "node_modules", "pdfjs-dist", "standard_fonts") + "/";

// Rendered at 2x this width for a crisp preview on retina displays / hover zoom,
// while staying a reasonable file size for a card thumbnail (not a full-res scan).
const TARGET_WIDTH = 900;

const TEMPLATES = ["template-01", "template-02", "template-03"];

async function renderFirstPage(pdfPath, outPath) {
  const data = new Uint8Array(readFileSync(pdfPath));
  const doc = await getDocument({
    data,
    verbosity: 0,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
  }).promise;

  const page = await doc.getPage(1);
  const unscaled = page.getViewport({ scale: 1 });
  const scale = TARGET_WIDTH / unscaled.width;
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  const context = canvas.getContext("2d");

  await page.render({ canvasContext: context, viewport }).promise;

  writeFileSync(outPath, canvas.toBuffer("image/png"));
  await doc.destroy();
}

async function main() {
  for (const template of TEMPLATES) {
    const pdfPath = join(RESUMES_DIR, template, "resume.pdf");
    const outPath = join(RESUMES_DIR, template, "preview.png");
    console.log(`Rendering ${template} page 1 -> ${outPath}`);
    await renderFirstPage(pdfPath, outPath);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
