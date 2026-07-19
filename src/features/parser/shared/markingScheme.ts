import { ParserError } from "../security/errors";

export interface MarkingScheme {
  positiveMarksPerQuestion: number;
  negativeMarksPerQuestion: number;
}

/**
 * Marking-scheme resolution strategy, in priority order:
 *   1. If the response sheet HTML itself states the marking scheme
 *      (some DigiAlm sheets print it in an instructions/legend block),
 *      the extractor should pass that through directly — it always wins.
 *   2. Otherwise, fall back to a per-exam configured scheme, keyed by a
 *      normalized exam name, maintained here as new exams are onboarded.
 *   3. If neither is available, we do NOT guess. The parser must throw
 *      a MARKING_SCHEME_UNKNOWN error rather than silently assuming a
 *      "standard" +1/-0.25 scheme that may not apply to this exam.
 */
const CONFIGURED_MARKING_SCHEMES: Record<string, MarkingScheme> = {
  // First supported exam. Keys are normalized (lowercased, whitespace-collapsed)
  // exam names. Add new entries here as additional exams are onboarded —
  // no code changes required elsewhere.
  "osssc ri / ari recruitment examination 2026": {
    positiveMarksPerQuestion: 1,
    negativeMarksPerQuestion: 0.25,
  },
};

function normalizeExamName(examName: string): string {
  return examName.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Resolves the marking scheme for a parsed exam. Throws a clear,
 * user-facing error if it cannot be determined — the caller must not
 * substitute a default.
 */
export function resolveMarkingScheme(
  examName: string | undefined,
  extractedScheme: MarkingScheme | null
): MarkingScheme {
  if (extractedScheme) {
    return extractedScheme;
  }

  if (examName) {
    const configured = CONFIGURED_MARKING_SCHEMES[normalizeExamName(examName)];
    if (configured) {
      return configured;
    }
  }

  throw new ParserError(
    "MARKING_SCHEME_UNKNOWN",
    "We recognized this exam's response sheet, but don't yet have its marking scheme configured, so we can't calculate an accurate score. Please contact support and we'll add it."
  );
}
