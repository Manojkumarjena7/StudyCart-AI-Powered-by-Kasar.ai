import type {
  ExtractionResult,
  ResumeCertificationEntry,
  ResumeEducationEntry,
  ResumeExperienceEntry,
  ResumeLink,
  ResumeProjectEntry,
  ResumeSkillGroup,
} from "./types";

/**
 * Deterministic, dependency-free resume text structuring — no AI/LLM, no OCR.
 * Operates on already-extracted plain text (see parser.ts for the PDF-specific
 * wrapper) so it can be unit-tested directly against strings, including synthetic
 * fixtures, without needing a real PDF for most cases.
 *
 * Conservative by design: every heuristic here is pattern/keyword-based against the
 * literal text. Nothing is inferred beyond what a specific rule matched — when a rule
 * doesn't find a confident match, the corresponding field/section is left empty and
 * flagged in `uncertainFields` rather than guessed. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — known extraction limitations for what
 * this intentionally does not attempt to solve.
 */

type SectionKey = "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "achievements";

const MAX_HEADER_LINE_LENGTH = 40;

const SECTION_PATTERNS: Record<SectionKey, RegExp> = {
  summary: /^(professional\s+|career\s+)?(summary|profile|objective|about\s*me)\s*:?$/i,
  experience:
    /^(work\s+|professional\s+|relevant\s+)?experience\s*:?$|^employment(\s+history)?\s*:?$|^work\s+history\s*:?$/i,
  education: /^education(al\s+background)?\s*:?$/i,
  skills: /^(technical\s+|core\s+|key\s+)?skills\s*:?$|^core\s+competenc(y|ies)\s*:?$|^technical\s+proficienc(y|ies)\s*:?$/i,
  projects: /^(key\s+|academic\s+|personal\s+)?projects\s*:?$/i,
  certifications: /^(certifications?|licenses?(\s*(&|and)\s*certifications?)?)\s*:?$/i,
  achievements: /^(achievements?|awards?(\s*(&|and)\s*honors?)?|honors?)\s*:?$/i,
};

const EMAIL_TEST = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const URL_TEST = /(?:https?:\/\/|www\.)\S+|(?:linkedin\.com|github\.com|gitlab\.com)\/\S+/i;
const URL_MATCH_ALL = /(?:https?:\/\/|www\.)[^\s,;()<>]+|(?:linkedin\.com|github\.com|gitlab\.com)\/[^\s,;()<>]+/gi;
const DATE_RANGE_PATTERN =
  /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*(?:-|–|—|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current|Now)/i;
const DEGREE_KEYWORDS = /\b(b\.?\s?tech|m\.?\s?tech|b\.?\s?e\.?|m\.?\s?e\.?|b\.?\s?sc|m\.?\s?sc|bachelor|master|mba|ph\.?d|diploma|associate\s+degree|b\.?\s?a\.?|m\.?\s?a\.?|b\.?\s?com|m\.?\s?com)\b/i;
const INSTITUTION_KEYWORDS = /\b(university|college|institute|school|academy|polytechnic)\b/i;
const BULLET_PREFIX = /^[•●▪◦•●▪◦*\-–—]\s*/;

function stripBulletMarker(line: string): string {
  return line.replace(BULLET_PREFIX, "").trim();
}

function isSectionHeader(line: string): SectionKey | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > MAX_HEADER_LINE_LENGTH) return null;
  for (const key of Object.keys(SECTION_PATTERNS) as SectionKey[]) {
    if (SECTION_PATTERNS[key].test(trimmed)) return key;
  }
  return null;
}

interface SectionSplit {
  header: string[];
  sections: Partial<Record<SectionKey, string[]>>;
}

/** Splits the document into a leading "header" block (name/contact area, before any
 * recognized section) and per-section line lists, based on standalone section-header
 * lines. Blank lines are preserved inside sections as paragraph/entry separators. */
function splitIntoSections(lines: string[]): SectionSplit {
  const header: string[] = [];
  const sections: Partial<Record<SectionKey, string[]>> = {};
  let current: SectionKey | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) {
      if (current) sections[current]!.push("");
      continue;
    }
    const headerKey = isSectionHeader(line);
    if (headerKey) {
      current = headerKey;
      if (!sections[current]) sections[current] = [];
      continue;
    }
    if (current) {
      sections[current]!.push(line.trim());
    } else {
      header.push(line.trim());
    }
  }
  return { header, sections };
}

function splitBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
      continue;
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);
  return blocks;
}

/** Splits blank-line-separated blocks further when a single block clearly contains
 * more than one date range (common when a PDF's extracted text collapses the blank
 * line between two consecutive experience/education entries). */
function splitEntryBlocks(lines: string[]): string[][] {
  const blocks = splitBlocks(lines);
  const result: string[][] = [];
  for (const block of blocks) {
    const dateLineIndexes = block
      .map((line, i) => (DATE_RANGE_PATTERN.test(line) ? i : -1))
      .filter((i) => i !== -1);
    if (dateLineIndexes.length <= 1) {
      result.push(block);
      continue;
    }
    let start = 0;
    for (let k = 1; k < dateLineIndexes.length; k++) {
      result.push(block.slice(start, dateLineIndexes[k]));
      start = dateLineIndexes[k];
    }
    result.push(block.slice(start));
  }
  return result.filter((b) => b.length > 0);
}

function extractEmail(text: string): string | undefined {
  return text.match(EMAIL_TEST)?.[0];
}

function extractPhone(text: string): string | undefined {
  const candidates = text.match(/[+(]?\d[\d\s().-]{7,}\d/g) ?? [];
  for (const candidate of candidates) {
    const digits = candidate.replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 13) return candidate.trim();
  }
  return undefined;
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.replace(/[),.;]+$/, "");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function extractLinks(text: string): ResumeLink[] {
  const matches = text.match(URL_MATCH_ALL) ?? [];
  const seen = new Set<string>();
  const links: ResumeLink[] = [];
  for (const raw of matches) {
    const url = normalizeUrl(raw);
    if (seen.has(url)) continue;
    seen.add(url);
    const label = /linkedin\.com/i.test(url) ? "LinkedIn" : /github\.com|gitlab\.com/i.test(url) ? "GitHub" : "Website";
    links.push({ label, url });
  }
  return links;
}

/** The candidate's name is assumed to be near the very top of the document, on its
 * own line, containing no contact-info punctuation. Conservative on purpose — a
 * false "certain" name is worse than an honestly-flagged blank one. */
function extractName(headerLines: string[]): { name?: string; certain: boolean } {
  for (const line of headerLines.slice(0, 5)) {
    if (EMAIL_TEST.test(line) || URL_TEST.test(line)) continue;
    const digitCount = (line.match(/\d/g) ?? []).length;
    if (digitCount > 2) continue;
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length < 1 || words.length > 5) continue;
    if (line.length > 60) continue;
    return { name: line.trim(), certain: true };
  }
  return { certain: false };
}

function extractLocation(headerLines: string[]): string | undefined {
  for (const line of headerLines.slice(0, 8)) {
    if (EMAIL_TEST.test(line) || URL_TEST.test(line)) continue;
    if (line.length > 50) continue;
    if (/^[A-Za-z][A-Za-z .]*,\s*[A-Za-z][A-Za-z .]*$/.test(line)) return line.trim();
  }
  return undefined;
}

function parseExperienceBlock(block: string[]): { entry: ResumeExperienceEntry; uncertain: boolean } {
  const lines = block.map((l) => l.trim()).filter(Boolean);
  let uncertain = false;

  const dateIdx = lines.findIndex((l) => DATE_RANGE_PATTERN.test(l));
  let startDate: string | undefined;
  let endDate: string | undefined;
  let current = false;
  if (dateIdx !== -1) {
    const match = lines[dateIdx].match(DATE_RANGE_PATTERN);
    if (match) {
      startDate = match[1];
      current = /present|current|now/i.test(match[2]);
      endDate = current ? undefined : match[2];
    }
  } else {
    uncertain = true;
  }

  const headerEndIdx = dateIdx === -1 ? Math.min(1, lines.length) : dateIdx + 1;
  const headerCandidates = lines.slice(0, headerEndIdx).filter((l) => !DATE_RANGE_PATTERN.test(l));

  let role = "";
  let company = "";
  let location: string | undefined;

  if (headerCandidates.length > 0) {
    const first = headerCandidates[0];
    const atSplit = first.split(/\s+at\s+/i);
    if (atSplit.length === 2) {
      role = atSplit[0].trim();
      company = atSplit[1].trim();
    } else {
      const delimParts = first.split(/\s*[–—|]\s*|\s+-\s+|,\s*/).filter(Boolean);
      if (delimParts.length >= 2) {
        role = delimParts[0].trim();
        company = delimParts.slice(1).join(", ").trim();
        uncertain = true; // role/company ordering isn't reliably determinable from text alone
      } else {
        role = first.trim();
        uncertain = true; // company could not be separated out
      }
    }
    if (headerCandidates[1]) location = headerCandidates[1].trim();
  } else {
    uncertain = true;
  }

  const bullets = lines
    .slice(dateIdx === -1 ? headerCandidates.length : dateIdx + 1)
    .map(stripBulletMarker)
    .filter(Boolean);

  return {
    entry: {
      id: crypto.randomUUID(),
      company,
      role,
      location,
      startDate,
      endDate,
      current,
      bullets,
    },
    uncertain,
  };
}

function parseEducationBlock(block: string[]): { entry: ResumeEducationEntry; uncertain: boolean } {
  const lines = block.map((l) => l.trim()).filter(Boolean);
  let uncertain = false;

  const dateIdx = lines.findIndex((l) => DATE_RANGE_PATTERN.test(l));
  let startDate: string | undefined;
  let endDate: string | undefined;
  if (dateIdx !== -1) {
    const match = lines[dateIdx].match(DATE_RANGE_PATTERN);
    if (match) {
      startDate = match[1];
      endDate = /present|current|now/i.test(match[2]) ? undefined : match[2];
    }
  } else {
    uncertain = true;
  }

  const institutionLine = lines.find((l) => INSTITUTION_KEYWORDS.test(l));
  const degreeLine = lines.find((l) => DEGREE_KEYWORDS.test(l));
  if (!institutionLine || !degreeLine) uncertain = true;

  return {
    entry: {
      id: crypto.randomUUID(),
      institution: institutionLine ?? lines[0] ?? "",
      degree: degreeLine ?? "",
      startDate,
      endDate,
    },
    uncertain,
  };
}

function splitSkillItems(text: string): string[] {
  return text
    .split(/[,•;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSkillsSection(lines: string[]): { groups: ResumeSkillGroup[]; uncertain: boolean } {
  const nonEmpty = lines.map((l) => l.trim()).filter(Boolean);
  if (nonEmpty.length === 0) return { groups: [], uncertain: true };

  const labeled: ResumeSkillGroup[] = [];
  const unlabeledLines: string[] = [];
  for (const line of nonEmpty) {
    const labelMatch = line.match(/^([A-Za-z][A-Za-z /&-]{1,30}):\s*(.+)$/);
    if (labelMatch) {
      labeled.push({ id: crypto.randomUUID(), category: labelMatch[1].trim(), items: splitSkillItems(labelMatch[2]) });
    } else {
      unlabeledLines.push(line);
    }
  }

  if (labeled.length > 0) {
    if (unlabeledLines.length > 0) {
      const items = Array.from(new Set(unlabeledLines.flatMap(splitSkillItems).map((s) => s.trim()).filter(Boolean)));
      if (items.length) labeled.push({ id: crypto.randomUUID(), items });
    }
    return { groups: labeled, uncertain: false };
  }

  const items = Array.from(new Set(unlabeledLines.flatMap(splitSkillItems).map((s) => s.trim()).filter(Boolean)));
  return {
    groups: items.length ? [{ id: crypto.randomUUID(), items }] : [],
    uncertain: items.length === 0,
  };
}

function parseProjectBlock(block: string[]): ResumeProjectEntry {
  const lines = block.map((l) => l.trim()).filter(Boolean);
  const name = lines[0] ? stripBulletMarker(lines[0]) : "";
  const linkLine = lines.find((l) => URL_TEST.test(l));
  const bullets = lines
    .slice(1)
    .filter((l) => l !== linkLine)
    .map(stripBulletMarker)
    .filter(Boolean);
  return {
    id: crypto.randomUUID(),
    name,
    bullets,
    link: linkLine ? normalizeUrl(linkLine) : undefined,
  };
}

function parseCertificationLine(line: string): ResumeCertificationEntry {
  const clean = stripBulletMarker(line);
  const parts = clean.split(/\s*[-–—|]\s*/);
  const yearMatch = clean.match(/\b(19|20)\d{2}\b/);
  return {
    id: crypto.randomUUID(),
    name: (parts[0] ?? clean).trim(),
    issuer: parts.length > 1 ? parts.slice(1).join(" - ").replace(yearMatch?.[0] ?? "", "").trim() || undefined : undefined,
    date: yearMatch?.[0],
  };
}

export function extractResumeDataFromText(rawText: string): ExtractionResult {
  const normalized = rawText.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const { header, sections } = splitIntoSections(lines);
  const uncertainFields: string[] = [];

  const email = extractEmail(normalized);
  if (!email) uncertainFields.push("personalInfo.email");

  const phone = extractPhone(normalized);
  if (!phone) uncertainFields.push("personalInfo.phone");

  const { name, certain: nameCertain } = extractName(header);
  if (!nameCertain) uncertainFields.push("personalInfo.fullName");

  const location = extractLocation(header);
  if (!location) uncertainFields.push("personalInfo.location");

  const links = extractLinks(normalized);

  const summary = (sections.summary ?? []).map((l) => l.trim()).filter(Boolean).join(" ");
  if (!summary) uncertainFields.push("summary");

  const experienceBlocks = sections.experience ? splitEntryBlocks(sections.experience) : [];
  const experience: ResumeExperienceEntry[] = [];
  let experienceUncertain = !sections.experience || experienceBlocks.length === 0;
  for (const block of experienceBlocks) {
    const { entry, uncertain } = parseExperienceBlock(block);
    if (!entry.role && !entry.company && entry.bullets.length === 0) continue;
    experience.push(entry);
    if (uncertain) experienceUncertain = true;
  }
  if (experienceUncertain) uncertainFields.push("experience");

  const educationBlocks = sections.education ? splitEntryBlocks(sections.education) : [];
  const education: ResumeEducationEntry[] = [];
  let educationUncertain = !sections.education || educationBlocks.length === 0;
  for (const block of educationBlocks) {
    const { entry, uncertain } = parseEducationBlock(block);
    if (!entry.institution && !entry.degree) continue;
    education.push(entry);
    if (uncertain) educationUncertain = true;
  }
  if (educationUncertain) uncertainFields.push("education");

  const skillsResult = sections.skills ? parseSkillsSection(sections.skills) : { groups: [], uncertain: true };
  if (skillsResult.uncertain) uncertainFields.push("skills");

  const projectBlocks = sections.projects ? splitBlocks(sections.projects) : [];
  const projects = projectBlocks.map(parseProjectBlock).filter((p) => p.name || p.bullets.length > 0);
  if (!sections.projects || projects.length === 0) uncertainFields.push("projects");

  const certificationLines = (sections.certifications ?? []).filter((l) => l.trim());
  const certifications = certificationLines.map(parseCertificationLine).filter((c) => c.name);
  if (!sections.certifications || certifications.length === 0) uncertainFields.push("certifications");

  const achievements = (sections.achievements ?? []).map(stripBulletMarker).filter(Boolean);
  if (!sections.achievements || achievements.length === 0) uncertainFields.push("achievements");

  return {
    data: {
      personalInfo: { fullName: name ?? "", email, phone, location, links },
      summary,
      experience,
      education,
      skills: skillsResult.groups,
      projects,
      certifications,
      achievements,
    },
    uncertainFields,
    rawText: normalized,
  };
}
