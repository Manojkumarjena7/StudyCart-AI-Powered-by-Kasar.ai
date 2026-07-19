import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { extractColoredOptionRuns } from "./colorExtractor";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
let pdfBuffer: Buffer;

beforeAll(() => {
  pdfBuffer = readFileSync(path.join(fixtureDir, "__fixtures__", "sample-response-sheet.pdf"));
});

describe("extractColoredOptionRuns", () => {
  it("extracts the correct option (green) for every question, in document order", async () => {
    const runs = await extractColoredOptionRuns(pdfBuffer);

    // 4 questions x (up to 4 options each) = 15 colored runs in this fixture
    // (Q3 only has 3 options).
    expect(runs.length).toBeGreaterThan(0);

    const correctRuns = runs.filter((r) => r.isCorrect);
    expect(correctRuns).toHaveLength(4); // one correct option per question
    expect(correctRuns.map((r) => r.text)).toEqual(["Mahanadi", "Bhubaneswar", "6", "Jagannath Das"]);
  });

  it("marks non-correct options as isCorrect: false", async () => {
    const runs = await extractColoredOptionRuns(pdfBuffer);
    const wrongRuns = runs.filter((r) => !r.isCorrect);
    expect(wrongRuns.length).toBeGreaterThan(0);
    expect(wrongRuns.every((r) => r.isCorrect === false)).toBe(true);
  });

  it("parses each run's option number from its own leading 'N.' text", async () => {
    const runs = await extractColoredOptionRuns(pdfBuffer);
    for (const run of runs) {
      expect(run.number).toBeGreaterThanOrEqual(1);
      expect(run.number).toBeLessThanOrEqual(4);
    }
  });

  it("returns an empty array (never throws) for a PDF with no colored text", async () => {
    // A trivial, valid PDF-like buffer with no real content should not crash;
    // corrupt/invalid buffers gracefully degrade to an empty result instead
    // of blocking the rest of the parse pipeline.
    const runs = await extractColoredOptionRuns(Buffer.from("not a real pdf"));
    expect(runs).toEqual([]);
  });
});
