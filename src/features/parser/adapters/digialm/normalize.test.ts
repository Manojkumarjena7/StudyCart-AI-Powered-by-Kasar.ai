import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { extractDigiAlmResult } from "./extractor";
import { normalizeDigiAlmResult } from "./normalize";
import { calculateScoreSummary, calculateSubjectPerformance } from "@/features/scoring/scoringEngine";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const sampleHtml = readFileSync(
  path.join(fixtureDir, "__fixtures__", "sample-response-sheet.html"),
  "utf-8"
);

describe("normalizeDigiAlmResult", () => {
  it("produces a NormalizedResult with the resolved marking scheme applied", () => {
    const extracted = extractDigiAlmResult(sampleHtml);
    const normalized = normalizeDigiAlmResult(extracted);

    expect(normalized.exam.markingScheme).toEqual({
      positiveMarksPerQuestion: 1,
      negativeMarksPerQuestion: 0.25,
    });
    expect(normalized.exam.totalQuestions).toBe(4);
    expect(normalized.questions).toHaveLength(4);
  });

  it("feeds correctly into the existing scoring engine unchanged", () => {
    const extracted = extractDigiAlmResult(sampleHtml);
    const normalized = normalizeDigiAlmResult(extracted);
    const summary = calculateScoreSummary(normalized);

    // 2 correct, 1 wrong, 1 skipped, out of 4 total (from the fixture)
    expect(summary.correct).toBe(2);
    expect(summary.wrong).toBe(1);
    expect(summary.skipped).toBe(1);
    expect(summary.attempted).toBe(3);
    expect(summary.totalQuestions).toBe(4);
    expect(summary.positiveMarks).toBe(2);
    expect(summary.negativeMarks).toBe(0.25);
    expect(summary.finalScore).toBe(1.75);
  });

  it("produces the same score summary on repeated runs (deterministic, no randomness)", () => {
    const runOnce = () => {
      const extracted = extractDigiAlmResult(sampleHtml);
      const normalized = normalizeDigiAlmResult(extracted);
      return calculateScoreSummary(normalized);
    };

    const first = runOnce();
    const second = runOnce();
    expect(second).toEqual(first);
  });

  it("computes subject-wise performance across the fixture's two subjects", () => {
    const extracted = extractDigiAlmResult(sampleHtml);
    const normalized = normalizeDigiAlmResult(extracted);
    const subjectPerformance = calculateSubjectPerformance(normalized);

    expect(subjectPerformance).toHaveLength(2);
    const maths = subjectPerformance.find((s) => s.subject === "Mathematics")!;
    const generalStudies = subjectPerformance.find((s) => s.subject === "General Studies")!;
    expect(maths.total).toBe(3);
    expect(maths.correct).toBe(1);
    expect(generalStudies.total).toBe(1);
    expect(generalStudies.correct).toBe(1);
  });
});
