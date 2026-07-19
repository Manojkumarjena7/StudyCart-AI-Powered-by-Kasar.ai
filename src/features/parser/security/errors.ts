/**
 * User-facing error taxonomy for the real parsing pipeline. Each error
 * carries a short machine-readable code (for logging/telemetry) and a
 * plain, non-technical message safe to show directly to a student.
 * Internal details (stack traces, host names, HTTP internals) are never
 * included in `userMessage`.
 */
export type ParserErrorCode =
  | "INVALID_URL"
  | "UNSUPPORTED_SOURCE"
  | "REQUEST_TIMEOUT"
  | "ACCESS_DENIED"
  | "EXPIRED_RESPONSE_SHEET"
  | "EMPTY_RESPONSE"
  | "UNEXPECTED_CONTENT_TYPE"
  | "RESPONSE_TOO_LARGE"
  | "PARSING_FAILED"
  | "PDF_NOT_AVAILABLE"
  | "MARKING_SCHEME_UNKNOWN";

export class ParserError extends Error {
  readonly code: ParserErrorCode;
  readonly userMessage: string;

  constructor(code: ParserErrorCode, userMessage: string, internalMessage?: string) {
    super(internalMessage ?? userMessage);
    this.name = "ParserError";
    this.code = code;
    this.userMessage = userMessage;
  }
}

export const PARSER_ERROR_MESSAGES: Record<ParserErrorCode, string> = {
  INVALID_URL: "That doesn't look like a valid response sheet URL. Please check the link and try again.",
  UNSUPPORTED_SOURCE:
    "This response sheet format is not supported yet. Please check the link, or try a different supported source.",
  REQUEST_TIMEOUT: "The response sheet took too long to load. Please try again in a moment.",
  ACCESS_DENIED: "We couldn't access that link. Please make sure it's a public response sheet URL.",
  EXPIRED_RESPONSE_SHEET: "This response sheet link appears to have expired or is no longer available.",
  EMPTY_RESPONSE: "The response sheet page returned no content. Please check the link and try again.",
  UNEXPECTED_CONTENT_TYPE: "That link didn't return a response sheet page we can read.",
  RESPONSE_TOO_LARGE: "That response sheet page is larger than we can safely process.",
  PARSING_FAILED:
    "We couldn't extract your result from this response sheet. Please try again or contact support.",
  PDF_NOT_AVAILABLE: "PDF analysis is coming in the next parser update. Please use a supported response-sheet URL.",
  MARKING_SCHEME_UNKNOWN:
    "We recognized this exam's response sheet, but don't yet have its marking scheme configured, so we can't calculate an accurate score. Please contact support and we'll add it.",
};
