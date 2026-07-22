// Core domain types for the StudyCart student platform.
// These types are intentionally shared/generic so future modules
// (Jobs, Books, Tuition, Question Bank, Mock Tests) can reuse them
// without re-modelling exam/candidate concepts from scratch.

export type Category = "General" | "SEBC" | "SC" | "ST";

export type Gender = "Male" | "Female" | "Prefer Not to Say";

export type QuestionOutcome = "correct" | "wrong" | "skipped";

/** Candidate details, extracted automatically — never hand-entered. */
export interface CandidateInfo {
  name?: string;
  rollNumber?: string;
  applicationNumber?: string;
  category?: Category;
  gender?: Gender;
}

/** Exam metadata, extracted automatically from the source document/URL. */
export interface ExamInfo {
  examName?: string;
  post?: string;
  examDate?: string;
  shift?: string;
  centre?: string;
  paperLanguage?: string;
  totalQuestions?: number;
  markingScheme?: {
    positiveMarksPerQuestion: number;
    negativeMarksPerQuestion: number;
  };
}

export interface QuestionResult {
  questionNumber: number;
  subject: string;
  outcome: QuestionOutcome;
  marksAwarded: number;
  /** Optional richer extraction fields (populated by real parsers when available). */
  questionId?: string;
  questionText?: string;
  options?: string[];
  selectedAnswer?: string;
  correctAnswer?: string;
}

export interface SubjectBlock {
  subject: string;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
}

/** The single normalized shape every parser adapter must resolve to. */
export interface NormalizedResult {
  candidate: CandidateInfo;
  exam: ExamInfo;
  questions: QuestionResult[];
  subjects: SubjectBlock[];
}

export interface ScoreSummary {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number; // percentage, 0-100
  positiveMarks: number;
  negativeMarks: number;
  finalScore: number;
}

export interface SubjectPerformance extends SubjectBlock {
  accuracy: number;
  score: number;
}

export interface RankingResult {
  overallRank: number;
  totalCandidates: number;
  categoryRank?: number;
  categoryTotalCandidates?: number;
  genderRank?: number;
  genderTotalCandidates?: number;
}

/** The persisted, minimal record used for community ranking + result display. */
export interface StudentResult {
  id: string;
  examId: string;
  examName: string;
  candidate: CandidateInfo;
  exam: ExamInfo;
  scoreSummary: ScoreSummary;
  subjectPerformance: SubjectPerformance[];
  /** Per-question detail, used by the detailed analysis page. */
  questions: QuestionResult[];
  ranking: RankingResult;
  consentGiven: boolean;
  createdAt: string;
}

export interface TrendingExam {
  id: string;
  label: string; // e.g. "TRENDING"
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
}

export interface Exam {
  id: string;
  name: string;
  post?: string;
  category: "government" | "private";
  answerKeyReleased: boolean;
}

/** Input the user submits on the analyzer form, before parsing. */
export interface AnalyzerInput {
  sourceType: "url" | "pdf";
  url?: string;
  file?: File;
  category: Category;
  gender?: Gender;
  consentGiven: boolean;
}

export const PROCESSING_STEPS = [
  "Reading response sheet",
  "Detecting examination",
  "Extracting candidate information",
  "Reading questions",
  "Checking responses",
  "Calculating positive marks",
  "Calculating negative marks",
  "Preparing performance report",
] as const;
