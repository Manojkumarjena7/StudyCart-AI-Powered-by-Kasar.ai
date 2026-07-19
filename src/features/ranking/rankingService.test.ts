import { describe, it, expect } from "vitest";
import { calculateRanking } from "./rankingService";
import type { ScoreSummary } from "@/types/domain";

function summary(finalScore: number): ScoreSummary {
  return {
    totalQuestions: 100,
    attempted: 100,
    correct: 80,
    wrong: 20,
    skipped: 0,
    accuracy: 80,
    positiveMarks: 80,
    negativeMarks: 5,
    finalScore,
  };
}

describe("calculateRanking", () => {
  it("always returns a rank within the total candidate pool", () => {
    const ranking = calculateRanking(summary(70));
    expect(ranking.overallRank).toBeGreaterThanOrEqual(1);
    expect(ranking.totalCandidates).toBeGreaterThan(0);
  });

  it("only includes categoryRank when a category is provided", () => {
    const withCategory = calculateRanking(summary(70), "General");
    const withoutCategory = calculateRanking(summary(70));
    expect(withCategory.categoryRank).toBeDefined();
    expect(withoutCategory.categoryRank).toBeUndefined();
  });

  it("only includes genderRank when a gender is provided", () => {
    const withGender = calculateRanking(summary(70), undefined, "Female");
    const withoutGender = calculateRanking(summary(70));
    expect(withGender.genderRank).toBeDefined();
    expect(withoutGender.genderRank).toBeUndefined();
  });

  it("never returns a rank below 1, even for a very low score", () => {
    const ranking = calculateRanking(summary(0), "SC", "Male");
    expect(ranking.overallRank).toBeGreaterThanOrEqual(1);
    expect(ranking.categoryRank).toBeGreaterThanOrEqual(1);
    expect(ranking.genderRank).toBeGreaterThanOrEqual(1);
  });
});
