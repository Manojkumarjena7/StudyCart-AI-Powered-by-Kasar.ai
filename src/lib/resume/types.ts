/**
 * Independent resume data model for the KasarTech.ai Resume Builder (Phase 1).
 * See docs/RESUME-ENHANCEMENT.md §Resume Builder.
 *
 * Deliberately separate from src/types/domain.ts (Government Job Platform) — see
 * docs/ARCHITECTURE.md §Route boundary rules: primary-product routes (Resume/Learn/
 * Jobs) must not import Government Job Platform business logic or its shared types.
 *
 * ResumeData is intentionally free of any template/layout information — the same
 * object must be renderable by any future template without re-entry. See
 * docs/RESUME-ENHANCEMENT.md §Template independence.
 */

export interface ResumeLink {
  label: string;
  url: string;
}

export interface ResumePersonalInfo {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  links: ResumeLink[];
}

export interface ResumeExperienceEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  bullets: string[];
}

export interface ResumeEducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeSkillGroup {
  id: string;
  /** Optional label like "Languages" or "Tools" — undefined for a flat, unlabeled list. */
  category?: string;
  items: string[];
}

export interface ResumeProjectEntry {
  id: string;
  name: string;
  description?: string;
  bullets: string[];
  link?: string;
}

export interface ResumeCertificationEntry {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeData {
  personalInfo: ResumePersonalInfo;
  summary: string;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  skills: ResumeSkillGroup[];
  projects: ResumeProjectEntry[];
  certifications: ResumeCertificationEntry[];
  achievements: string[];
}

export function createEmptyResumeData(): ResumeData {
  return {
    personalInfo: { fullName: "", email: undefined, phone: undefined, location: undefined, links: [] },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
  };
}

/**
 * Result of a best-effort extraction pass. `data` is never fabricated — fields that
 * couldn't be confidently read are left empty/absent rather than guessed, and their
 * (dot-path) key is listed in `uncertainFields` so the review UI can flag them for the
 * user to check or fill in themselves. `rawText` is the full extracted document text,
 * kept for transparency (e.g. an optional "view extracted text" toggle) — never shown
 * as a technical error to the user.
 */
export interface ExtractionResult {
  data: Partial<ResumeData>;
  uncertainFields: string[];
  rawText: string;
}
