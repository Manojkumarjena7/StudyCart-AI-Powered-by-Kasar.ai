import type { ResumeData, ResumeExperienceEntry, ResumeProjectEntry } from "./types";

/**
 * ATS Readiness checklist — Phase 3. A small set of pure, deterministic functions
 * over ResumeData (never the rendered template HTML/PDF, never AI/LLM, never
 * semantic/job-description matching). Every rule here is a plain string/array
 * check the user could verify by eye — see docs/RESUME-ENHANCEMENT.md §Resume
 * Builder — Phase 3 for the rationale behind each threshold.
 *
 * Deliberately no numeric score ("ATS Score: 87%") — see §NO ATS SCORE in that
 * doc section. Only three statuses are ever produced.
 */

export type AtsCheckStatus = "pass" | "warning" | "fail";

export interface AtsCheck {
  id: string;
  status: AtsCheckStatus;
  title: string;
  message: string;
}

export interface AtsChecklistResult {
  checks: AtsCheck[];
}

function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isMeaningfulExperience(entry: ResumeExperienceEntry): boolean {
  return hasText(entry.role) || hasText(entry.company) || entry.bullets.some(hasText);
}

function isMeaningfulProject(entry: ResumeProjectEntry): boolean {
  return hasText(entry.name) || hasText(entry.description) || entry.bullets.some(hasText);
}

/** A small, transparent, deterministic list — not NLP/AI. A bullet "has an action
 * verb" only when it starts with one of these exact words (case-insensitive). */
export const ACTION_VERBS = [
  "developed",
  "built",
  "implemented",
  "automated",
  "designed",
  "tested",
  "optimized",
  "improved",
  "created",
  "led",
  "managed",
  "analyzed",
  "reduced",
  "increased",
  "delivered",
];

const ACTION_VERB_SET = new Set(ACTION_VERBS);

function startsWithActionVerb(bullet: string): boolean {
  const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
  return firstWord ? ACTION_VERB_SET.has(firstWord) : false;
}

/** Matches: percentages (20%), currency (₹5L, $10k), and number+unit phrases (30
 * test cases, 3 months, 40% reduction). Regex-based pattern matching only — never
 * claimed as NLP or AI analysis. */
const QUANTIFIABLE_PATTERN =
  /\d+(\.\d+)?\s?%|[₹$€£]\s?\d+(\.\d+)?\s?(l|lakh|lac|cr|crore|k|m|bn)?|\b\d+(\.\d+)?\+?\s?(x|k|m|hrs?|hours?|mins?|minutes?|days?|weeks?|months?|years?)\b|\b\d+\s+[a-zA-Z]+/i;

function collectBullets(data: ResumeData): string[] {
  const experienceBullets = data.experience.flatMap((e) => e.bullets).filter(hasText);
  const projectBullets = data.projects.flatMap((p) => p.bullets).filter(hasText);
  return [...experienceBullets, ...projectBullets];
}

/** 1. Contact information — PASS when a full name AND at least one of
 * email/phone are present; a partial match warns rather than fails. */
function checkContactInformation(data: ResumeData): AtsCheck {
  const hasName = hasText(data.personalInfo.fullName);
  const hasReachableContact = hasText(data.personalInfo.email) || hasText(data.personalInfo.phone);

  if (hasName && hasReachableContact) {
    return { id: "contact", status: "pass", title: "Contact information", message: "Your name and contact details are ready." };
  }
  if (!hasName && !hasReachableContact) {
    return {
      id: "contact",
      status: "fail",
      title: "Contact information",
      message: "Add your name and at least an email or phone number so employers can reach you.",
    };
  }
  if (!hasName) {
    return { id: "contact", status: "warning", title: "Contact information", message: "Add your full name to the top of your resume." };
  }
  return { id: "contact", status: "warning", title: "Contact information", message: "Add an email or phone number so employers can reach you." };
}

/** 2. Professional summary — "meaningful text" means more than a placeholder
 * fragment: at least 6 words and 40 characters (both thresholds are arbitrary but
 * fixed and documented, not learned). */
function checkSummary(data: ResumeData): AtsCheck {
  const summary = data.summary.trim();
  if (!summary) {
    return {
      id: "summary",
      status: "fail",
      title: "Professional summary",
      message: "Add a short professional summary introducing your experience and goals.",
    };
  }
  const wordCount = summary.split(/\s+/).filter(Boolean).length;
  if (summary.length < 40 || wordCount < 6) {
    return {
      id: "summary",
      status: "warning",
      title: "Professional summary",
      message: "Your summary looks quite short — consider expanding it to 2–3 sentences.",
    };
  }
  return { id: "summary", status: "pass", title: "Professional summary", message: "Your resume includes a professional summary." };
}

/** 3. Work experience — PASS when at least one entry has real content; a freshly
 * added but still-blank entry does not count (so live edits reflect immediately). */
function checkExperience(data: ResumeData): AtsCheck {
  const hasExperience = data.experience.some(isMeaningfulExperience);
  if (!hasExperience) {
    return {
      id: "experience",
      status: "fail",
      title: "Work experience",
      message: "Add at least one work experience or internship entry, if you have one.",
    };
  }
  return { id: "experience", status: "pass", title: "Work experience", message: "You have at least one work experience entry." };
}

/** 4. Education — PASS when at least one entry has an institution or degree. */
function checkEducation(data: ResumeData): AtsCheck {
  const hasEducation = data.education.some((e) => hasText(e.institution) || hasText(e.degree));
  if (!hasEducation) {
    return { id: "education", status: "fail", title: "Education", message: "Add your most recent education entry." };
  }
  return { id: "education", status: "pass", title: "Education", message: "You have at least one education entry." };
}

/** 5. Skills — PASS when at least one non-empty skill item exists, in any group. */
function checkSkills(data: ResumeData): AtsCheck {
  const skillItemCount = data.skills.reduce((count, group) => count + group.items.filter(hasText).length, 0);
  if (skillItemCount === 0) {
    return { id: "skills", status: "fail", title: "Skills", message: "Add a few relevant skills — languages, tools, or technologies." };
  }
  return { id: "skills", status: "pass", title: "Skills", message: "Your resume lists relevant skills." };
}

/** 6. Projects — explicitly never a hard failure (many strong resumes have none):
 * absence is only ever a neutral suggestion. */
function checkProjects(data: ResumeData): AtsCheck {
  const hasProjects = data.projects.some(isMeaningfulProject);
  if (!hasProjects) {
    return {
      id: "projects",
      status: "warning",
      title: "Projects",
      message: "Consider adding a project if you have one — optional, but helps show applied experience.",
    };
  }
  return { id: "projects", status: "pass", title: "Projects", message: "Your resume includes project experience." };
}

/** 7. Action verbs — inspects only experience bullets, and only whether each one
 * *starts with* a word from ACTION_VERBS. "Many" without one is defined as more
 * than half — a fixed, disclosed threshold, not a learned one. Never claims NLP. */
function checkActionVerbs(data: ResumeData): AtsCheck {
  const bullets = data.experience.flatMap((e) => e.bullets).filter(hasText);
  if (bullets.length === 0) {
    return {
      id: "action-verbs",
      status: "warning",
      title: "Action verbs",
      message: "Add bullet points to your experience so we can check for strong action verbs.",
    };
  }
  const withVerb = bullets.filter(startsWithActionVerb).length;
  if (withVerb / bullets.length < 0.5) {
    return {
      id: "action-verbs",
      status: "warning",
      title: "Action verbs",
      message: `Start more bullet points with a strong action verb (e.g. ${ACTION_VERBS.slice(0, 5).join(", ")}).`,
    };
  }
  return { id: "action-verbs", status: "pass", title: "Action verbs", message: "Most of your bullet points start with a strong action verb." };
}

/** 8. Quantifiable achievements — inspects experience AND project bullets for a
 * simple regex-detectable number/percentage/currency/time pattern. Never
 * penalizes a resume for lacking one — only ever pass or a gentle suggestion. */
function checkQuantifiableAchievements(data: ResumeData): AtsCheck {
  const bullets = collectBullets(data);
  const hasQuantified = bullets.some((b) => QUANTIFIABLE_PATTERN.test(b));
  if (!hasQuantified) {
    return {
      id: "quantifiable-achievements",
      status: "warning",
      title: "Quantifiable achievements",
      message: "Consider adding measurable results where they are genuine.",
    };
  }
  return {
    id: "quantifiable-achievements",
    status: "pass",
    title: "Quantifiable achievements",
    message: "Some of your bullet points include measurable results.",
  };
}

/** 9. Standard section completeness — a single overview check summarizing the
 * five core sections above (Contact, Summary, Experience, Education, Skills)
 * rather than re-deriving them, so this can never disagree with checks 1–5. */
function checkStandardSections(coreChecks: AtsCheck[]): AtsCheck {
  const passCount = coreChecks.filter((c) => c.status === "pass").length;
  if (passCount === coreChecks.length) {
    return {
      id: "standard-sections",
      status: "pass",
      title: "Standard sections",
      message: "Your resume includes all the standard sections employers and ATS systems expect.",
    };
  }
  if (passCount >= 3) {
    return {
      id: "standard-sections",
      status: "warning",
      title: "Standard sections",
      message: "Most standard resume sections are present — fill in the rest for a complete profile.",
    };
  }
  return {
    id: "standard-sections",
    status: "fail",
    title: "Standard sections",
    message: "Several standard resume sections are missing — add contact info, a summary, experience, education, and skills.",
  };
}

/** 10. Empty/very sparse content — a plain content-unit count across every
 * section (not a score): summary presence, experience/project bullets,
 * education entries, skill items, achievements, and certifications. */
const SPARSE_CONTENT_THRESHOLD = 2;

function checkSparseContent(data: ResumeData): AtsCheck {
  const contentUnits =
    (hasText(data.personalInfo.fullName) ? 1 : 0) +
    (hasText(data.summary) ? 1 : 0) +
    data.experience.reduce((n, e) => n + e.bullets.filter(hasText).length, 0) +
    data.education.length +
    data.skills.reduce((n, g) => n + g.items.filter(hasText).length, 0) +
    data.projects.reduce((n, p) => n + p.bullets.filter(hasText).length, 0) +
    data.certifications.length +
    data.achievements.filter(hasText).length;

  if (contentUnits <= SPARSE_CONTENT_THRESHOLD) {
    return {
      id: "sparse-content",
      status: "warning",
      title: "Overall detail",
      message: "Add more relevant detail to make the resume more useful.",
    };
  }
  return { id: "sparse-content", status: "pass", title: "Overall detail", message: "Your resume has a reasonable level of detail." };
}

export function getAtsChecklist(data: ResumeData): AtsChecklistResult {
  const contact = checkContactInformation(data);
  const summary = checkSummary(data);
  const experience = checkExperience(data);
  const education = checkEducation(data);
  const skills = checkSkills(data);
  const projects = checkProjects(data);
  const actionVerbs = checkActionVerbs(data);
  const quantifiableAchievements = checkQuantifiableAchievements(data);
  const standardSections = checkStandardSections([contact, summary, experience, education, skills]);
  const sparseContent = checkSparseContent(data);

  return {
    checks: [
      contact,
      summary,
      experience,
      education,
      skills,
      projects,
      actionVerbs,
      quantifiableAchievements,
      standardSections,
      sparseContent,
    ],
  };
}
