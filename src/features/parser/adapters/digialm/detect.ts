import type { AnalyzerInput } from "@/types/domain";

/**
 * DigiAlm-hosted response sheets are served from a small, known set of
 * domains (the vendor operates multiple regional/branded hostnames), and
 * response-sheet pages consistently live under a "AnswerSheet"-style
 * servlet path with a query-string session token. We match on host +
 * path shape rather than a bare substring check, so we don't misfire on
 * unrelated pages that merely mention "digialm" somewhere in the URL.
 */
const DIGIALM_HOST_PATTERNS: RegExp[] = [
  /(^|\.)digialm\.com$/i,
  /(^|\.)cdn3\.digialm\.com$/i,
];

// DigiAlm response-sheet URLs are consistently served from paths such as
// "/per/<region>/pub/<client>/touchstone/AssessmentQPHTMLMode.../..."
// (verified against a real, live DigiAlm response-sheet URL) as well as
// older/other vendor-build paths like "/EForms/PermitDownload/...",
// "/AnswerSheet/...", or similar servlet paths — never the bare root.
const DIGIALM_PATH_PATTERNS: RegExp[] = [
  /touchstone/i,
  /assessmentqp/i,
  /answer[-_]?sheet/i,
  /responsesheet/i,
  /eforms/i,
  /candidateresponse/i,
];

export function isDigiAlmUrl(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  const hostMatches = DIGIALM_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname));
  if (!hostMatches) return false;

  // Require a recognizable response-sheet path shape too, so a bare
  // "https://digialm.com/" (e.g. a marketing page) doesn't match.
  const pathAndQuery = `${parsed.pathname}${parsed.search}`;
  const pathMatches = DIGIALM_PATH_PATTERNS.some((pattern) => pattern.test(pathAndQuery));

  return pathMatches;
}

export function digiAlmCanHandle(input: AnalyzerInput): boolean {
  return input.sourceType === "url" && !!input.url && isDigiAlmUrl(input.url);
}
