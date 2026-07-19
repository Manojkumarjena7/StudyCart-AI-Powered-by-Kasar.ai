import type { NormalizedResult, QuestionResult, SubjectBlock } from "@/types/domain";
import type { ExtractedDigiAlmResult } from "./extractor";
import { resolveMarkingScheme } from "../../shared/markingScheme";

function buildSubjectBlocks(questions: QuestionResult[]): SubjectBlock[] {
  const bySubject = new Map<string, SubjectBlock>();

  for (const q of questions) {
    const block = bySubject.get(q.subject) ?? {
      subject: q.subject,
      total: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
    };
    block.total += 1;
    if (q.outcome === "correct") block.correct += 1;
    else if (q.outcome === "wrong") block.wrong += 1;
    else block.skipped += 1;

    bySubject.set(q.subject, block);
  }

  return [...bySubject.values()];
}

/**
 * Converts DigiAlm-specific extraction output into the shared
 * NormalizedResult type. This is the only place that needs to change
 * if DigiAlm's page structure changes — the scoring engine downstream
 * never sees anything DigiAlm-specific.
 */
export function normalizeDigiAlmResult(extracted: ExtractedDigiAlmResult): NormalizedResult {
  const markingScheme = resolveMarkingScheme(extracted.exam.examName, extracted.markingScheme);

  const positivePerQuestion = markingScheme.positiveMarksPerQuestion;
  const negativePerQuestion = markingScheme.negativeMarksPerQuestion;

  const questions: QuestionResult[] = extracted.questions.map((q) => ({
    questionNumber: q.questionNumber,
    subject: q.subject,
    outcome: q.outcome,
    marksAwarded:
      q.outcome === "correct" ? positivePerQuestion : q.outcome === "wrong" ? -negativePerQuestion : 0,
    questionId: q.questionId,
    questionText: q.questionText,
    options: q.options.length > 0 ? q.options : undefined,
    selectedAnswer: q.selectedAnswer,
    correctAnswer: q.correctAnswer,
  }));

  const subjects = buildSubjectBlocks(questions);

  return {
    candidate: {
      name: extracted.candidate.name,
      rollNumber: extracted.candidate.rollNumber,
      applicationNumber: extracted.candidate.applicationNumber,
    },
    exam: {
      examName: extracted.exam.examName,
      post: extracted.exam.post,
      examDate: extracted.exam.examDate,
      shift: extracted.exam.shift,
      centre: extracted.exam.centre,
      paperLanguage: extracted.exam.paperLanguage,
      totalQuestions: questions.length,
      markingScheme,
    },
    questions,
    subjects,
  };
}
