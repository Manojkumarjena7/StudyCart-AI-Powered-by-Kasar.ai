import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { extractDigiAlmResult } from "./extractor";
import { ParserError } from "../../security/errors";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const sampleHtml = readFileSync(
  path.join(fixtureDir, "__fixtures__", "sample-response-sheet.html"),
  "utf-8"
);
const realLabelsHtml = readFileSync(
  path.join(fixtureDir, "__fixtures__", "sample-response-sheet-real-labels.html"),
  "utf-8"
);

describe("extractDigiAlmResult", () => {
  it("extracts candidate information", () => {
    const result = extractDigiAlmResult(sampleHtml);
    expect(result.candidate.name).toBe("TEST CANDIDATE");
    expect(result.candidate.rollNumber).toBe("1111111111");
    expect(result.candidate.applicationNumber).toBe("XX000000CRE-00000000");
  });

  it("extracts exam information", () => {
    const result = extractDigiAlmResult(sampleHtml);
    expect(result.exam.examName).toContain("Conduct of Written Test for the posts of RI");
    expect(result.exam.examDate).toBe("04/06/2026");
    expect(result.exam.centre).toBe("Sample Test Centre Pvt Ltd");
  });

  it("extracts the marking scheme from the real printed phrasing", () => {
    const result = extractDigiAlmResult(sampleHtml);
    expect(result.markingScheme).toEqual({
      positiveMarksPerQuestion: 1,
      negativeMarksPerQuestion: 0.25,
    });
  });

  it("extracts all 4 question blocks with correct question text and options", () => {
    const result = extractDigiAlmResult(sampleHtml);
    expect(result.questions).toHaveLength(4);
    expect(result.questions[0].questionText).toContain("Which river flows through Cuttack");
    expect(result.questions[0].options).toEqual(["Ganga", "Godavari", "Mahanadi", "Krishna"]);
  });

  it("determines the correct answer from the tick icon, independent of what was chosen", () => {
    const result = extractDigiAlmResult(sampleHtml);
    // Q1: tick is on option 3 (Mahanadi) — candidate also chose 3.
    expect(result.questions[0].correctAnswer).toBe("Mahanadi");
    // Q2: tick is on option 2 (Bhubaneswar) — candidate chose option 1 (Cuttack).
    expect(result.questions[1].correctAnswer).toBe("Bhubaneswar");
    expect(result.questions[1].selectedAnswer).toBe("Cuttack");
  });

  it("reads the selected answer strictly from the numeric 'Chosen Option' field, not from any CSS class", () => {
    const result = extractDigiAlmResult(sampleHtml);
    expect(result.questions[0].selectedAnswer).toBe("Mahanadi"); // Chosen Option: 3
    expect(result.questions[3].selectedAnswer).toBe("Jagannath Das"); // Chosen Option: 1
  });

  it("computes correct/wrong/skipped strictly by comparing chosen option number to correct option number", () => {
    const result = extractDigiAlmResult(sampleHtml);
    const [q1, q2, q3, q4] = result.questions;

    expect(q1.outcome).toBe("correct"); // chosen 3 == correct 3
    expect(q2.outcome).toBe("wrong"); // chosen 1 != correct 2
    expect(q3.outcome).toBe("skipped"); // Chosen Option: --
    expect(q3.selectedAnswer).toBeUndefined();
    expect(q4.outcome).toBe("correct"); // chosen 1 == correct 1, despite "Marked For Review" status
  });

  it("tracks subject per question from 'Section :' markers in document order", () => {
    const result = extractDigiAlmResult(sampleHtml);
    expect(result.questions[0].subject).toBe("Mathematics");
    expect(result.questions[1].subject).toBe("Mathematics");
    expect(result.questions[2].subject).toBe("Mathematics");
    expect(result.questions[3].subject).toBe("General Studies");
  });

  it("extracts real label formats (Roll No./Participant Name/Application No./Subject)", () => {
    const result = extractDigiAlmResult(realLabelsHtml);
    expect(result.candidate.name).toBe("TEST CANDIDATE");
    expect(result.candidate.rollNumber).toBe("1111111111");
    expect(result.candidate.applicationNumber).toBe("XX000000CRE-00000000");
    expect(result.exam.examName).toContain("Conduct of Written Test for the posts of RI");
  });

  it("throws a ParserError with PARSING_FAILED when no question blocks are found", () => {
    const emptyHtml = "<html><body><table><tr><td>Candidate Name</td><td>: X</td></tr></table></body></html>";
    expect(() => extractDigiAlmResult(emptyHtml)).toThrowError(ParserError);
    try {
      extractDigiAlmResult(emptyHtml);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ParserError);
      expect((err as ParserError).code).toBe("PARSING_FAILED");
    }
  });

  it("handles missing optional fields gracefully (no post/centre present)", () => {
    const minimalHtml = `
      <html><body>
        <table>
          <tr><td>Participant Name</td><td>: Someone</td></tr>
          <tr><td>Subject</td><td>: Some Exam</td></tr>
        </table>
        <div class="question-pnl">
          <div>Q.1 1 + 1 = ?</div>
          <div>Ans</div>
          <ul>
            <li>1. 2 <img alt="tick" src="tick.png"/></li>
            <li>2. 3</li>
          </ul>
          <table>
            <tr><td>Status</td><td>Answered</td></tr>
            <tr><td>Chosen Option</td><td>1</td></tr>
          </table>
        </div>
      </body></html>
    `;
    const result = extractDigiAlmResult(minimalHtml);
    expect(result.exam.post).toBeUndefined();
    expect(result.exam.centre).toBeUndefined();
    expect(result.questions).toHaveLength(1);
    expect(result.questions[0].outcome).toBe("correct");
  });

  it("throws PARSING_FAILED on malformed/unrelated HTML", () => {
    expect(() => extractDigiAlmResult("<html><body><p>Not a response sheet</p></body></html>")).toThrow(
      ParserError
    );
  });
});
