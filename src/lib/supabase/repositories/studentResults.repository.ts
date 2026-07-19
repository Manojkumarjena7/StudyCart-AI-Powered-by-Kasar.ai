import type { StudentResultsRepository } from "./types";
import type { StudentResult } from "@/types/domain";
import { readStudentResult, writeStudentResult } from "./fileStore";

/**
 * Phase 1 implementation for the `student_results` table stand-in,
 * backed by a local JSON file (see fileStore.ts for why). Only minimal,
 * anonymized result data is stored — never the source PDF or
 * response-sheet URL — per the platform's privacy requirements.
 *
 * Swap this for a Supabase-backed implementation (querying the real
 * `student_results` table) once the project is connected; the
 * `StudentResultsRepository` interface stays identical.
 */
export const studentResultsRepository: StudentResultsRepository = {
  async save(result: StudentResult): Promise<StudentResult> {
    writeStudentResult(result);
    return result;
  },
  async getById(resultId: string): Promise<StudentResult | null> {
    return readStudentResult(resultId);
  },
};
