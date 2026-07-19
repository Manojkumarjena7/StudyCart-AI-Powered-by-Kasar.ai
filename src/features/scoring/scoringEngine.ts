import type { NormalizedResult, ScoreSummary, SubjectPerformance } from "@/types/domain";

/** Calculates the overall score summary from a normalized parser result. */
export function calculateScoreSummary(result: NormalizedResult): ScoreSummary {
  const { questions } = result;
  const correct = questions.filter((q) => q.outcome === "correct").length;
  const wrong = questions.filter((q) => q.outcome === "wrong").length;
  const skipped = questions.filter((q) => q.outcome === "skipped").length;
  const attempted = correct + wrong;
  const totalQuestions = questions.length;

  const positivePerQuestion = result.exam.markingScheme?.positiveMarksPerQuestion ?? 1;
  const negativePerQuestion = result.exam.markingScheme?.negativeMarksPerQuestion ?? 0;

  const positiveMarks = correct * positivePerQuestion;
  const negativeMarks = wrong * negativePerQuestion;
  const finalScore = Number((positiveMarks - negativeMarks).toFixed(2));

  const accuracy = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(2)) : 0;

  return {
    totalQuestions,
    attempted,
    correct,
    wrong,
    skipped,
    accuracy,
    positiveMarks: Number(positiveMarks.toFixed(2)),
    negativeMarks: Number(negativeMarks.toFixed(2)),
    finalScore,
  };
}

/** Calculates per-subject performance breakdown. */
export function calculateSubjectPerformance(result: NormalizedResult): SubjectPerformance[] {
  const positivePerQuestion = result.exam.markingScheme?.positiveMarksPerQuestion ?? 1;
  const negativePerQuestion = result.exam.markingScheme?.negativeMarksPerQuestion ?? 0;

  return result.subjects.map((subject) => {
    const attempted = subject.correct + subject.wrong;
    const accuracy = attempted > 0 ? Number(((subject.correct / attempted) * 100).toFixed(2)) : 0;
    const score = Number(
      (subject.correct * positivePerQuestion - subject.wrong * negativePerQuestion).toFixed(2)
    );
    return { ...subject, accuracy, score };
  });
}
