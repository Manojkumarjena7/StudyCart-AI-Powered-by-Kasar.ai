import type { AnalyzerInput, NormalizedResult } from "@/types/domain";

/**
 * Contract every parser must satisfy. Each real-world source (DigiAlm,
 * TCS iON, a raw PDF, or a generic HTML response sheet) gets its own
 * adapter, but all of them resolve to the same NormalizedResult shape
 * so the scoring engine never needs to know where the data came from.
 */
export interface ParserAdapter {
  /** Unique adapter id, useful for logging/telemetry. */
  readonly id: string;
  /** Human-readable name shown in diagnostics. */
  readonly name: string;
  /** Whether this adapter can handle the given input. */
  canHandle(input: AnalyzerInput): boolean;
  /** Parse the input into a NormalizedResult. Must not persist the raw source. */
  parse(input: AnalyzerInput): Promise<NormalizedResult>;
}

export class UnsupportedSourceError extends Error {
  constructor(message = "No parser adapter could handle this source.") {
    super(message);
    this.name = "UnsupportedSourceError";
  }
}
