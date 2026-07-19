import type { Exam, StudentResult, TrendingExam } from "@/types/domain";

export const mockTrendingExam: TrendingExam = {
  id: "osssc-ri-ari-2026",
  label: "TRENDING",
  title: "OSSSC RI / ARI Answer Key Released",
  description: "Analyze your response sheet and check your score and community rank.",
  ctaLabel: "Check Now",
  ctaHref: "/analyzer",
  active: true,
};

export const mockExam: Exam = {
  id: "osssc-ri-ari-2026",
  name: "OSSSC RI / ARI Recruitment Examination 2026",
  post: "Revenue Inspector / Assistant Revenue Inspector",
  category: "government",
  answerKeyReleased: true,
};

/**
 * Module-level in-memory store standing in for the `student_results`
 * Supabase table during Phase 1. Resets on server restart — acceptable
 * for a Phase 1 demo since no production data depends on it yet.
 */
export const studentResultsStore = new Map<string, StudentResult>();
