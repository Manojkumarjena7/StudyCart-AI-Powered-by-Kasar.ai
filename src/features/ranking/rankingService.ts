import type { Category, Gender, RankingResult, ScoreSummary } from "@/types/domain";

/**
 * Phase 1 mock ranking. Real implementation will query the
 * student_results table in Supabase and compute a true percentile
 * rank among all results for the same exam.
 */
export function calculateRanking(
  scoreSummary: ScoreSummary,
  category?: Category,
  gender?: Gender
): RankingResult {
  const totalCandidates = 18542;

  // Higher score -> better (lower) rank, with a touch of pseudo-randomness
  // to feel realistic rather than perfectly linear.
  const percentile = Math.min(0.98, Math.max(0.02, scoreSummary.finalScore / 100));
  const jitter = Math.floor(Math.random() * 40) - 20;
  const overallRank = Math.max(1, Math.round(totalCandidates * (1 - percentile)) + jitter);

  const result: RankingResult = {
    overallRank,
    totalCandidates,
  };

  if (category) {
    const categoryTotalCandidates = Math.round(totalCandidates * 0.32);
    result.categoryTotalCandidates = categoryTotalCandidates;
    result.categoryRank = Math.max(
      1,
      Math.round(categoryTotalCandidates * (1 - percentile)) + Math.floor(jitter / 2)
    );
  }

  if (gender) {
    const genderTotalCandidates = Math.round(totalCandidates * 0.55);
    result.genderTotalCandidates = genderTotalCandidates;
    result.genderRank = Math.max(
      1,
      Math.round(genderTotalCandidates * (1 - percentile)) + Math.floor(jitter / 3)
    );
  }

  return result;
}
