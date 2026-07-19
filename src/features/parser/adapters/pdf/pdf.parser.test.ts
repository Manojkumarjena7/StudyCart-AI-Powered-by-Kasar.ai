import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pdfParser } from "./pdf.parser";
import { ParserError } from "../../security/errors";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
let sampleFile: File;

beforeAll(() => {
  const bytes = readFileSync(path.join(fixtureDir, "__fixtures__", "sample-response-sheet.pdf"));
  // Node 20+ provides a global File constructor (via undici), matching
  // what a real Next.js Server Action receives from a browser upload.
  sampleFile = new File([new Uint8Array(bytes)], "sample-response-sheet.pdf", {
    type: "application/pdf",
  });
});

describe("pdfParser.parse (integration, real PDF binary via pdf-parse)", () => {
  it("canHandle is true for a pdf source with a file present", () => {
    expect(
      pdfParser.canHandle({
        sourceType: "pdf",
        file: sampleFile,
        category: "General",
        consentGiven: true,
      })
    ).toBe(true);
  });

  it("canHandle is false when no file is present", () => {
    expect(
      pdfParser.canHandle({
        sourceType: "pdf",
        category: "General",
        consentGiven: true,
      })
    ).toBe(false);
  });

  it("parses a real PDF binary end-to-end into a NormalizedResult", async () => {
    const result = await pdfParser.parse({
      sourceType: "pdf",
      file: sampleFile,
      category: "SEBC",
      gender: "Male",
      consentGiven: true,
    });

    expect(result.candidate.name).toBe("Test Candidate");
    expect(result.candidate.rollNumber).toBe("PDF123456");
    expect(result.candidate.category).toBe("SEBC"); // from the form
    expect(result.candidate.gender).toBe("Male"); // from the form
    expect(result.exam.examName).toBe("Sample State PSC Recruitment Exam 2026");
    expect(result.questions).toHaveLength(4);
    expect(result.exam.markingScheme).toEqual({
      positiveMarksPerQuestion: 1,
      negativeMarksPerQuestion: 0.25,
    });
  });

  it("produces identical results for the same PDF parsed twice (deterministic)", async () => {
    const first = await pdfParser.parse({
      sourceType: "pdf",
      file: sampleFile,
      category: "General",
      consentGiven: true,
    });
    const second = await pdfParser.parse({
      sourceType: "pdf",
      file: sampleFile,
      category: "General",
      consentGiven: true,
    });
    expect(second).toEqual(first);
  });

  it("rejects a non-PDF content type", async () => {
    const textFile = new File(["not a pdf"], "notes.txt", { type: "text/plain" });
    await expect(
      pdfParser.parse({
        sourceType: "pdf",
        file: textFile,
        category: "General",
        consentGiven: true,
      })
    ).rejects.toThrow(ParserError);
  });

  it("throws a clear ParserError for a corrupt/unparseable PDF (never random data)", async () => {
    const corruptFile = new File([new Uint8Array([1, 2, 3, 4, 5])], "corrupt.pdf", {
      type: "application/pdf",
    });
    await expect(
      pdfParser.parse({
        sourceType: "pdf",
        file: corruptFile,
        category: "General",
        consentGiven: true,
      })
    ).rejects.toThrow(ParserError);
  });
});
