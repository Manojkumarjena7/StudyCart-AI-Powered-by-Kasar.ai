import { ParserError } from "../../security/errors";
import type { MarkingScheme } from "../../shared/markingScheme";
import type { ColoredOptionRun } from "./colorExtractor";

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
  questionId?: string;
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
 * Response-sheet PDFs from different exam boards vary in layout. This
 * extractor targets the confirmed real structure (verified against a
 * real sample PDF, 2026-07): "Label : Value" lines for candidate/exam
 * metadata, "Q.<n>" question headers, numbered options ("1. text" .. "4.
 * text"), and a per-question metadata block with "Question ID",
 * "Status", and a numeric "Chosen Option : N" (or "--") field — the
 * same shape used by the DigiAlm HTML parser, since this vendor's PDF
 * export mirrors its HTML response-sheet layout. Older/other PDF
 * formats that instead print "Your Answer :" / "Correct Answer :" text
 * labels are still supported as a fallback.
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

const KNOWN_LABEL_PATTERNS: { key: string; pattern: RegExp }[] = [
  { key: "rollNo", pattern: /Roll\s*No\.?/i },
  { key: "applicationNo", pattern: /Application\s*No\.?/i },
  { key: "participantName", pattern: /Participant\s*Name/i },
  { key: "candidateName", pattern: /Candidate\s*Name/i },
  { key: "testCenterName", pattern: /Test\s*Cent(?:er|re)\s*Name/i },
  { key: "testDate", pattern: /Test\s*Date/i },
  { key: "testTime", pattern: /Test\s*Time/i },
  { key: "subject", pattern: /Subject/i },
];
const METADATA_BLOCK_END_PATTERN = /Application\s*Photograph|Registration\s*photograph|\*\s*Note/i;

/**
 * Some PDF exports wrap a label onto its own line, separate from its
 * value (e.g. "Participant" on one line, "Name MANOJ KUMAR JENA" on the
 * next) — no colon separates them at all, so simple per-line "Label :
 * Value" matching misses them. This scans the whole candidate/exam
 * metadata region as one flattened blob instead: newlines are collapsed
 * to spaces, each known label's position is located, and the value is
 * whatever text falls between that label and the next known label (or
 * the end of the metadata block).
 */
function extractKnownLabelValues(pdfText: string): Map<string, string> {
  const flat = pdfText.replace(/\r?\n/g, " ").replace(/\s+/g, " ");
  const endBoundaryMatch = flat.match(METADATA_BLOCK_END_PATTERN);
  const blockEnd = endBoundaryMatch?.index ?? flat.length;

  const matches: { key: string; start: number; end: number }[] = [];
  for (const { key, pattern } of KNOWN_LABEL_PATTERNS) {
    const match = flat.match(pattern);
    if (match && match.index !== undefined && match.index < blockEnd) {
      matches.push({ key, start: match.index, end: match.index + match[0].length });
    }
  }
  matches.sort((a, b) => a.start - b.start);

  const values = new Map<string, string>();
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const nextStart = matches[i + 1]?.start ?? blockEnd;
    const rawValue = flat.slice(current.end, nextStart).replace(/^[:.\s]+/, "").trim();
    if (rawValue) values.set(current.key, rawValue);
  }
  return values;
}

function extractCandidate(map: Map<string, string>, known: Map<string, string>): ExtractedCandidate {
  return {
    name: known.get("participantName") ?? known.get("candidateName") ?? findLabelValue(map, "participant name", "candidate name", "name"),
    rollNumber: known.get("rollNo") ?? findLabelValue(map, "roll no", "roll number", "registration no", "registration number"),
    applicationNumber: known.get("applicationNo") ?? findLabelValue(map, "application no", "application number"),
  };
}

function extractExam(map: Map<string, string>, known: Map<string, string>): ExtractedExam {
  return {
    examName: known.get("subject") ?? findLabelValue(map, "subject", "exam name", "test name", "examination name"),
    post: findLabelValue(map, "post name", "post applied for", "post"),
    examDate: known.get("testDate") ?? findLabelValue(map, "test date", "exam date"),
    shift: known.get("testTime") ?? findLabelValue(map, "test time", "shift", "session"),
    centre:
      known.get("testCenterName") ??
      findLabelValue(map, "test center name", "test centre name", "centre name", "exam centre"),
    paperLanguage: findLabelValue(map, "medium", "question paper language", "language"),
  };
}

const QUESTION_START = /^Q\.?\s*(\d+)\b/i;
const SECTION_LINE = /^Section\s*:\s*(.+)$/i;
const OPTION_NUMBERED_LINE = /^\s*([1-4])[.)]\s*(.+)$/;
const QUESTION_ID_PATTERN = /Question\s*ID\s*[:.]?\s*([\w-]+)/i;
const CHOSEN_OPTION_PATTERN = /Chosen\s*Option\s*[:\-]?\s*(\d|--|-)/i;
const STATUS_PATTERN = /Status\s*[:\-]?\s*([^\n]+)/i;
const NOT_ANSWERED_STATUS_PATTERN = /not\s*answered|un-?attempted/i;

// Fallback patterns for older/other PDF formats that print the answer
// as text labels rather than a numbered "Chosen Option".
const YOUR_ANSWER_LINE = /^(?:your|chosen|selected)\s*answer\s*[:.]?\s*(.*)$/i;
const CORRECT_ANSWER_LINE = /^correct\s*answer\s*[:.]?\s*(.*)$/i;
const NOT_ANSWERED_VALUE_PATTERN = /not\s*answered|un-?attempted|^-?$/i;

interface QuestionBlock {
  questionNumber: number;
  subject: string;
  lines: string[];
}

/** Splits the page text into per-question blocks, tracking subject via "Section :" markers in document order. */
function splitIntoBlocks(lines: string[]): QuestionBlock[] {
  const blocks: QuestionBlock[] = [];
  let currentSubject = DEFAULT_SUBJECT;
  let current: QuestionBlock | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const sectionMatch = line.match(SECTION_LINE);
    if (sectionMatch) {
      currentSubject = sectionMatch[1].trim();
      continue;
    }

    const questionMatch = line.match(QUESTION_START);
    if (questionMatch) {
      current = { questionNumber: Number(questionMatch[1]), subject: currentSubject, lines: [line] };
      blocks.push(current);
      continue;
    }

    if (current) current.lines.push(line);
  }

  return blocks;
}

/**
 * Parses one question block into a normalized question, given a shared
 * cursor into the document's ordered colored-option-run list (used to
 * determine the objectively correct option — see colorExtractor.ts).
 */
function parseBlock(
  block: QuestionBlock,
  coloredRuns: ColoredOptionRun[],
  colorCursor: { index: number }
): ExtractedQuestion {
  const questionIdMatch = block.lines.join("\n").match(QUESTION_ID_PATTERN);

  const options: { number: number; text: string }[] = [];
  const textLines: string[] = [];
  let sawAns = false;

  for (const line of block.lines) {

  // Stop at page footer/instructions
  if (
    line.startsWith("Registration") ||
    line.startsWith("photograph") ||
    line.startsWith("* Note") ||
    line.includes("Correct Answer will carry") ||
    line.includes("Incorrect Answer will carry") ||
    line.includes("Options shown in green color") ||
    line.includes("Chosen option on the right") ||
    line.includes("cdn3.digialm.com") ||
    line.startsWith("http") ||
    /^--\s*\d+\s*of\s*\d+\s*--$/.test(line)
  ) {
    break;
  }

  // Handle "Ans 1. xxx"
  if (/^Ans\b/i.test(line)) {
    sawAns = true;

    const remainder = line.replace(/^Ans\b\s*/i, "");
    const inlineOptMatch = remainder.match(OPTION_NUMBERED_LINE);

    if (inlineOptMatch) {
      options.push({
        number: Number(inlineOptMatch[1]),
        text: inlineOptMatch[2].trim(),
      });
    }

    continue;
  }

  if (QUESTION_START.test(line)) {
    textLines.push(line.replace(QUESTION_START, "").trim());
    continue;
  }

  const optMatch = line.match(OPTION_NUMBERED_LINE);
  if (optMatch) {
    options.push({
      number: Number(optMatch[1]),
      text: optMatch[2].trim(),
    });
    continue;
  }

  if (
    QUESTION_ID_PATTERN.test(line) ||
    CHOSEN_OPTION_PATTERN.test(line) ||
    STATUS_PATTERN.test(line) ||
    /^Question\s*Type/i.test(line) ||
    /^Option\s*\d+\s*ID/i.test(line)
  ) {
    continue;
  }

  if (!sawAns) {
    textLines.push(line);
  }
}

  const questionText = textLines.join(" ").trim() || undefined;
  if (block.questionNumber === 2) {
  console.log("BLOCK LINES:");
  console.log(block.lines);
  console.log("---------------------------");
}
  // Determine the correct option: prefer color-derived data (this
  // vendor's PDFs render the correct option's text in green), matched
  // in document order against this block's own option count.
  let correctOptionNumber: number | undefined;
  let correctAnswerFromColor: string | undefined;
  if (options.length > 0 && colorCursor.index < coloredRuns.length) {
    const slice = coloredRuns.slice(colorCursor.index, colorCursor.index + options.length);
    const allNumbersMatch = slice.length === options.length && slice.every((r, i) => r.number === options[i].number);
    
    console.log("Question:", block.questionNumber);
    console.log("PDF Options:", options.map(o => o.number));
    console.log("Color Slice:", slice.map(s => ({
      number: s.number,
      correct: s.isCorrect,
      text: s.text
    })));
    console.log("Match:", allNumbersMatch);
    console.log("--------------------------------");

    if (allNumbersMatch) {
      colorCursor.index += options.length;
      const correctRun = slice.find((r) => r.isCorrect);
      if (correctRun) {
        correctOptionNumber = correctRun.number;
        correctAnswerFromColor = correctRun.text || options.find((o) => o.number === correctRun.number)?.text;
      }
    }
  }

  // Fallback for PDFs that print a "Correct Answer :" text label instead.
  let correctAnswer = correctAnswerFromColor;
  if (!correctAnswer) {
    const correctAnswerLine = block.lines.find((l) => CORRECT_ANSWER_LINE.test(l));
    const correctAnswerMatch = correctAnswerLine?.match(CORRECT_ANSWER_LINE);
    correctAnswer = correctAnswerMatch?.[1]?.trim() || undefined;
  }

  // Selected answer: prefer the numeric "Chosen Option" field (real,
  // confirmed structure); fall back to a "Your Answer :" text label.
  const chosenLine = block.lines.find((l) => CHOSEN_OPTION_PATTERN.test(l));
  const chosenMatch = chosenLine?.match(CHOSEN_OPTION_PATTERN);
  const chosenRaw = chosenMatch?.[1];
  const chosenOptionNumber = chosenRaw && /^\d$/.test(chosenRaw) ? Number(chosenRaw) : null;
  const selectedFromNumber = chosenOptionNumber
    ? options.find((o) => o.number === chosenOptionNumber)?.text
    : undefined;

  let selectedAnswer = selectedFromNumber;
  if (!selectedAnswer && chosenLine === undefined) {
    const yourAnswerLine = block.lines.find((l) => YOUR_ANSWER_LINE.test(l));
    const yourAnswerMatch = yourAnswerLine?.match(YOUR_ANSWER_LINE);
    const raw = yourAnswerMatch?.[1]?.trim();
    selectedAnswer = raw && !NOT_ANSWERED_VALUE_PATTERN.test(raw) ? raw : undefined;
  }

  const statusLine = block.lines.find((l) => STATUS_PATTERN.test(l));
  const statusMatch = statusLine?.match(STATUS_PATTERN);
  const statusText = statusMatch?.[1]?.trim() ?? "";

  let outcome: ExtractedOutcome;
  const hasChosenSignal = chosenLine !== undefined; // this PDF format has an explicit Chosen Option field
  if (hasChosenSignal) {
    if (chosenOptionNumber === null || NOT_ANSWERED_STATUS_PATTERN.test(statusText)) {
      outcome = "skipped";
    } else if (correctOptionNumber !== undefined && chosenOptionNumber === correctOptionNumber) {
      outcome = "correct";
    } else {
      outcome = "wrong";
    }
  } else {
    // Fallback text-label format.
    if (!selectedAnswer || NOT_ANSWERED_STATUS_PATTERN.test(statusText)) {
      outcome = "skipped";
    } else if (correctAnswer && selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      outcome = "correct";
    } else {
      outcome = "wrong";
    }
  }

  return {
    questionNumber: block.questionNumber,
    questionId: questionIdMatch?.[1],
    questionText,
    subject: block.subject,
    options: options.map((o) => o.text),
    selectedAnswer,
    correctAnswer,
    outcome,
  };
}

/**
 * Scans the plain-text lines for repeating question blocks. Nothing
 * here assumes a fixed question count, fixed subject list, or fixed
 * number of options — every value is read from the text itself.
 * `coloredRuns` (optional) supplies color-derived correctness data
 * extracted separately from the same PDF (see colorExtractor.ts); pass
 * an empty array to disable it and rely on text-label fallbacks only.
 */
function extractQuestions(lines: string[], coloredRuns: ColoredOptionRun[]): ExtractedQuestion[] {
  const blocks = splitIntoBlocks(lines);
  const colorCursor = { index: 0 };
  return blocks.map((block) => parseBlock(block, coloredRuns, colorCursor));
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

export function extractPdfResult(pdfText: string, coloredRuns: ColoredOptionRun[] = []): ExtractedPdfResult {
  if (!pdfText || pdfText.trim().length === 0) {
    throw new ParserError(
      "PARSING_FAILED",
      "We couldn't extract your result from this response sheet. Please try again or contact support.",
      "PDF text extraction returned empty content — likely a scanned/image-only PDF with no text layer."
    );
  }

  const lines = pdfText.split(/\r?\n/);
  const labelValueMap = buildLabelValueMap(lines);
  const knownLabelValues = extractKnownLabelValues(pdfText);
  const candidate = extractCandidate(labelValueMap, knownLabelValues);
  const exam = extractExam(labelValueMap, knownLabelValues);
  const questions = extractQuestions(lines, coloredRuns);
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
