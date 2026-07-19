import type { AnalyzerInput, NormalizedResult } from "@/types/domain";
import type { ParserAdapter } from "./parserAdapter";
import { ParserError } from "./security/errors";
import { digiAlmParser } from "./adapters/digialm";
import { tcsIonParser } from "./adapters/tcsion.parser";
import { pdfParser } from "./adapters/pdf";
import { genericHtmlParser } from "./adapters/genericHtml.parser";

/**
 * Explicit, ordered adapter registry used for all real (production)
 * analysis. Order matters: more specific vendor adapters are checked
 * before generic fallbacks. `MockUniversalParser` is intentionally NOT
 * part of this list — it must never silently handle real user input.
 */
const adapters: ParserAdapter[] = [digiAlmParser, tcsIonParser, pdfParser, genericHtmlParser];

/**
 * Resolves and runs the appropriate real parser adapter for the given
 * input. Never falls back to mock/random data. If no adapter can
 * handle the input, throws a clear, user-facing ParserError instead of
 * guessing.
 */
export async function parseAnalyzerInput(input: AnalyzerInput): Promise<NormalizedResult> {
  const adapter = adapters.find((a) => a.canHandle(input));

  if (!adapter) {
    throw new ParserError(
      "UNSUPPORTED_SOURCE",
      "This response sheet format is not supported yet. Please check the link, or try a different supported source."
    );
  }

  return adapter.parse(input);
}
