import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";
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
 */

let workerConfigured = false;
function ensureWorkerConfigured(): void {
  if (workerConfigured) return;
  const workerPath = path.join(process.cwd(), "node_modules/pdf-parse/dist/worker/pdf.worker.mjs");
  PDFParse.setWorker(pathToFileURL(workerPath).href);
  workerConfigured = true;
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
    ensureWorkerConfigured();
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
  } catch {
    return {
      ok: false,
      reason: "invalid-pdf",
      error: "This file doesn't look like a valid PDF. Please upload a real PDF document.",
    };
  }
}
