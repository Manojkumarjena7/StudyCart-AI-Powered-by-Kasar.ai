import type { ParserAdapter } from "./parserAdapter";
import type { AnalyzerInput, NormalizedResult, QuestionResult } from "@/types/domain";

/**
 * Phase 1 stand-in for the real universal parser. It does NOT read the
 * actual uploaded PDF or fetch the actual URL — the real parsing pipeline
 * (DigiAlm / TCS iON / PDF / Generic HTML adapters) is not implemented yet.
 *
 * This adapter always "succeeds" so the rest of the product flow
 * (scoring, ranking, result page) can be built and demoed end-to-end
 * against realistic data.
 */
export const mockUniversalParser: ParserAdapter = {
  id: "mock-universal",
  name: "Mock Universal Parser (Phase 1)",
  canHandle(): boolean {
    return true;
  },
  async parse(input: AnalyzerInput): Promise<NormalizedResult> {
    // Simulate processing latency for a realistic feel.
    await new Promise((resolve) => setTimeout(resolve, 300));

    const subjects = ["General Studies", "Reasoning", "Odisha GK", "English", "Mathematics"];
    const questionsPerSubject = 20;
    const questions: QuestionResult[] = [];

    let qNum = 1;
    for (const subject of subjects) {
      for (let i = 0; i < questionsPerSubject; i++) {
        const roll = Math.random();
        const outcome = roll < 0.62 ? "correct" : roll < 0.85 ? "wrong" : "skipped";
        questions.push({
          questionNumber: qNum++,
          subject,
          outcome,
          marksAwarded: outcome === "correct" ? 1 : outcome === "wrong" ? -0.25 : 0,
        });
      }
    }

    const subjectBlocks = subjects.map((subject) => {
      const subjectQuestions = questions.filter((q) => q.subject === subject);
      return {
        subject,
        total: subjectQuestions.length,
        correct: subjectQuestions.filter((q) => q.outcome === "correct").length,
        wrong: subjectQuestions.filter((q) => q.outcome === "wrong").length,
        skipped: subjectQuestions.filter((q) => q.outcome === "skipped").length,
      };
    });

    return {
      candidate: {
        name: "Candidate " + Math.random().toString(36).slice(2, 6).toUpperCase(),
        rollNumber: "OSSSC" + Math.floor(100000 + Math.random() * 900000),
        category: input.category,
        gender: input.gender,
      },
      exam: {
        examName: "OSSSC RI / ARI Recruitment Examination 2026",
        post: "Revenue Inspector / Assistant Revenue Inspector",
        examDate: "2026-05-18",
        shift: "Shift 1 (10:00 AM - 12:00 PM)",
        centre: "Bhubaneswar Examination Centre - 14",
        paperLanguage: "English / Odia",
        totalQuestions: questions.length,
        markingScheme: {
          positiveMarksPerQuestion: 1,
          negativeMarksPerQuestion: 0.25,
        },
      },
      questions,
      subjects: subjectBlocks,
    };
  },
};
