import path from "node:path";
import { pathToFileURL } from "node:url";
import { extractResumeDataFromText } from "./extraction";
import type { ExtractionResult } from "./types";

/**
 * Server-only PDF text extraction for the Resume Builder (Phase 1). Uses the existing
 * `pdf-parse` dependency, following the same worker-setup pattern as
 * src/lib/library/pdf-validation.ts and src/features/parser/adapters/pdf/pdf.parser.ts
 * — deliberately duplicated rather than shared, since this module must stay
 * independent of both the Library and the Government Job Platform (see
 * docs/ARCHITECTURE.md §Route boundary rules).
 *
 * No OCR: a scanned/image-only PDF has no extractable text layer and is reported as
 * such, never silently returned as an empty resume.
 *
 * Both `pdf-parse` and `DOMMatrix` (below) are imported dynamically, inside
 * parseResumePdf's own try block, rather than as static top-level imports.
 * Confirmed in production: a static import failing throws before this
 * module's exported function can ever run, bypassing every try/catch in this
 * file and in resume-actions.ts entirely, and surfacing as a raw framework
 * 500 instead of a graceful in-app error.
 */

let workerConfigured = false;
function ensureWorkerConfigured(PDFParseCtor: typeof import("pdf-parse").PDFParse): void {
  if (workerConfigured) return;
  const workerPath = path.join(process.cwd(), "node_modules/pdf-parse/dist/worker/pdf.worker.mjs");
  PDFParseCtor.setWorker(pathToFileURL(workerPath).href);
  workerConfigured = true;
}

let domMatrixConfigured = false;
async function ensureDomMatrixPolyfilled(): Promise<void> {
  if (domMatrixConfigured || typeof (globalThis as { DOMMatrix?: unknown }).DOMMatrix !== "undefined") {
    domMatrixConfigured = true;
    return;
  }
  // pdfjs-dist (used internally by pdf-parse) needs the browser-only DOMMatrix
  // API for PDF page transform/coordinate math, even for plain text
  // extraction — confirmed via a production error: "ReferenceError: DOMMatrix
  // is not defined". pdfjs-dist tries to polyfill this itself via a lazy
  // `require("@napi-rs/canvas")`, but only warns (leaving DOMMatrix
  // undefined) if that native addon's platform binary isn't available in the
  // deployed environment — the binary this project depends on is a
  // platform-specific optional dependency, so it can differ or be missing
  // between build and deploy environments. Polyfilling it explicitly here
  // means a missing/failed canvas load is a single clear, catchable error at
  // one place, not a ReferenceError from deep inside pdfjs-dist's internals.
  const canvas = await import("@napi-rs/canvas");
  (globalThis as { DOMMatrix?: unknown }).DOMMatrix = canvas.DOMMatrix;
  domMatrixConfigured = true;
}

/** Below this many non-whitespace characters, we treat the PDF as having no usable
 * text layer (most likely a scanned/image-only document) rather than attempt to
 * structure whatever fragment came back. */
const MIN_READABLE_TEXT_LENGTH = 40;

export type ParseResumePdfResult =
  | { ok: true; extraction: ExtractionResult }
  | { ok: false; reason: "invalid-pdf" | "empty-text" | "unexpected"; error: string };

export async function parseResumePdf(buffer: Buffer): Promise<ParseResumePdfResult> {
  try {
    await ensureDomMatrixPolyfilled();
    const { PDFParse } = await import("pdf-parse");
    ensureWorkerConfigured(PDFParse);
    const parser = new PDFParse({ data: buffer });
    try {
      const info = await parser.getInfo();
      if (!info.total || info.total < 1) {
        return { ok: false, reason: "invalid-pdf", error: "This PDF has no readable pages." };
      }

      const textResult = await parser.getText();
      const rawText = textResult.text ?? "";

      if (rawText.trim().length < MIN_READABLE_TEXT_LENGTH) {
        return {
          ok: false,
          reason: "empty-text",
          error:
            "We couldn't read text from this PDF — it may be a scanned or image-only document. Please try a text-based PDF, or continue and enter your details manually.",
        };
      }

      return { ok: true, extraction: extractResumeDataFromText(rawText) };
    } finally {
      await parser.destroy().catch(() => {});
    }
  } catch (error) {
    // Log only the error's name/message for diagnosability — never the PDF
    // buffer or any extracted/parsed text, which may contain resume content.
    console.error(
      "parseResumePdf: PDF parsing failed",
      error instanceof Error ? { name: error.name, message: error.message } : error
    );
    return {
      ok: false,
      reason: "invalid-pdf",
      error: "This file doesn't look like a valid PDF. Please upload a real PDF document.",
    };
  }
}
