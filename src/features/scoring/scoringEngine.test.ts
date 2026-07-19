import { describe, it, expect } from "vitest";
import { calculateScoreSummary, calculateSubjectPerformance } from "./scoringEngine";
import type { NormalizedResult } from "@/types/domain";

function buildResult(overrides?: Partial<NormalizedResult>): NormalizedResult {
  return {
    candidate: {},
    exam: {
      markingScheme: { positiveMarksPerQuestion: 1, negativeMarksPerQuestion: 0.25 },
    },
    questions: [
      { questionNumber: 1, subject: "Maths", outcome: "correct", marksAwarded: 1 },
      { questionNumber: 2, subject: "Maths", outcome: "wrong", marksAwarded: -0.25 },
      { questionNumber: 3, subject: "English", outcome: "skipped", marksAwarded: 0 },
      { questionNumber: 4, subject: "English", outcome: "correct", marksAwarded: 1 },
    ],
    subjects: [
      { subject: "Maths", total: 2, correct: 1, wrong: 1, skipped: 0 },
      { subject: "English", total: 2, correct: 1, wrong: 0, skipped: 1 },
    ],
    ...overrides,
  };
}

describe("calculateScoreSummary", () => {
  it("computes correct/wrong/skipped/attempted/total counts", () => {
    const summary = calculateScoreSummary(buildResult());
    expect(summary.totalQuestions).toBe(4);
    expect(summary.correct).toBe(2);
    expect(summary.wrong).toBe(1);
    expect(summary.skipped).toBe(1);
    expect(summary.attempted).toBe(3);
  });

  it("applies the marking scheme to compute positive/negative marks and final score", () => {
    const summary = calculateScoreSummary(buildResult());
    expect(summary.positiveMarks).toBe(2);
    expect(summary.negativeMarks).toBe(0.25);
    expect(summary.finalScore).toBe(1.75);
  });

  it("computes accuracy as correct / attempted", () => {
    const summary = calculateScoreSummary(buildResult());
    // 2 correct out of 3 attempted = 66.67%
    expect(summary.accuracy).toBe(66.67);
  });

  it("returns 0 accuracy when nothing was attempted", () => {
    const result = buildResult({
      questions: [{ questionNumber: 1, subject: "Maths", outcome: "skipped", marksAwarded: 0 }],
    });
    const summary = calculateScoreSummary(result);
    expect(summary.accuracy).toBe(0);
    expect(summary.attempted).toBe(0);
  });

  it("defaults to +1/-0 marking when no scheme is present", () => {
    const result = buildResult({ exam: {} });
    const summary = calculateScoreSummary(result);
    expect(summary.positiveMarks).toBe(2);
    expect(summary.negativeMarks).toBe(0);
  });

  it("is deterministic — same input always produces the same summary", () => {
    const input = buildResult();
    const first = calculateScoreSummary(input);
    const second = calculateScoreSummary(input);
    expect(second).toEqual(first);
  });
});

describe("calculateSubjectPerformance", () => {
  it("computes per-subject accuracy and score", () => {
    const performance = calculateSubjectPerformance(buildResult());
    const maths = performance.find((s) => s.subject === "Maths")!;
    const english = performance.find((s) => s.subject === "English")!;

    expect(maths.accuracy).toBe(50); // 1 correct / 2 attempted
    expect(maths.score).toBe(0.75); // 1 - 0.25

    expect(english.accuracy).toBe(100); // 1 correct / 1 attempted
    expect(english.score).toBe(1);
  });

  it("returns 0 accuracy for a subject with no attempts", () => {
    const result = buildResult({
      subjects: [{ subject: "Science", total: 3, correct: 0, wrong: 0, skipped: 3 }],
    });
    const performance = calculateSubjectPerformance(result);
    expect(performance[0].accuracy).toBe(0);
    expect(performance[0].score).toBe(0);
  });
});
