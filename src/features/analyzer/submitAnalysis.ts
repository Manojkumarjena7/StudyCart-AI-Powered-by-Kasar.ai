"use server";

import { randomUUID } from "crypto";
import type { AnalyzerInput, StudentResult } from "@/types/domain";
import { parseAnalyzerInput } from "@/features/parser/parserEngine";
import { ParserError } from "@/features/parser/security/errors";
import { calculateScoreSummary, calculateSubjectPerformance } from "@/features/scoring/scoringEngine";
import { calculateRanking } from "@/features/ranking/rankingService";
import { studentResultsRepository } from "@/lib/supabase/repositories/studentResults.repository";
import type { SubmitAnalysisPayload, SubmitAnalysisResult } from "./types";

function slugifyExamName(examName: string | undefined): string {
  if (!examName) return "unknown-exam";
  return (
    examName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "unknown-exam"
  );
}

/**
 * Orchestrates the full analyzer pipeline. This is the single place
 * that wires parser -> scoring -> ranking -> repository together, so
 * each layer can be developed, tested, and later swapped independently.
 *
 * Any parsing failure (unsupported source, fetch/security rejection,
 * extraction failure, unknown marking scheme, etc.) surfaces as a
 * plain, student-facing message — never a stack trace, and never a
 * silent fallback to mock/random data.
 */
export async function submitAnalysis(payload: SubmitAnalysisPayload): Promise<SubmitAnalysisResult> {
  try {
    if (!payload.consentGiven) {
      return { ok: false, error: "Consent is required to analyze your result." };
    }
    if (payload.sourceType === "url" && !payload.url) {
      return { ok: false, error: "Please provide a response sheet URL." };
    }
    if (payload.sourceType === "pdf" && !payload.file) {
      return { ok: false, error: "Please upload a PDF response sheet." };
    }

    const analyzerInput: AnalyzerInput = {
      sourceType: payload.sourceType,
      url: payload.url,
      file: payload.file,
      category: payload.category,
      gender: payload.gender,
      consentGiven: payload.consentGiven,
    };

    // Parsing happens fully in-memory; the source PDF/URL itself is
    // never written to storage (privacy requirement).
    const normalized = await parseAnalyzerInput(analyzerInput);

    const scoreSummary = calculateScoreSummary(normalized);
    const subjectPerformance = calculateSubjectPerformance(normalized);
    const ranking = calculateRanking(scoreSummary, payload.category, payload.gender);

    const studentResult: StudentResult = {
      id: randomUUID(),
      examId: slugifyExamName(normalized.exam.examName),
      examName: normalized.exam.examName ?? "Unknown Examination",
      candidate: normalized.candidate,
      exam: normalized.exam,
      scoreSummary,
      subjectPerformance,
      questions: normalized.questions,
      ranking,
      consentGiven: payload.consentGiven,
      createdAt: new Date().toISOString(),
    };

    await studentResultsRepository.save(studentResult);

    return { ok: true, resultId: studentResult.id };
  } catch (error) {
    if (error instanceof ParserError) {
      // Log the technical detail server-side only; the student sees userMessage.
      console.error(`submitAnalysis failed [${error.code}]`, error.message);
      return { ok: false, error: error.userMessage };
    }

    console.error("submitAnalysis failed with an unexpected error", error);
    return {
      ok: false,
      error: "Something went wrong while analyzing your result. Please try again.",
    };
  }
}
