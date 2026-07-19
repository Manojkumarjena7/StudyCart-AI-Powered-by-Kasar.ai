import { describe, it, expect } from "vitest";
import { isDigiAlmUrl, digiAlmCanHandle } from "./detect";

describe("isDigiAlmUrl", () => {
  it("matches a typical DigiAlm response-sheet URL", () => {
    expect(
      isDigiAlmUrl("https://cdn3.digialm.com/EForms/configuredHtml/12345/67890/AnswerSheet.html")
    ).toBe(true);
  });

  it("matches a bare digialm.com host with a responsesheet path", () => {
    expect(isDigiAlmUrl("https://digialm.com/candidateresponse/12345")).toBe(true);
  });

  it("rejects a digialm.com URL with no recognizable response-sheet path", () => {
    expect(isDigiAlmUrl("https://digialm.com/")).toBe(false);
    expect(isDigiAlmUrl("https://digialm.com/about-us")).toBe(false);
  });

  it("matches the real, verified live DigiAlm response-sheet URL structure (regression test)", () => {
    // This exact URL shape was fetched and verified live on 2026-07-05.
    // The path pattern originally shipped in Phase 1.1 ("answersheet",
    // "eforms", etc.) did NOT match this real URL — it uses a
    // "/touchstone/AssessmentQPHTMLMode.../" servlet path instead. This
    // test guards against that regression.
    expect(
      isDigiAlmUrl(
        "https://cdn3.digialm.com//per/g26/pub/33040/touchstone/AssessmentQPHTMLMode1//33040O2619/33040O2619S42D901/17824602960051625/1994222558_33040O2619S42D901E1.html"
      )
    ).toBe(true);
  });

  it("rejects a host that merely contains 'digialm' as a substring elsewhere", () => {
    expect(isDigiAlmUrl("https://not-digialm.evil.com/answersheet")).toBe(false);
    expect(isDigiAlmUrl("https://evil.com/digialm.com/answersheet")).toBe(false);
  });

  it("rejects non-http(s) protocols", () => {
    expect(isDigiAlmUrl("ftp://digialm.com/answersheet")).toBe(false);
  });

  it("rejects malformed URLs", () => {
    expect(isDigiAlmUrl("not a url")).toBe(false);
  });

  it("rejects TCS iON and generic URLs", () => {
    expect(isDigiAlmUrl("https://tcsion.com/candidateresponse/1")).toBe(false);
    expect(isDigiAlmUrl("https://example.com/answersheet")).toBe(false);
  });
});

describe("digiAlmCanHandle", () => {
  it("returns false for PDF source type even with a digialm-looking url present", () => {
    expect(
      digiAlmCanHandle({
        sourceType: "pdf",
        category: "General",
        consentGiven: true,
      })
    ).toBe(false);
  });

  it("returns true only for a URL source with a matching DigiAlm URL", () => {
    expect(
      digiAlmCanHandle({
        sourceType: "url",
        url: "https://digialm.com/candidateresponse/1",
        category: "General",
        consentGiven: true,
      })
    ).toBe(true);
  });
});
