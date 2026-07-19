import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";
import type { AnalyzerInput, NormalizedResult } from "@/types/domain";
import type { ParserAdapter } from "../../parserAdapter";
import { ParserError } from "../../security/errors";
import { extractPdfResult } from "./textExtractor";
import { normalizePdfResult } from "./normalize";

const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15 MB — generous for a text-based response sheet

/**
 * pdf-parse (via pdf.js) dynamically imports its worker script relative
 * to its own module location. After Next.js bundles server code into
 * `.next/server/chunks/`, that relative path no longer resolves, so we
 * point it at an absolute `file://` URL to the real worker script in
 * node_modules instead. This only needs to run once per process.
 */
let workerConfigured = false;
function ensureWorkerConfigured(): void {
  if (workerConfigured) return;
  const workerPath = path.join(
    process.cwd(),
    "node_modules/pdf-parse/dist/worker/pdf.worker.mjs"
  );
  PDFParse.setWorker(pathToFileURL(workerPath).href);
  workerConfigured = true;
}

/**
 * Real parser for uploaded PDF response sheets.
 *
 * Pipeline: read the uploaded file's bytes -> extract text via pdf-parse
 * -> run the generic line-based extractor -> normalize into the shared
 * NormalizedResult shape. Only ever operates on the in-memory file
 * buffer; the PDF itself is never written to disk or persisted
 * (privacy requirement).
 *
 * Never falls back to random/mock data: scanned/image-only PDFs (no
 * text layer), unsupported layouts, or corrupt files all surface as a
 * clear ParserError instead.
 */
export const pdfParser: ParserAdapter = {
  id: "pdf",
  name: "PDF Response Sheet Parser",

  canHandle(input: AnalyzerInput): boolean {
    return input.sourceType === "pdf" && !!input.file;
  },

  async parse(input: AnalyzerInput): Promise<NormalizedResult> {
    if (!input.file) {
      throw new ParserError("PDF_NOT_AVAILABLE", "Please upload a PDF response sheet.");
    }

    if (input.file.type && input.file.type !== "application/pdf") {
      throw new ParserError(
        "UNEXPECTED_CONTENT_TYPE",
        "That file doesn't look like a PDF. Please upload a PDF response sheet."
      );
    }

    if (input.file.size > MAX_PDF_BYTES) {
      throw new ParserError(
        "RESPONSE_TOO_LARGE",
        "That PDF is larger than we can safely process. Please upload a smaller file."
      );
    }

    let text: string;
    try {
      ensureWorkerConfigured();
      const arrayBuffer = await input.file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text ?? "";
    } catch (error) {
      throw new ParserError(
        "PARSING_FAILED",
        "We couldn't read this PDF. It may be corrupted, password-protected, or in an unsupported format.",
        error instanceof Error ? error.message : "Unknown pdf-parse failure"
      );
    }

    const extracted = extractPdfResult(text);
    const normalized = normalizePdfResult(extracted);

    return {
      ...normalized,
      candidate: {
        ...normalized.candidate,
        category: input.category,
        gender: input.gender,
      },
    };
  },
};
