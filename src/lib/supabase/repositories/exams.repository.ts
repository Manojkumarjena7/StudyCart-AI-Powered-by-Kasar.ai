import type { ExamsRepository } from "./types";
import type { Exam } from "@/types/domain";
import { mockExam } from "./mockData";

/**
 * In-memory implementation for Phase 1. Swap for a Supabase-backed
 * implementation (querying the `exams` table) once the project is
 * connected — the interface stays identical.
 */
export const examsRepository: ExamsRepository = {
  async getById(examId: string): Promise<Exam | null> {
    return examId === mockExam.id ? mockExam : null;
  },
  async listAnswerKeyReleased(): Promise<Exam[]> {
    return mockExam.answerKeyReleased ? [mockExam] : [];
  },
};
