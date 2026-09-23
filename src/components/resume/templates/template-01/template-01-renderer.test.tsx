import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createEmptyResumeData, type ResumeData } from "@/lib/resume/types";
import { Template01Renderer } from "./template-01-renderer";

/**
 * Rendered via react-dom/server (no jsdom/@testing-library dependency needed —
 * Template01Renderer is a pure, hook-free component) so these tests run in the
 * project's existing node test environment. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 2.
 */

function render(data: ResumeData): string {
  return renderToStaticMarkup(<Template01Renderer data={data} />);
}

const FULL_DATA: ResumeData = {
  personalInfo: {
    fullName: "Taylor Reed",
    email: "taylor.reed@example.com",
    phone: "+1 555-000-1111",
    location: "Austin, TX",
    links: [{ label: "Website", url: "https://taylorreed.example.com" }],
  },
  summary: "A dedicated engineer who ships things.",
  experience: [
    {
      id: "exp-1",
      role: "Senior Engineer",
      company: "Acme Corp",
      location: "Remote",
      startDate: "Jan 2022",
      endDate: undefined,
      current: true,
      bullets: ["Shipped the billing platform", "Mentored two engineers"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "State University",
      degree: "B.Sc.",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2020",
    },
  ],
  skills: [
    { id: "sk-1", category: "Languages", items: ["TypeScript", "Python"] },
    { id: "sk-2", items: ["Git", "Docker"] },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Personal Site",
      description: "A portfolio site",
      bullets: ["Built with Next.js"],
      link: "https://taylorreed.example.com",
    },
  ],
  certifications: [{ id: "cert-1", name: "AWS Certified Developer", issuer: "Amazon", date: "2021" }],
  achievements: ["Won 1st place at CodeFest 2023"],
};

describe("Template01Renderer — complete ResumeData", () => {
  const html = render(FULL_DATA);

  it("renders without crashing and includes personal info", () => {
    expect(html).toContain("Taylor Reed");
    expect(html).toContain("taylor.reed@example.com");
    expect(html).toContain("+1 555-000-1111");
    expect(html).toContain("Austin, TX");
  });

  it("derives a headline from the current experience entry", () => {
    expect(html).toContain("Senior Engineer");
  });

  it("renders the summary", () => {
    expect(html).toContain("A dedicated engineer who ships things.");
  });

  it("renders experience entries with company, dates, and bullets", () => {
    expect(html).toContain("Acme Corp");
    expect(html).toContain("Present");
    expect(html).toContain("Shipped the billing platform");
    expect(html).toContain("Mentored two engineers");
  });

  it("renders education entries", () => {
    expect(html).toContain("State University");
    expect(html).toContain("B.Sc.");
    expect(html).toContain("Computer Science");
  });

  it("renders skills grouped by category and an unlabeled group", () => {
    expect(html).toContain("Languages");
    expect(html).toContain("TypeScript");
    expect(html).toContain("Docker");
  });

  it("renders projects with links and bullets", () => {
    expect(html).toContain("Personal Site");
    expect(html).toContain("https://taylorreed.example.com");
    expect(html).toContain("Built with Next.js");
  });

  it("renders certifications and achievements", () => {
    expect(html).toContain("AWS Certified Developer");
    expect(html).toContain("Won 1st place at CodeFest 2023");
  });

  it("never renders the literal string undefined or null", () => {
    expect(html).not.toMatch(/\bundefined\b/);
    expect(html).not.toMatch(/\bnull\b/);
  });
});

describe("Template01Renderer — minimal ResumeData", () => {
  it("renders with only a name and does not crash", () => {
    const data: ResumeData = { ...createEmptyResumeData(), personalInfo: { fullName: "Sam Lee", links: [] } };
    const html = render(data);
    expect(html).toContain("Sam Lee");
  });

  it("shows a placeholder rather than fabricating a name when empty", () => {
    const html = render(createEmptyResumeData());
    expect(html).toContain("Your Name");
  });
});

describe("Template01Renderer — empty optional sections", () => {
  const html = render(createEmptyResumeData());

  it("does not crash on completely empty data", () => {
    expect(html).toBeTruthy();
  });

  it("hides section headings for sections with no data", () => {
    expect(html).not.toContain("Skills");
    expect(html).not.toContain("Experience");
    expect(html).not.toContain("Education");
    expect(html).not.toContain("Projects");
    expect(html).not.toContain("Certifications");
    expect(html).not.toContain("Achievements");
  });

  it("hides the contact row entirely when there is no contact info", () => {
    expect(html).not.toContain("contactRow");
  });

  it("hides the summary paragraph when empty", () => {
    const data = { ...createEmptyResumeData(), summary: "   " };
    expect(render(data)).not.toContain("<p");
  });
});

describe("Template01Renderer — partial data (no fabrication)", () => {
  it("renders an experience entry even with only a role, without inventing a company", () => {
    const data: ResumeData = {
      ...createEmptyResumeData(),
      personalInfo: { fullName: "Jordan Kim", links: [] },
      experience: [{ id: "e1", role: "Intern", company: "", bullets: [] }],
    };
    const html = render(data);
    expect(html).toContain("Intern");
    expect(html).not.toContain("undefined");
  });

  it("omits an achievement/skill item's group heading when uncategorized", () => {
    const data: ResumeData = {
      ...createEmptyResumeData(),
      personalInfo: { fullName: "Jordan Kim", links: [] },
      skills: [{ id: "s1", items: ["React"] }],
    };
    const html = render(data);
    expect(html).toContain("React");
  });
});
