import { describe, it, expect } from "vitest";
import { extractPdfResult } from "./textExtractor";
import { ParserError } from "../../security/errors";
import type { ColoredOptionRun } from "./colorExtractor";

// Mirrors the CONFIRMED real structure (verified against a real sample
// PDF, 2026-07): numbered options, "Ans" and option 1 sometimes on the
// same line, a numeric "Chosen Option" field, and labels that can wrap
// onto their own line without a colon separator.
const realFormatText = `
Roll No.  PDF987654321
Application No. APP-TEST-000999
Participant
Name TEST CANDIDATE
Test Center
Name Sample PDF Test Centre
Test Date  10/06/2026
Test Time  9:00 AM - 11:00 AM
Subject
Conduct of Written Test for the posts of RI under
CRE 2025

* Note
Correct Answer will carry 1 mark per Question.
Incorrect Answer will carry 0.25 Negative mark per Question.

Section : Mathematics

Q.1 Which river flows through Cuttack?
Ans  1. Ganga
2. Mahanadi
3. Godavari
4. Krishna
Question Type : MCQ
Question ID : PQ1001
Status : Answered
Chosen Option : 2

Q.2 What is the capital of Odisha?
Ans  1. Cuttack
2. Bhubaneswar
3. Puri
4. Rourkela
Question Type : MCQ
Question ID : PQ1002
Status : Answered
Chosen Option : 1

Q.3 2 + 2 * 2 = ?
Ans  1. 4
2. 6
3. 8
Question Type : MCQ
Question ID : PQ1003
Status : Not Answered
Chosen Option : --

Section : General Studies

Q.4 Who wrote the Odia epic Baisha Koshi Gita?
Ans  1. Jagannath Das
2. Sarala Das
3. Balaram Das
4. Upendra Bhanja
Question Type : MCQ
Question ID : PQ1004
Status : Marked For Review
Chosen Option : 1
`;

// Colored runs in document order, matching the text above — mirrors
// what colorExtractor.ts would return for a real colored PDF. Correct
// options: Q1->2 (Mahanadi), Q2->2 (Bhubaneswar), Q3->2 (6), Q4->1 (Jagannath Das).
const coloredRuns: ColoredOptionRun[] = [
  { number: 1, text: "Ganga", isCorrect: false },
  { number: 2, text: "Mahanadi", isCorrect: true },
  { number: 3, text: "Godavari", isCorrect: false },
  { number: 4, text: "Krishna", isCorrect: false },
  { number: 1, text: "Cuttack", isCorrect: false },
  { number: 2, text: "Bhubaneswar", isCorrect: true },
  { number: 3, text: "Puri", isCorrect: false },
  { number: 4, text: "Rourkela", isCorrect: false },
  { number: 1, text: "4", isCorrect: false },
  { number: 2, text: "6", isCorrect: true },
  { number: 3, text: "8", isCorrect: false },
  { number: 1, text: "Jagannath Das", isCorrect: true },
  { number: 2, text: "Sarala Das", isCorrect: false },
  { number: 3, text: "Balaram Das", isCorrect: false },
  { number: 4, text: "Upendra Bhanja", isCorrect: false },
];

describe("extractPdfResult (real confirmed PDF structure)", () => {
  it("extracts candidate info even when labels wrap onto a separate line with no colon", () => {
    const result = extractPdfResult(realFormatText, coloredRuns);
    expect(result.candidate.name).toBe("TEST CANDIDATE");
    expect(result.candidate.rollNumber).toBe("PDF987654321");
    expect(result.candidate.applicationNumber).toBe("APP-TEST-000999");
  });

  it("extracts exam info from a multi-line-wrapped 'Subject' field", () => {
    const result = extractPdfResult(realFormatText, coloredRuns);
    expect(result.exam.examName).toContain("Conduct of Written Test for the posts of RI");
    expect(result.exam.examDate).toBe("10/06/2026");
    expect(result.exam.centre).toBe("Sample PDF Test Centre");
  });

  it("extracts the marking scheme from the printed note", () => {
    const result = extractPdfResult(realFormatText, coloredRuns);
    expect(result.markingScheme).toEqual({ positiveMarksPerQuestion: 1, negativeMarksPerQuestion: 0.25 });
  });

  it("extracts option 1 even when it shares a line with 'Ans'", () => {
    const result = extractPdfResult(realFormatText, coloredRuns);
    expect(result.questions[0].options).toEqual(["Ganga", "Mahanadi", "Godavari", "Krishna"]);
  });

  it("determines correctness from color-derived data, not from the chosen option's text", () => {
    const result = extractPdfResult(realFormatText, coloredRuns);
    const [q1, q2, q3, q4] = result.questions;

    expect(q1.correctAnswer).toBe("Mahanadi");
    expect(q1.selectedAnswer).toBe("Mahanadi");
    expect(q1.outcome).toBe("correct");

    expect(q2.correctAnswer).toBe("Bhubaneswar");
    expect(q2.selectedAnswer).toBe("Cuttack");
    expect(q2.outcome).toBe("wrong");

    expect(q3.outcome).toBe("skipped"); // Chosen Option: --
    expect(q3.selectedAnswer).toBeUndefined();

    expect(q4.outcome).toBe("correct"); // chosen 1 == correct 1, despite "Marked For Review" status
  });

  it("tracks subject per question via 'Section :' markers in document order", () => {
    const result = extractPdfResult(realFormatText, coloredRuns);
    expect(result.questions[0].subject).toBe("Mathematics");
    expect(result.questions[2].subject).toBe("Mathematics");
    expect(result.questions[3].subject).toBe("General Studies");
  });

  it("extracts question IDs", () => {
    const result = extractPdfResult(realFormatText, coloredRuns);
    expect(result.questions[0].questionId).toBe("PQ1001");
  });

  it("still produces question/option/chosen data when no colored runs are supplied (color extraction unavailable)", () => {
    const result = extractPdfResult(realFormatText, []);
    expect(result.questions).toHaveLength(4);
    expect(result.questions[0].selectedAnswer).toBe("Mahanadi");
    expect(result.questions[0].correctAnswer).toBeUndefined(); // can't know correctness without color data
  });
});

describe("extractPdfResult (fallback text-label format, no numeric Chosen Option field)", () => {
  const fallbackText = `
Candidate Name : Test Candidate
Roll No : PDF123456
Exam Name : Sample State PSC Recruitment Exam 2026

Correct Answer will carry 1 mark per Question.
Incorrect Answer will carry 0.25 Negative mark per Question.

Section : General Studies

Q.1 Which river flows through Cuttack?
1. Ganga
2. Mahanadi
3. Godavari
4. Krishna
Your Answer : Mahanadi
Correct Answer : Mahanadi

Q.2 What is the capital of Odisha?
1. Cuttack
2. Bhubaneswar
3. Puri
4. Rourkela
Your Answer : Cuttack
Correct Answer : Bhubaneswar

Q.3 2 + 2 * 2 = ?
1. 4
2. 6
3. 8
Your Answer : Not Answered
Correct Answer : 6
`;

  it("falls back to 'Your Answer'/'Correct Answer' text labels when no Chosen Option field exists", () => {
    const result = extractPdfResult(fallbackText, []);
    expect(result.questions).toHaveLength(3);

    const [q1, q2, q3] = result.questions;
    expect(q1.outcome).toBe("correct");
    expect(q2.outcome).toBe("wrong");
    expect(q3.outcome).toBe("skipped");
    expect(q3.selectedAnswer).toBeUndefined();
  });
});

describe("extractPdfResult (error handling)", () => {
  it("throws PARSING_FAILED for empty text (e.g. scanned/image-only PDF)", () => {
    expect(() => extractPdfResult("")).toThrow(ParserError);
    try {
      extractPdfResult("   ");
    } catch (err) {
      expect(err).toBeInstanceOf(ParserError);
      expect((err as ParserError).code).toBe("PARSING_FAILED");
    }
  });

  it("throws PARSING_FAILED when no question blocks are found", () => {
    expect(() => extractPdfResult("Candidate Name : Someone\nNo questions here.")).toThrow(ParserError);
  });

  it("handles missing optional fields gracefully", () => {
    const minimal = `
Candidate Name : Someone
Q.1 1 + 1 = ?
1. 2
2. 3
Your Answer : 2
Correct Answer : 2
`;
    const result = extractPdfResult(minimal, []);
    expect(result.exam.examDate).toBeUndefined();
    expect(result.exam.centre).toBeUndefined();
    expect(result.questions).toHaveLength(1);
  });
});
