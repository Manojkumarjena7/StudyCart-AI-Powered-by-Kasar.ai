/**
 * Public-safe resume templates shown on /resume. Single source of truth — the
 * grid, cards, and PDF viewer all read from this list. Sourced from
 * Public-Safe-Resume-Templates.zip: 3 templates, each recreated from a real resume
 * with all personally identifying information replaced by generic placeholders (see
 * that pack's own README.md for the exact replacement mapping). To add another
 * template: add an entry here plus `public/resumes/template-0N/{resume.pdf,resume.docx}`.
 * See docs/RESUME-ENHANCEMENT.md §Resume Templates.
 */

export interface ResumeExample {
  id: string;
  title: string;
  role: string;
  experienceLevel: string;
  category: string;
  pdfPath: string;
  docxPath: string;
  /** Real page-1 render of pdfPath, generated via scripts/generate-resume-previews.mjs
   * — never a hand-built HTML/CSS recreation. See docs/RESUME-ENHANCEMENT.md §Resume
   * Templates. All three are 900x1273px (A4 ratio). */
  previewImagePath: string;
  previewWidth: number;
  previewHeight: number;
  description: string;
  published: boolean;
}

export const resumeExamples: ResumeExample[] = [
  {
    id: "template-01",
    title: "Template 01",
    role: "Software QA Engineer",
    experienceLevel: "Fresher",
    category: "Manual Testing",
    pdfPath: "/resumes/template-01/resume.pdf",
    docxPath: "/resumes/template-01/resume.docx",
    previewImagePath: "/resumes/template-01/preview.png",
    previewWidth: 900,
    previewHeight: 1273,
    description: "Two-column layout with icon-style contact row — well suited for freshers in manual/QA testing roles.",
    published: true,
  },
  {
    id: "template-02",
    title: "Template 02",
    role: "QA / Software Testing Engineer",
    experienceLevel: "2+ years",
    category: "Automation",
    pdfPath: "/resumes/template-02/resume.pdf",
    docxPath: "/resumes/template-02/resume.docx",
    previewImagePath: "/resumes/template-02/preview.png",
    previewWidth: 900,
    previewHeight: 1273,
    description: "Centered single-column layout for candidates with manual and automation testing experience across multiple projects.",
    published: true,
  },
  {
    id: "template-03",
    title: "Template 03",
    role: "GenAI Test Engineer",
    experienceLevel: "4+ years",
    category: "AI / GenAI Testing",
    pdfPath: "/resumes/template-03/resume.pdf",
    docxPath: "/resumes/template-03/resume.docx",
    previewImagePath: "/resumes/template-03/preview.png",
    previewWidth: 900,
    previewHeight: 1273,
    description: "Bold section-banner layout for experienced automation engineers specializing in AI/LLM and GenAI testing.",
    published: true,
  },
];

export function getPublishedResumeExamples(): ResumeExample[] {
  return resumeExamples.filter((r) => r.published);
}
