import { describe, it, expect } from "vitest";
import { extractPdfResult } from "./textExtractor";
import { ParserError } from "../../security/errors";

const sampleText = `
Candidate Name : Test Candidate
Roll No : PDF123456
Application No : APP-000111
Exam Name : Sample State PSC Recruitment Exam 2026
Test Date : 10/06/2026
Test Time : 9:00 AM - 11:00 AM
Test Centre Name : Sample PDF Test Centre

Correct Answer will carry 1 mark per Question.
Incorrect Answer will carry 0.25 Negative mark per Question.

Section : General Studies

Q1. Which river flows through Cuttack?
A) Ganga
B) Mahanadi
C) Godavari
D) Krishna
Your Answer : Mahanadi
Correct Answer : Mahanadi
Status : Correct

Q2. What is the capital of Odisha?
A) Cuttack
B) Bhubaneswar
C) Puri
D) Rourkela
Your Answer : Cuttack
Correct Answer : Bhubaneswar
Status : Wrong

Section : Mathematics

Q3. 2 + 2 * 2 = ?
A) 6
B) 8
C) 4
Your Answer : Not Answered
Correct Answer : 6
Status : Not Answered

Q4. Who wrote the Odia epic Baisha Koshi Gita?
A) Jagannath Das
B) Sarala Das
C) Balaram Das
D) Upendra Bhanja
Your Answer : Jagannath Das
Correct Answer : Jagannath Das
Status : Correct
`;

describe("extractPdfResult", () => {
  it("extracts candidate information", () => {
    const result = extractPdfResult(sampleText);
    expect(result.candidate.name).toBe("Test Candidate");
    expect(result.candidate.rollNumber).toBe("PDF123456");
    expect(result.candidate.applicationNumber).toBe("APP-000111");
  });

  it("extracts exam information", () => {
    const result = extractPdfResult(sampleText);
    expect(result.exam.examName).toBe("Sample State PSC Recruitment Exam 2026");
    expect(result.exam.examDate).toBe("10/06/2026");
    expect(result.exam.centre).toBe("Sample PDF Test Centre");
  });

  it("extracts the marking scheme from the printed note", () => {
    const result = extractPdfResult(sampleText);
    expect(result.markingScheme).toEqual({ positiveMarksPerQuestion: 1, negativeMarksPerQuestion: 0.25 });
  });

  it("extracts all 4 questions with correct outcomes and section-based subjects", () => {
    const result = extractPdfResult(sampleText);
    expect(result.questions).toHaveLength(4);

    const [q1, q2, q3, q4] = result.questions;
    expect(q1.subject).toBe("General Studies");
    expect(q1.outcome).toBe("correct");
    expect(q1.selectedAnswer).toBe("Mahanadi");

    expect(q2.subject).toBe("General Studies");
    expect(q2.outcome).toBe("wrong");

    expect(q3.subject).toBe("Mathematics");
    expect(q3.outcome).toBe("skipped");
    expect(q3.selectedAnswer).toBeUndefined();

    expect(q4.subject).toBe("Mathematics");
    expect(q4.outcome).toBe("correct");
  });

  it("extracts question options", () => {
    const result = extractPdfResult(sampleText);
    expect(result.questions[0].options).toEqual(["Ganga", "Mahanadi", "Godavari", "Krishna"]);
  });

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
Q1. 1 + 1 = ?
A) 2
B) 3
Your Answer : 2
Correct Answer : 2
Status : Correct
`;
    const result = extractPdfResult(minimal);
    expect(result.exam.examDate).toBeUndefined();
    expect(result.exam.centre).toBeUndefined();
    expect(result.questions).toHaveLength(1);
  });
});
