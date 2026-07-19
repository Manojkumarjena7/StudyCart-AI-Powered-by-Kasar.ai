import { ParserError } from "../../security/errors";
import type { MarkingScheme } from "../../shared/markingScheme";

export interface ExtractedCandidate {
  name?: string;
  rollNumber?: string;
  applicationNumber?: string;
}

export interface ExtractedExam {
  examName?: string;
  post?: string;
  examDate?: string;
  shift?: string;
  centre?: string;
  paperLanguage?: string;
}

export type ExtractedOutcome = "correct" | "wrong" | "skipped";

export interface ExtractedQuestion {
  questionNumber: number;
  questionText?: string;
  subject: string;
  options: string[];
  selectedAnswer?: string;
  correctAnswer?: string;
  outcome: ExtractedOutcome;
}

export interface ExtractedPdfResult {
  candidate: ExtractedCandidate;
  exam: ExtractedExam;
  questions: ExtractedQuestion[];
  markingScheme: MarkingScheme | null;
}

const DEFAULT_SUBJECT = "General";

/**
 * Response-sheet PDFs from different exam boards vary hugely in layout,
 * but the ones that are text-based (not scanned images) consistently
 * use "Label : Value" lines for candidate/exam metadata and a repeating
 * "Q<number> ... Your Answer ... Correct Answer" block shape for
 * questions. This extractor works from that generic line structure
 * rather than any one exam's specific wording, mirroring the approach
 * used for DigiAlm's HTML structure.
 */

const LABEL_VALUE_LINE = /^([A-Za-z][A-Za-z .\/()-]{1,40}?)\s*[:.]\s*(.+)$/;

function buildLabelValueMap(lines: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of lines) {
    const match = line.match(LABEL_VALUE_LINE);
    if (!match) continue;
    const label = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (label && value && !map.has(label)) {
      map.set(label, value);
    }
  }
  return map;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findLabelValue(map: Map<string, string>, ...candidates: string[]): string | undefined {
  for (const candidate of candidates) {
    const match = map.get(candidate.toLowerCase());
    if (match) return match;
  }
  for (const [label, value] of map.entries()) {
    const isFuzzyMatch = candidates.some((c) => {
      const pattern = new RegExp(`\\b${escapeRegExp(c.toLowerCase())}\\b`);
      return pattern.test(label);
    });
    if (isFuzzyMatch) return value;
  }
  return undefined;
}

function extractCandidate(map: Map<string, string>): ExtractedCandidate {
  return {
    name: findLabelValue(map, "candidate name", "participant name", "name"),
    rollNumber: findLabelValue(map, "roll no", "roll number", "registration no", "registration number"),
    applicationNumber: findLabelValue(map, "application no", "application number"),
  };
}

function extractExam(map: Map<string, string>): ExtractedExam {
  return {
    examName: findLabelValue(map, "exam name", "test name", "examination name", "subject"),
    post: findLabelValue(map, "post name", "post applied for", "post"),
    examDate: findLabelValue(map, "test date", "exam date", "date"),
    shift: findLabelValue(map, "test time", "shift", "session"),
    centre: findLabelValue(map, "test center name", "test centre name", "centre name", "exam centre"),
    paperLanguage: findLabelValue(map, "medium", "question paper language", "language"),
  };
}

const QUESTION_START = /^Q(?:uestion)?\.?\s*[-:.]?\s*(\d+)\b/i;
const SECTION_LINE = /^(?:section|subject)\s*[:.]?\s*(.+)$/i;
const YOUR_ANSWER_LINE = /^(?:your|chosen|selected)\s*answer\s*[:.]?\s*(.*)$/i;
const CORRECT_ANSWER_LINE = /^correct\s*answer\s*[:.]?\s*(.*)$/i;
const STATUS_LINE = /^status\s*[:.]?\s*(.+)$/i;
const OPTION_LINE = /^(?:\(?[A-Da-d1-4]\)?[).])\s*(.+)$/;
const NOT_ANSWERED_PATTERN = /not\s*answered|un-?attempted|^-?$/i;

/**
 * Scans the plain-text lines for repeating question blocks. Nothing here
 * assumes a fixed question count, fixed subject list, or fixed number of
 * options — every value is read from the text itself.
 */
function extractQuestions(lines: string[]): ExtractedQuestion[] {
  const questions: ExtractedQuestion[] = [];
  let currentSubject = DEFAULT_SUBJECT;

  let current: {
    questionNumber: number;
    subject: string;
    textLines: string[];
    options: string[];
    selectedAnswer?: string;
    correctAnswer?: string;
    status?: string;
  } | null = null;

  function flush() {
    if (!current) return;
    const questionText = current.textLines.join(" ").trim() || undefined;

    let outcome: ExtractedOutcome;
    const selected = current.selectedAnswer?.trim();
    const correct = current.correctAnswer?.trim();
    const status = current.status?.toLowerCase() ?? "";

    if (!selected || NOT_ANSWERED_PATTERN.test(selected) || /not\s*answered/i.test(status)) {
      outcome = "skipped";
    } else if (correct && selected.toLowerCase() === correct.toLowerCase()) {
      outcome = "correct";
    } else if (/correct/i.test(status) && !/incorrect|wrong/i.test(status)) {
      outcome = "correct";
    } else {
      outcome = "wrong";
    }

    questions.push({
      questionNumber: current.questionNumber,
      questionText,
      subject: current.subject,
      options: current.options,
      selectedAnswer: selected && !NOT_ANSWERED_PATTERN.test(selected) ? selected : undefined,
      correctAnswer: correct,
      outcome,
    });
    current = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const sectionMatch = line.match(SECTION_LINE);
    if (sectionMatch && !QUESTION_START.test(line)) {
      currentSubject = sectionMatch[1].trim();
      continue;
    }

    const questionMatch = line.match(QUESTION_START);
    if (questionMatch) {
      flush();
      current = {
        questionNumber: Number(questionMatch[1]),
        subject: currentSubject,
        textLines: [line.replace(QUESTION_START, "").trim()].filter(Boolean),
        options: [],
      };
      continue;
    }

    if (!current) continue; // ignore preamble/metadata lines before the first question

    const yourAnswerMatch = line.match(YOUR_ANSWER_LINE);
    if (yourAnswerMatch) {
      current.selectedAnswer = yourAnswerMatch[1];
      continue;
    }

    const correctAnswerMatch = line.match(CORRECT_ANSWER_LINE);
    if (correctAnswerMatch) {
      current.correctAnswer = correctAnswerMatch[1];
      continue;
    }

    const statusMatch = line.match(STATUS_LINE);
    if (statusMatch) {
      current.status = statusMatch[1];
      continue;
    }

    const optionMatch = line.match(OPTION_LINE);
    if (optionMatch) {
      current.options.push(optionMatch[1].trim());
      continue;
    }

    // Otherwise treat as continuation of the question text.
    current.textLines.push(line);
  }
  flush();

  return questions;
}

const POSITIVE_MARK_PATTERNS = [
  /correct\s+answer\s+will\s+carry\s+([\d.]+)\s*marks?/i,
  /each\s+(?:correct\s+)?(?:answer|question)\s+(?:carries|is\s+worth)\s+([\d.]+)\s*marks?/i,
];
const NEGATIVE_MARK_PATTERNS = [
  /incorrect\s+answer\s+will\s+carry\s+([\d.]+)\s*(?:negative\s*)?marks?/i,
  /([\d.]+)\s*marks?\s+(?:will\s+be\s+)?deduct/i,
];

function extractMarkingScheme(fullText: string): MarkingScheme | null {
  const normalized = fullText.replace(/\s+/g, " ");
  const positiveMatch = POSITIVE_MARK_PATTERNS.map((p) => normalized.match(p)).find(Boolean);
  const negativeMatch = NEGATIVE_MARK_PATTERNS.map((p) => normalized.match(p)).find(Boolean);

  if (positiveMatch) {
    return {
      positiveMarksPerQuestion: Number(positiveMatch[1]),
      negativeMarksPerQuestion: negativeMatch ? Number(negativeMatch[1]) : 0,
    };
  }
  return null;
}

export function extractPdfResult(pdfText: string): ExtractedPdfResult {
  if (!pdfText || pdfText.trim().length === 0) {
    throw new ParserError(
      "PARSING_FAILED",
      "We couldn't extract your result from this response sheet. Please try again or contact support.",
      "PDF text extraction returned empty content — likely a scanned/image-only PDF with no text layer."
    );
  }

  const lines = pdfText.split(/\r?\n/);
  const labelValueMap = buildLabelValueMap(lines);
  const candidate = extractCandidate(labelValueMap);
  const exam = extractExam(labelValueMap);
  const questions = extractQuestions(lines);
  const markingScheme = extractMarkingScheme(pdfText);

  if (questions.length === 0) {
    throw new ParserError(
      "PARSING_FAILED",
      "We couldn't extract your result from this response sheet. Please try again or contact support.",
      "PDF extractor found 0 question blocks — PDF layout may not match a supported response-sheet structure."
    );
  }

  return { candidate, exam, questions, markingScheme };
}
