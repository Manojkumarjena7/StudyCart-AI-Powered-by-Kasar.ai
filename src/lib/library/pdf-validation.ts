import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";

/**
 * Server-only, real content validation for uploaded PDFs — never trusts the file
 * extension or the browser-reported MIME type alone. Parses the actual bytes via
 * pdf-parse (already a project dependency, also used by
 * src/features/parser/adapters/pdf/pdf.parser.ts for the Government Job Platform).
 * This module is intentionally independent of that one — the Library must not import
 * Government Job Platform business logic, and vice versa (see docs/ARCHITECTURE.md
 * §Route boundary rules) — so the small worker-path setup is duplicated here rather
 * than shared.
 */

let workerConfigured = false;
function ensureWorkerConfigured(): void {
  if (workerConfigured) return;
  const workerPath = path.join(process.cwd(), "node_modules/pdf-parse/dist/worker/pdf.worker.mjs");
  PDFParse.setWorker(pathToFileURL(workerPath).href);
  workerConfigured = true;
}

export interface PdfValidationResult {
  valid: boolean;
  /** Real page count extracted from the PDF — never fabricated. */
  pageCount?: number;
  reason?: string;
}

export async function validatePdfBuffer(buffer: Buffer): Promise<PdfValidationResult> {
  try {
    ensureWorkerConfigured();
    const parser = new PDFParse({ data: buffer });
    const info = await parser.getInfo();
    if (!info.total || info.total < 1) {
      return { valid: false, reason: "This PDF has no readable pages." };
    }
    return { valid: true, pageCount: info.total };
  } catch {
    return {
      valid: false,
      reason: "This file doesn't look like a valid PDF. Please upload a real PDF document.",
    };
  }
}
