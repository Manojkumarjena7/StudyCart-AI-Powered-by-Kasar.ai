/**
 * Curated reference/demo resumes shown on /resume. Single source of truth — the
 * carousel, cards, and PDF viewer all read from this list. To add another example:
 * add an entry here (with a matching PDF under public/resumes/) and, if it's a new
 * generated sample, an entry in scripts/generate-resume-examples.mjs.
 * See docs/RESUME-ENHANCEMENT.md §Resume Examples.
 */

export interface ResumeExample {
  id: string;
  title: string;
  role: string;
  experienceLevel: string;
  category: string;
  /** Accent used by the CSS-built thumbnail (no image/PDF is loaded for the card). */
  accent: "blue" | "cyan" | "violet";
  pdfPath: string;
  description: string;
  published: boolean;
}

export const resumeExamples: ResumeExample[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    role: "Software Engineer",
    experienceLevel: "Fresher",
    category: "Software Engineering",
    accent: "blue",
    pdfPath: "/resumes/software-engineer.pdf",
    description: "A clean, ATS-friendly resume for a fresher software engineering candidate.",
    published: true,
  },
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer",
    role: "QA Automation Engineer",
    experienceLevel: "1–3 years",
    category: "Automation",
    accent: "cyan",
    pdfPath: "/resumes/qa-automation-engineer.pdf",
    description: "Shows how to present automation frameworks, tools, and measurable QA impact.",
    published: true,
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    role: "Data Analyst",
    experienceLevel: "2–4 years",
    category: "Data",
    accent: "violet",
    pdfPath: "/resumes/data-analyst.pdf",
    description: "Demonstrates quantifying impact with metrics, dashboards, and SQL/analytics tooling.",
    published: true,
  },
];

export function getPublishedResumeExamples(): ResumeExample[] {
  return resumeExamples.filter((r) => r.published);
}
