import { describe, it, expect } from "vitest";
import { buildPrintDocumentTitle } from "./print-resume";

/**
 * Only buildPrintDocumentTitle is tested here — it's pure. printResume() itself
 * calls window.print()/document.title and is verified manually in a browser (see
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 4).
 */
describe("buildPrintDocumentTitle", () => {
  it("builds a KasarTech-Resume-<Name> title from a full name", () => {
    expect(buildPrintDocumentTitle("Jane Doe")).toBe("KasarTech-Resume-Jane-Doe");
  });

  it("strips punctuation and collapses whitespace", () => {
    expect(buildPrintDocumentTitle("  Jane   O'Doe-Smith! ")).toBe("KasarTech-Resume-Jane-ODoe-Smith");
  });

  it("falls back to Draft when the name is empty, missing, or whitespace-only", () => {
    expect(buildPrintDocumentTitle("")).toBe("KasarTech-Resume-Draft");
    expect(buildPrintDocumentTitle(undefined)).toBe("KasarTech-Resume-Draft");
    expect(buildPrintDocumentTitle(null)).toBe("KasarTech-Resume-Draft");
    expect(buildPrintDocumentTitle("   ")).toBe("KasarTech-Resume-Draft");
  });

  it("never includes characters that are unsafe in a filename", () => {
    const title = buildPrintDocumentTitle("Jane/Doe:Test*?");
    expect(title).toMatch(/^KasarTech-Resume-[A-Za-z0-9-]+$/);
  });
});
