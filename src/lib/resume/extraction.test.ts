import { describe, it, expect } from "vitest";
import { extractResumeDataFromText } from "./extraction";

/**
 * Unit tests for the deterministic text-structuring heuristics in extraction.ts.
 * All fixtures below are synthetic — no real personal/resume data — per
 * docs/RESUME-ENHANCEMENT.md §Resume Builder.
 */

const FULL_RESUME = `Jane Doe
jane.doe@example.com | +1 555-123-4567
Springfield, IL

Summary
Results-driven software engineer with 5 years of experience building web applications.

Experience
Senior Software Engineer at Acme Corp
Jan 2022 - Present
- Led a team of 4 engineers to ship a new billing platform
- Reduced API latency by 30%

Software Engineer at Beta Inc
Jun 2019 - Dec 2021
- Built internal tooling for the support team

Education
Springfield University
Bachelor of Science in Computer Science
Aug 2015 - May 2019

Skills
Languages: JavaScript, TypeScript, Python
Tools: Git, Docker, AWS

Projects
Personal Portfolio
https://janedoe.dev
- Built a personal site with Next.js

Certifications
PMP - Project Management Institute

Achievements
Won 1st place at CodeFest 2023
`;

describe("extractResumeDataFromText — full resume", () => {
  const result = extractResumeDataFromText(FULL_RESUME);

  it("extracts personal info confidently and flags nothing uncertain", () => {
    expect(result.data.personalInfo?.fullName).toBe("Jane Doe");
    expect(result.data.personalInfo?.email).toBe("jane.doe@example.com");
    expect(result.data.personalInfo?.phone).toContain("555-123-4567");
    expect(result.data.personalInfo?.location).toBe("Springfield, IL");
    expect(result.uncertainFields).not.toContain("personalInfo.fullName");
    expect(result.uncertainFields).not.toContain("personalInfo.email");
    expect(result.uncertainFields).not.toContain("personalInfo.phone");
    expect(result.uncertainFields).not.toContain("personalInfo.location");
  });

  it("extracts a link", () => {
    expect(result.data.personalInfo?.links).toEqual([
      { label: "Website", url: "https://janedoe.dev" },
    ]);
  });

  it("extracts the summary", () => {
    expect(result.data.summary).toContain("Results-driven software engineer");
    expect(result.uncertainFields).not.toContain("summary");
  });

  it("extracts both experience entries with role/company/dates/bullets", () => {
    expect(result.data.experience).toHaveLength(2);
    const [first, second] = result.data.experience!;
    expect(first.role).toBe("Senior Software Engineer");
    expect(first.company).toBe("Acme Corp");
    expect(first.startDate).toBe("Jan 2022");
    expect(first.current).toBe(true);
    expect(first.endDate).toBeUndefined();
    expect(first.bullets).toEqual([
      "Led a team of 4 engineers to ship a new billing platform",
      "Reduced API latency by 30%",
    ]);

    expect(second.role).toBe("Software Engineer");
    expect(second.company).toBe("Beta Inc");
    expect(second.startDate).toBe("Jun 2019");
    expect(second.endDate).toBe("Dec 2021");
    expect(second.current).toBe(false);
    expect(result.uncertainFields).not.toContain("experience");
  });

  it("extracts an education entry with institution/degree/dates", () => {
    expect(result.data.education).toHaveLength(1);
    const [entry] = result.data.education!;
    expect(entry.institution).toBe("Springfield University");
    expect(entry.degree).toBe("Bachelor of Science in Computer Science");
    expect(entry.startDate).toBe("Aug 2015");
    expect(entry.endDate).toBe("May 2019");
    expect(result.uncertainFields).not.toContain("education");
  });

  it("extracts labeled skill groups", () => {
    expect(result.data.skills).toEqual([
      { id: expect.any(String), category: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
      { id: expect.any(String), category: "Tools", items: ["Git", "Docker", "AWS"] },
    ]);
    expect(result.uncertainFields).not.toContain("skills");
  });

  it("extracts a project with a link and bullet", () => {
    expect(result.data.projects).toHaveLength(1);
    const [project] = result.data.projects!;
    expect(project.name).toBe("Personal Portfolio");
    expect(project.link).toBe("https://janedoe.dev");
    expect(project.bullets).toEqual(["Built a personal site with Next.js"]);
    expect(result.uncertainFields).not.toContain("projects");
  });

  it("extracts a certification", () => {
    expect(result.data.certifications).toHaveLength(1);
    expect(result.data.certifications![0].name).toBe("PMP");
    expect(result.uncertainFields).not.toContain("certifications");
  });

  it("extracts achievements", () => {
    expect(result.data.achievements).toEqual(["Won 1st place at CodeFest 2023"]);
    expect(result.uncertainFields).not.toContain("achievements");
  });

  it("keeps the raw extracted text for transparency", () => {
    expect(result.rawText).toContain("Jane Doe");
  });
});

describe("extractResumeDataFromText — missing optional sections", () => {
  const MINIMAL_RESUME = `John Smith
john.smith@example.com

Experience
Backend Developer at Widget LLC
2020 - 2023
- Maintained payment processing services

Education
State College
B.Sc. Computer Science
2016 - 2020
`;

  const result = extractResumeDataFromText(MINIMAL_RESUME);

  it("still extracts what is present", () => {
    expect(result.data.personalInfo?.fullName).toBe("John Smith");
    expect(result.data.personalInfo?.email).toBe("john.smith@example.com");
    expect(result.data.experience).toHaveLength(1);
    expect(result.data.education).toHaveLength(1);
  });

  it("flags absent optional sections as uncertain instead of fabricating them", () => {
    expect(result.uncertainFields).toEqual(
      expect.arrayContaining([
        "summary",
        "skills",
        "projects",
        "certifications",
        "achievements",
        "personalInfo.phone",
        "personalInfo.location",
      ])
    );
    expect(result.data.summary).toBe("");
    expect(result.data.skills).toEqual([]);
    expect(result.data.projects).toEqual([]);
    expect(result.data.certifications).toEqual([]);
    expect(result.data.achievements).toEqual([]);
  });

  it("does not flag sections that were successfully found", () => {
    expect(result.uncertainFields).not.toContain("experience");
    expect(result.uncertainFields).not.toContain("education");
  });
});

describe("extractResumeDataFromText — email/phone extraction", () => {
  it("extracts an email embedded among other contact details", () => {
    const result = extractResumeDataFromText("Alex Kim\nalex.kim99@mail.co | Bengaluru, India");
    expect(result.data.personalInfo?.email).toBe("alex.kim99@mail.co");
  });

  it("extracts a phone number in a common international format", () => {
    const result = extractResumeDataFromText("Alex Kim\n+91 98765 43210");
    expect(result.data.personalInfo?.phone?.replace(/\D/g, "")).toBe("919876543210");
  });

  it("marks email and phone uncertain when neither is present", () => {
    const result = extractResumeDataFromText("Alex Kim\nBengaluru, India");
    expect(result.data.personalInfo?.email).toBeUndefined();
    expect(result.data.personalInfo?.phone).toBeUndefined();
    expect(result.uncertainFields).toContain("personalInfo.email");
    expect(result.uncertainFields).toContain("personalInfo.phone");
  });
});

describe("extractResumeDataFromText — experience extraction edge cases", () => {
  it("flags an entry uncertain when no date range is found", () => {
    const text = `Name Here\n\nExperience\nProduct Manager at Some Company\n- Shipped a feature\n`;
    const result = extractResumeDataFromText(text);
    expect(result.data.experience).toHaveLength(1);
    expect(result.data.experience![0].role).toBe("Product Manager");
    expect(result.data.experience![0].company).toBe("Some Company");
    expect(result.uncertainFields).toContain("experience");
  });

  it("flags an entry uncertain when role/company cannot be split", () => {
    const text = `Name Here\n\nExperience\nSomething Ambiguous\nJan 2020 - Jan 2021\n- Did work\n`;
    const result = extractResumeDataFromText(text);
    expect(result.data.experience).toHaveLength(1);
    expect(result.data.experience![0].role).toBe("Something Ambiguous");
    expect(result.data.experience![0].company).toBe("");
    expect(result.uncertainFields).toContain("experience");
  });
});

describe("extractResumeDataFromText — education extraction edge cases", () => {
  it("flags education uncertain when degree keywords are not recognized", () => {
    const text = `Name Here\n\nEducation\nSome Institute\nCertificate in Data Science\n2018 - 2020\n`;
    const result = extractResumeDataFromText(text);
    expect(result.data.education).toHaveLength(1);
    expect(result.uncertainFields).toContain("education");
  });
});

describe("extractResumeDataFromText — skills extraction", () => {
  it("extracts an unlabeled comma-separated skills list into a single group", () => {
    const text = `Name Here\n\nSkills\nReact, Node.js, PostgreSQL, Docker\n`;
    const result = extractResumeDataFromText(text);
    expect(result.data.skills).toEqual([
      { id: expect.any(String), items: ["React", "Node.js", "PostgreSQL", "Docker"] },
    ]);
    expect(result.uncertainFields).not.toContain("skills");
  });
});

describe("extractResumeDataFromText — no fabrication", () => {
  it("returns empty arrays and undefined fields for a near-empty document, never invented values", () => {
    const result = extractResumeDataFromText("Just Some Text");
    expect(result.data.personalInfo?.email).toBeUndefined();
    expect(result.data.personalInfo?.phone).toBeUndefined();
    expect(result.data.personalInfo?.location).toBeUndefined();
    expect(result.data.experience).toEqual([]);
    expect(result.data.education).toEqual([]);
    expect(result.data.skills).toEqual([]);
    expect(result.data.projects).toEqual([]);
    expect(result.data.certifications).toEqual([]);
    expect(result.data.achievements).toEqual([]);
    expect(result.uncertainFields.length).toBeGreaterThan(0);
  });

  it("returns entirely empty/uncertain data for an empty string", () => {
    const result = extractResumeDataFromText("");
    expect(result.data.personalInfo?.fullName).toBe("");
    expect(result.data.experience).toEqual([]);
    expect(result.data.education).toEqual([]);
    expect(result.uncertainFields).toContain("personalInfo.fullName");
    expect(result.uncertainFields).toContain("experience");
    expect(result.uncertainFields).toContain("education");
  });
});
