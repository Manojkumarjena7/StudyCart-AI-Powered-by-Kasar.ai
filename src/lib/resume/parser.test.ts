import { describe, it, expect } from "vitest";
import { jsPDF } from "jspdf";
import { parseResumePdf } from "./parser";

/**
 * Integration tests for the PDF-specific wrapper around extraction.ts. PDFs are
 * generated at test time with jsPDF (already a project dependency — see
 * scripts/generate-resume-examples.mjs) so no real or fixture resume file is
 * committed to the repository, per docs/RESUME-ENHANCEMENT.md §Resume Builder.
 */

function pdfBufferWithText(lines: string[]): Buffer {
  const doc = new jsPDF();
  let y = 20;
  for (const line of lines) {
    doc.text(line, 10, y);
    y += 10;
  }
  return Buffer.from(doc.output("arraybuffer"));
}

function blankPdfBuffer(): Buffer {
  const doc = new jsPDF();
  return Buffer.from(doc.output("arraybuffer"));
}

describe("parseResumePdf", () => {
  it("extracts structured data from a normal text-based PDF", async () => {
    const buffer = pdfBufferWithText([
      "Sam Rivera",
      "sam.rivera@example.com",
      "",
      "Experience",
      "Data Analyst at Example Co",
      "2021 - 2023",
      "Analyzed pipelines",
    ]);

    const result = await parseResumePdf(buffer);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.extraction.rawText.length).toBeGreaterThan(0);
      expect(result.extraction.data.personalInfo?.email).toBe("sam.rivera@example.com");
    }
  });

  it("reports a blank/scanned-like PDF gracefully instead of returning an empty resume", async () => {
    const buffer = blankPdfBuffer();

    const result = await parseResumePdf(buffer);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("empty-text");
      expect(result.error).not.toMatch(/exception|stack|undefined/i);
    }
  });

  it("reports a malformed/invalid PDF without crashing", async () => {
    const buffer = Buffer.from("this is definitely not a pdf file", "utf-8");

    const result = await parseResumePdf(buffer);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("invalid-pdf");
    }
  });

  it("never fabricates fields absent from the source PDF", async () => {
    const buffer = pdfBufferWithText(["Unnamed Document With No Resume Structure At All"]);

    const result = await parseResumePdf(buffer);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.extraction.data.personalInfo?.email).toBeUndefined();
      expect(result.extraction.data.personalInfo?.phone).toBeUndefined();
      expect(result.extraction.data.experience).toEqual([]);
      expect(result.extraction.data.education).toEqual([]);
    }
  });
});
