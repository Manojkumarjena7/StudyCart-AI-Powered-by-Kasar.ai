import type { AnalyzerInput, NormalizedResult } from "@/types/domain";
import type { ParserAdapter } from "./parserAdapter";
import { ParserError } from "./security/errors";
import { digiAlmParser } from "./adapters/digialm";
import { tcsIonParser } from "./adapters/tcsion.parser";
import { genericHtmlParser } from "./adapters/genericHtml.parser";

/**
 * Explicit, ordered adapter registry used for all real (production)
 * analysis. Order matters: more specific vendor adapters are checked
 * before generic fallbacks. `MockUniversalParser` is intentionally NOT
 * part of this list — it must never silently handle real user input.
 *
 * The PDF adapter is deliberately NOT in this static list — see below.
 */
const nonPdfAdapters: ParserAdapter[] = [digiAlmParser, tcsIonParser, genericHtmlParser];

/**
 * Whether the input should be routed to the PDF adapter, without
 * importing that adapter (or its dependencies) to find out. A plain
 * sourceType check is enough here — the PDF adapter itself gives a
 * clear, specific message if a file wasn't actually attached.
 */
function looksLikePdfInput(input: AnalyzerInput): boolean {
  return input.sourceType === "pdf";
}

/**
 * Resolves and runs the appropriate real parser adapter for the given
 * input. Never falls back to mock/random data. If no adapter can
 * handle the input, throws a clear, user-facing ParserError instead of
 * guessing.
 *
 * The PDF adapter is loaded via a dynamic import, only when the input
 * is actually a PDF upload. It depends on pdfjs-dist, which is a heavy
 * dependency with browser-adjacent internals (e.g. canvas/DOMMatrix
 * references) that have no business being loaded into memory for a
 * plain DigiAlm HTML/URL request. Keeping it out of the static import
 * graph means an HTML upload never initializes any PDF-specific code.
 */
export async function parseAnalyzerInput(input: AnalyzerInput): Promise<NormalizedResult> {
  const adapter = nonPdfAdapters.find((a) => a.canHandle(input));

  if (adapter) {
    return adapter.parse(input);
  }

  if (looksLikePdfInput(input)) {
    const { pdfParser } = await import("./adapters/pdf");
    return pdfParser.parse(input);
  }

  throw new ParserError(
    "UNSUPPORTED_SOURCE",
    "This response sheet format is not supported yet. Please check the link, or try a different supported source."
  );
}
