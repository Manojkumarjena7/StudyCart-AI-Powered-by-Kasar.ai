import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
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
  questionId?: string;
  questionText?: string;
  subject: string;
  options: string[];
  selectedAnswer?: string;
  correctAnswer?: string;
  outcome: ExtractedOutcome;
}

export interface ExtractedDigiAlmResult {
  candidate: ExtractedCandidate;
  exam: ExtractedExam;
  questions: ExtractedQuestion[];
  markingScheme: MarkingScheme | null;
}

const DEFAULT_SUBJECT = "General";

/**
 * DigiAlm renders candidate/exam metadata as label/value pairs, most
 * commonly inside table rows (`<td>Label</td><td>: Value</td>`), but
 * sometimes as `<div>`/`<span>` pairs. We collect every label-like text
 * node on the page into a normalized map rather than hardcoding table
 * positions, so layout variations between exams/versions don't break
 * extraction.
 */
function extractLabelValueMap($: CheerioAPI): Map<string, string> {
  const map = new Map<string, string>();

  const rows = $("table tr");
  rows.each((_, row) => {
    const cells = $(row).find("td, th");
    if (cells.length < 2) return;

    const label = $(cells[0]).text().replace(/[:.\s]+$/g, "").trim();
    const value = $(cells[1])
      .text()
      .replace(/^[:\s]+/g, "")
      .trim();

    if (label && value) {
      map.set(label.toLowerCase(), value);
    }
  });

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
  // Fuzzy fallback: whole-word/phrase match only (word-boundary aware),
  // so a short candidate like "date" never matches inside an unrelated
  // word like "candidate".
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
    // "Participant Name" and "Roll No" are the labels verified against a
    // real DigiAlm response sheet; the older "Candidate Name"/"Roll Number"
    // variants are kept as fallbacks since vendor builds vary by exam.
    name: findLabelValue(map, "participant name", "candidate name", "name"),
    rollNumber: findLabelValue(map, "roll no", "roll number", "registration number", "registration no"),
    applicationNumber: findLabelValue(map, "application no", "application number"),
  };
}

function extractExam(map: Map<string, string>): ExtractedExam {
  return {
    // The real response sheet we verified against has no separate
    // "Exam Name" field — the "Subject" row carries the full exam/post
    // description instead, so it's checked first.
    examName: findLabelValue(map, "subject", "exam name", "test name", "examination name"),
    post: findLabelValue(map, "post name", "post applied for", "post"),
    examDate: findLabelValue(map, "test date", "exam date"),
    shift: findLabelValue(map, "test time", "shift", "session"),
    centre: findLabelValue(map, "test center name", "test centre name", "centre name", "exam centre"),
    paperLanguage: findLabelValue(map, "medium", "question paper language", "language"),
  };
}

/**
 * Ground truth confirmed from a real DigiAlm response sheet (RI_ANSWEKEY.pdf,
 * supplied 2026-07): each question's 4 options are numbered 1-4, and the
 * option that is objectively CORRECT is marked with a green tick icon —
 * this has nothing to do with what the candidate chose. The candidate's
 * actual answer is a separate field printed in the metadata box under
 * each question: "Chosen Option : <1-4 or -->". "Status" in that same box
 * describes attempt state (Answered / Not Answered / Marked For Review /
 * Not Attempted and Marked For Review), not correctness.
 *
 * So: correctness must NEVER be inferred from a CSS class guess. It is
 * strictly: (a) find which of the 4 numbered options has the tick icon,
 * (b) read the "Chosen Option" number, (c) compare the two numbers.
 */
const QUESTION_BLOCK_SELECTOR = ".question-pnl, .questionPnl, .question-container, div[id^='question']";
const TICK_ICON_PATTERN = /tick|check(mark)?/i;
const GREEN_COLOR_PATTERN =
  /color\s*:\s*(?:green|#0?[0-9a-f]?[89a-f][0-9a-f]?0[0-9a-f]?0|rgba?\(\s*0\s*,\s*1[0-9]{2}\s*,\s*0)/i;
const OPTION_NUMBERED_PATTERN = /^\s*([1-4])[.)]\s*([\s\S]+)$/;
const CHOSEN_OPTION_PATTERN = /chosen\s*option\s*[:\-]?\s*(\d|--|-)/i;
const STATUS_PATTERN = /status\s*[:\-]?\s*([^\n]+)/i;
const NOT_ANSWERED_STATUS_PATTERN = /not\s*answered|un-?attempted/i;
const SECTION_MARKER_PATTERN = /^Section\s*:\s*.+$/i;

/** Detects the green-tick-icon marker on a specific option element. */
function hasTickIcon($: CheerioAPI, el: cheerio.Cheerio<AnyNode>): boolean {
  const style = (el.attr("style") ?? "").toLowerCase();
  if (GREEN_COLOR_PATTERN.test(style)) return true;

  const iconMatch = el
    .find("img, svg, i")
    .addBack()
    .filter((_, node) => {
      const $node = $(node);
      const alt = ($node.attr("alt") ?? "").toLowerCase();
      const src = ($node.attr("src") ?? "").toLowerCase();
      const cls = ($node.attr("class") ?? "").toLowerCase();
      return TICK_ICON_PATTERN.test(alt) || TICK_ICON_PATTERN.test(src) || TICK_ICON_PATTERN.test(cls);
    });
  return iconMatch.length > 0;
}

interface ParsedOption {
  number: number;
  text: string;
  isCorrect: boolean;
}

/** Finds the 4 numbered option elements inside a question block. */
function parseOptions($: CheerioAPI, $block: cheerio.Cheerio<AnyNode>): ParsedOption[] {
  const candidates = $block.find("li, tr, td, div, span, p").filter((_, el) => {
    const $el = $(el);
    // Skip wrapper elements that merely contain a numbered option among
    // other nested content — we want the most specific element whose own
    // text is exactly "N. option text".
    const ownText = $el.clone().children().remove().end().text().trim();
    const fullText = $el.text().trim();
    return OPTION_NUMBERED_PATTERN.test(fullText) && fullText.length - ownText.length < 40;
  });

  const options: ParsedOption[] = [];
  const seenNumbers = new Set<number>();

  candidates.each((_, el) => {
    const $el = $(el);
    const match = $el.text().trim().match(OPTION_NUMBERED_PATTERN);
    if (!match) return;
    const number = Number(match[1]);
    if (seenNumbers.has(number)) return; // avoid double-counting nested matches
    seenNumbers.add(number);
    options.push({
      number,
      text: match[2].trim(),
      isCorrect: hasTickIcon($, $el),
    });
  });

  return options.sort((a, b) => a.number - b.number);
}

function extractQuestions($: CheerioAPI): ExtractedQuestion[] {
  const blocks = $(QUESTION_BLOCK_SELECTOR);

  // Section headers ("Section : Mathematics") are separate sibling
  // elements, not descendants of a question block, so subjects are
  // tracked by walking question blocks and section markers together in
  // document order rather than looking inside each block.
  const sectionMarkers = $("*").filter((_, el) => {
    const $el = $(el);
    if ($el.children().length > 0) return false;
    return SECTION_MARKER_PATTERN.test($el.text().trim());
  });

  const merged = blocks.add(sectionMarkers);
  const questions: ExtractedQuestion[] = [];
  let currentSubject = DEFAULT_SUBJECT;
  let questionNumber = 0;

  merged.each((_, node) => {
    const $node = $(node);

    if (SECTION_MARKER_PATTERN.test($node.text().trim()) && !$node.is(QUESTION_BLOCK_SELECTOR)) {
      currentSubject = $node.text().replace(/^Section\s*:\s*/i, "").trim();
      return;
    }

    const $block = $node;
    const blockText = $block.text();
    questionNumber += 1;

    const questionIdMatch = blockText.match(/Question\s*ID\s*[:.]?\s*([\w-]+)/i);

    const questionTextEl = $block.find(".question-text, .questionText, td.question").first();
    let questionText = questionTextEl.text().trim() || undefined;
    if (!questionText) {
      // Real structure: the question text is plain text following "Q.<n>"
      // up to the "Ans" row that introduces the options — no dedicated
      // class wraps it.
      const inlineMatch = blockText.match(/Q\.?\s*\d+\s+([\s\S]+?)\s*(?:Ans\b|$)/i);
      questionText = inlineMatch?.[1]?.trim() || undefined;
    }

    const parsedOptions = parseOptions($, $block);
    const options = parsedOptions.map((o) => o.text);
    const correctOption = parsedOptions.find((o) => o.isCorrect);
    const correctAnswer = correctOption?.text;

    const chosenMatch = blockText.match(CHOSEN_OPTION_PATTERN);
    const chosenRaw = chosenMatch?.[1];
    const chosenOptionNumber = chosenRaw && /^\d$/.test(chosenRaw) ? Number(chosenRaw) : null;
    const selectedOption = chosenOptionNumber
      ? parsedOptions.find((o) => o.number === chosenOptionNumber)
      : undefined;
    const selectedAnswer = selectedOption?.text;

    const statusMatch = blockText.match(STATUS_PATTERN);
    const statusText = statusMatch?.[1]?.trim() ?? "";

    let outcome: ExtractedOutcome;
    if (chosenOptionNumber === null || NOT_ANSWERED_STATUS_PATTERN.test(statusText)) {
      // "Chosen Option : --" (or an explicit not-answered status) means skipped.
      outcome = "skipped";
    } else if (correctOption && chosenOptionNumber === correctOption.number) {
      outcome = "correct";
    } else {
      outcome = "wrong";
    }

    questions.push({
      questionNumber,
      questionId: questionIdMatch?.[1],
      questionText,
      subject: currentSubject,
      options,
      selectedAnswer,
      correctAnswer,
      outcome,
    });
  });

  return questions;
}

/**
 * Some DigiAlm sheets print the marking scheme directly. Verified real
 * phrasing looks like:
 *   "Correct Answer will carry 1 mark per Question."
 *   "Incorrect Answer will carry 0.25 Negative mark per Question."
 * Older/other vendor builds have been seen phrasing it as "Each question
 * carries 1 mark... 0.25 marks will be deducted...", so both patterns
 * are tried. If neither is found, the caller falls back to the
 * configured per-exam scheme (see markingScheme.ts).
 */
function extractMarkingScheme($: CheerioAPI): MarkingScheme | null {
  const bodyText = $("body").text().replace(/\s+/g, " ");

  const positivePatterns = [
    /correct\s+answer\s+will\s+carry\s+([\d.]+)\s*marks?/i,
    /each\s+(?:correct\s+)?(?:answer|question)\s+(?:carries|is\s+worth)\s+([\d.]+)\s*marks?/i,
  ];
  const negativePatterns = [
    /incorrect\s+answer\s+will\s+carry\s+([\d.]+)\s*(?:negative\s*)?marks?/i,
    /([\d.]+)\s*marks?\s+(?:will\s+be\s+)?deduct/i,
  ];

  const positiveMatch = positivePatterns.map((p) => bodyText.match(p)).find(Boolean);
  const negativeMatch = negativePatterns.map((p) => bodyText.match(p)).find(Boolean);

  if (positiveMatch) {
    return {
      positiveMarksPerQuestion: Number(positiveMatch[1]),
      negativeMarksPerQuestion: negativeMatch ? Number(negativeMatch[1]) : 0,
    };
  }
  return null;
}

export function extractDigiAlmResult(html: string): ExtractedDigiAlmResult {
  const $ = cheerio.load(html);

  const labelValueMap = extractLabelValueMap($);
  const candidate = extractCandidate(labelValueMap);
  const exam = extractExam(labelValueMap);
  const questions = extractQuestions($);
  const markingScheme = extractMarkingScheme($);

  if (questions.length === 0) {
    throw new ParserError(
      "PARSING_FAILED",
      "We couldn't extract your result from this response sheet. Please try again or contact support.",
      "DigiAlm extractor found 0 question blocks — page structure may not match expected DigiAlm layout."
    );
  }

  return { candidate, exam, questions, markingScheme };
}
