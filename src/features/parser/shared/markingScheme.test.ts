import { describe, it, expect } from "vitest";
import { resolveMarkingScheme } from "./markingScheme";
import { ParserError } from "../security/errors";

describe("resolveMarkingScheme", () => {
  it("prefers the scheme extracted from the page when present", () => {
    const scheme = resolveMarkingScheme("Any Exam", {
      positiveMarksPerQuestion: 2,
      negativeMarksPerQuestion: 0.5,
    });
    expect(scheme).toEqual({ positiveMarksPerQuestion: 2, negativeMarksPerQuestion: 0.5 });
  });

  it("falls back to the configured scheme for a known exam", () => {
    const scheme = resolveMarkingScheme("OSSSC RI / ARI Recruitment Examination 2026", null);
    expect(scheme).toEqual({ positiveMarksPerQuestion: 1, negativeMarksPerQuestion: 0.25 });
  });

  it("is case/whitespace insensitive when matching the configured exam name", () => {
    const scheme = resolveMarkingScheme("  osssc ri / ari recruitment examination 2026  ", null);
    expect(scheme).toEqual({ positiveMarksPerQuestion: 1, negativeMarksPerQuestion: 0.25 });
  });

  it("throws MARKING_SCHEME_UNKNOWN for an unconfigured exam with no printed scheme", () => {
    try {
      resolveMarkingScheme("Some Brand New Exam 2099", null);
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ParserError);
      expect((err as ParserError).code).toBe("MARKING_SCHEME_UNKNOWN");
    }
  });

  it("throws MARKING_SCHEME_UNKNOWN when exam name itself is missing", () => {
    expect(() => resolveMarkingScheme(undefined, null)).toThrow(ParserError);
  });
});
