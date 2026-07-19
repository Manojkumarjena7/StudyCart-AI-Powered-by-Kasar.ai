import { describe, it, expect } from "vitest";
import { parseAnalyzerInput } from "./parserEngine";
import { ParserError } from "./security/errors";

describe("parseAnalyzerInput (parser selection)", () => {
  it("throws UNSUPPORTED_SOURCE for an unrecognized URL, never fabricating data", async () => {
    await expect(
      parseAnalyzerInput({
        sourceType: "url",
        url: "https://some-random-exam-portal.example/result",
        category: "General",
        consentGiven: true,
      })
    ).rejects.toThrow(ParserError);

    try {
      await parseAnalyzerInput({
        sourceType: "url",
        url: "https://some-random-exam-portal.example/result",
        category: "General",
        consentGiven: true,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(ParserError);
      expect((err as ParserError).code).toBe("UNSUPPORTED_SOURCE");
    }
  });

  it("routes a PDF source (no file) to the PDF adapter, which reports it needs a file", async () => {
    await expect(
      parseAnalyzerInput({
        sourceType: "pdf",
        category: "General",
        consentGiven: true,
      })
    ).rejects.toThrow(ParserError);
  });

  it("routes a TCS iON-looking URL to the (unimplemented) TCS iON adapter, not the mock parser", async () => {
    await expect(
      parseAnalyzerInput({
        sourceType: "url",
        url: "https://tcsion.com/candidateresponse/1",
        category: "General",
        consentGiven: true,
      })
    ).rejects.toThrow(ParserError);
  });
});
