import type { Category, Gender } from "@/types/domain";

export interface SubmitAnalysisPayload {
  sourceType: "url" | "pdf";
  url?: string;
  file?: File; // Real PDF file content — Next.js Server Actions support File args directly.
  category: Category;
  gender?: Gender;
  consentGiven: boolean;
}

export interface SubmitAnalysisResult {
  ok: boolean;
  resultId?: string;
  error?: string;
}
