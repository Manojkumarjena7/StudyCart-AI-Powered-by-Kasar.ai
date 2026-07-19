import type { TrendingExamsRepository } from "./types";
import type { TrendingExam } from "@/types/domain";
import { mockTrendingExam } from "./mockData";

/** In-memory implementation for Phase 1 (`trending_exams` table stand-in). */
export const trendingExamsRepository: TrendingExamsRepository = {
  async getActive(): Promise<TrendingExam | null> {
    return mockTrendingExam.active ? mockTrendingExam : null;
  },
};
