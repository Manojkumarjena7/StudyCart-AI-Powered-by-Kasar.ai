import type { AnalyzerInput, NormalizedResult } from "@/types/domain";
import type { ParserAdapter } from "../../parserAdapter";
import { digiAlmCanHandle } from "./detect";
import { safeFetchResponseSheet } from "../../security/safeFetch";
import { extractDigiAlmResult } from "./extractor";
import { normalizeDigiAlmResult } from "./normalize";
import { ParserError } from "../../security/errors";

/**
 * Real parser for DigiAlm-hosted response sheets.
 *
 * Pipeline: safe-fetch the URL -> detect/parse the HTML structure ->
 * extract candidate/exam/question data -> normalize into the shared
 * NormalizedResult shape. Category/gender are not present on a response
 * sheet — they come from what the student selected on the analyzer form
 * and are merged in here.
 *
 * Never falls back to random/mock data: any failure surfaces as a
 * ParserError with a clear, student-facing message.
 */
export const digiAlmParser: ParserAdapter = {
  id: "digialm",
  name: "DigiAlm Response Sheet Parser",

  canHandle(input: AnalyzerInput): boolean {
    return digiAlmCanHandle(input);
  },

  async parse(input: AnalyzerInput): Promise<NormalizedResult> {
    if (!input.url) {
      throw new ParserError("INVALID_URL", "Please provide a response sheet URL.");
    }

    const { html } = await safeFetchResponseSheet(input.url);
    const extracted = extractDigiAlmResult(html);
    const normalized = normalizeDigiAlmResult(extracted);

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
