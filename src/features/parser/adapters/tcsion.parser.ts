import type { ParserAdapter } from "../parserAdapter";
import type { AnalyzerInput, NormalizedResult } from "@/types/domain";
import { ParserError } from "../security/errors";

/** Placeholder adapter for TCS iON hosted response sheets. Not implemented yet. */
export const tcsIonParser: ParserAdapter = {
  id: "tcs-ion",
  name: "TCS iON Response Sheet Parser",
  canHandle(input: AnalyzerInput) {
    return input.sourceType === "url" && !!input.url?.includes("tcsion.com");
  },
  async parse(): Promise<NormalizedResult> {
    throw new ParserError(
      "UNSUPPORTED_SOURCE",
      "This response sheet format is not supported yet. Please check the link, or try a different supported source."
    );
  },
};
