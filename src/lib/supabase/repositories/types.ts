import type { Exam, StudentResult, TrendingExam } from "@/types/domain";

export interface ExamsRepository {
  getById(examId: string): Promise<Exam | null>;
  listAnswerKeyReleased(): Promise<Exam[]>;
}

export interface StudentResultsRepository {
  save(result: StudentResult): Promise<StudentResult>;
  getById(resultId: string): Promise<StudentResult | null>;
}

export interface TrendingExamsRepository {
  getActive(): Promise<TrendingExam | null>;
}
