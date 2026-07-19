import type { ParserAdapter } from "../parserAdapter";
import type { NormalizedResult } from "@/types/domain";
import { ParserError } from "../security/errors";

/**
 * Placeholder adapter for generic, non-vendor-specific HTML response
 * sheets. IMPORTANT: unlike Phase 1, this must NOT claim to handle
 * every URL — it stays unimplemented until a real generic extraction
 * strategy exists, so unmatched URLs correctly fall through to a clear
 * "unsupported" error instead of silently producing fake results.
 */
export const genericHtmlParser: ParserAdapter = {
  id: "generic-html",
  name: "Generic HTML Response Sheet Parser",
  canHandle(): boolean {
    return false;
  },
  async parse(): Promise<NormalizedResult> {
    throw new ParserError(
      "UNSUPPORTED_SOURCE",
      "This response sheet format is not supported yet. Please check the link, or try a different supported source."
    );
  },
};
