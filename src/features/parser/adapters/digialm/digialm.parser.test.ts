import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const sampleHtml = readFileSync(
  path.join(fixtureDir, "__fixtures__", "sample-response-sheet.html"),
  "utf-8"
);

vi.mock("../../security/safeFetch", () => ({
  safeFetchResponseSheet: vi.fn(),
}));

import { safeFetchResponseSheet } from "../../security/safeFetch";
import { digiAlmParser } from "./digialm.parser";

const mockedSafeFetch = vi.mocked(safeFetchResponseSheet);

describe("digiAlmParser.parse (integration, fetch mocked)", () => {
  beforeEach(() => {
    mockedSafeFetch.mockReset();
    mockedSafeFetch.mockResolvedValue({
      html: sampleHtml,
      finalUrl: "https://digialm.com/candidateresponse/1",
      contentType: "text/html",
    });
  });

  it("returns a NormalizedResult with candidate/exam data merged with form selections", async () => {
    const result = await digiAlmParser.parse({
      sourceType: "url",
      url: "https://digialm.com/candidateresponse/1",
      category: "SC",
      gender: "Female",
      consentGiven: true,
    });

    expect(result.candidate.name).toBe("TEST CANDIDATE");
    expect(result.candidate.category).toBe("SC"); // from the form, not the page
    expect(result.candidate.gender).toBe("Female"); // from the form, not the page
    expect(result.exam.examName).toContain("Conduct of Written Test for the posts of RI");
    expect(result.questions).toHaveLength(4);
  });

  it("produces identical results for the same URL submitted twice (no Math.random anywhere)", async () => {
    const first = await digiAlmParser.parse({
      sourceType: "url",
      url: "https://digialm.com/candidateresponse/1",
      category: "General",
      consentGiven: true,
    });
    const second = await digiAlmParser.parse({
      sourceType: "url",
      url: "https://digialm.com/candidateresponse/1",
      category: "General",
      consentGiven: true,
    });

    expect(second).toEqual(first);
  });

  it("canHandle correctly identifies a DigiAlm URL", () => {
    expect(
      digiAlmParser.canHandle({
        sourceType: "url",
        url: "https://digialm.com/candidateresponse/1",
        category: "General",
        consentGiven: true,
      })
    ).toBe(true);
  });

  it("canHandle rejects an unrelated URL", () => {
    expect(
      digiAlmParser.canHandle({
        sourceType: "url",
        url: "https://example.com/somepage",
        category: "General",
        consentGiven: true,
      })
    ).toBe(false);
  });
});
