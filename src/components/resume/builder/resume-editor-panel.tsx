"use client";

import type { ResumeData, ResumeLink } from "@/lib/resume/types";
import {
  AchievementsSection,
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  PersonalInfoSection,
  ProjectsSection,
  SkillsSection,
  SummarySection,
} from "./resume-editor-sections";

export type EditorSectionKey =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "achievements";

interface ResumeEditorPanelProps {
  resumeData: ResumeData;
  onChange: (next: ResumeData) => void;
  uncertainFields: string[];
  /** Which section is currently expanded — `null` collapses everything. This is
   * a *controlled* prop (owned by resume-workspace.tsx) rather than local state,
   * specifically so clicking an ATS/Improve suggestion can expand the relevant
   * section from outside this component (see resume-workspace.tsx's
   * handleSelectCheck). */
  activeSection: EditorSectionKey | null;
  onActiveSectionChange: (key: EditorSectionKey | null) => void;
}

type ListKey = "experience" | "education" | "skills" | "projects" | "certifications";

/** DOM ids the ATS panel scrolls to when a suggestion is clicked (see
 * resume-workspace.tsx's CHECK_TO_SECTION map) — kept in one place since both
 * files need to agree on them. */
export const EDITOR_SECTION_IDS: Record<EditorSectionKey, string> = {
  contact: "section-contact",
  summary: "section-summary",
  experience: "section-experience",
  education: "section-education",
  skills: "section-skills",
  projects: "section-projects",
  certifications: "section-certifications",
  achievements: "section-achievements",
};

/**
 * THE canonical Resume editor — the only field-editing surface in the app.
 * Phase 5d turned it into a document-editor-style accordion (one section
 * expanded at a time, collapsing to a compact summary line) instead of a long
 * form showing every field for every section simultaneously. Used exclusively
 * by resume-workspace.tsx. See docs/RESUME-ENHANCEMENT.md §Resume Builder.
 */
export function ResumeEditorPanel({
  resumeData,
  onChange,
  uncertainFields,
  activeSection,
  onActiveSectionChange,
}: ResumeEditorPanelProps) {
  const isUncertain = (key: string) => uncertainFields.includes(key);

  function updatePersonalInfo(patch: Partial<ResumeData["personalInfo"]>) {
    onChange({ ...resumeData, personalInfo: { ...resumeData.personalInfo, ...patch } });
  }

  function updateLinks(links: ResumeLink[]) {
    updatePersonalInfo({ links });
  }

  function updateList<K extends ListKey>(key: K, next: ResumeData[K]) {
    onChange({ ...resumeData, [key]: next });
  }

  function toggle(key: EditorSectionKey) {
    onActiveSectionChange(activeSection === key ? null : key);
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card px-4 sm:px-5">
      <div id={EDITOR_SECTION_IDS.contact} className="scroll-mt-4">
        <PersonalInfoSection
          personalInfo={resumeData.personalInfo}
          isUncertain={isUncertain}
          onUpdate={updatePersonalInfo}
          onUpdateLinks={updateLinks}
          isExpanded={activeSection === "contact"}
          onToggle={() => toggle("contact")}
        />
      </div>

      <div id={EDITOR_SECTION_IDS.summary} className="scroll-mt-4">
        <SummarySection
          summary={resumeData.summary}
          uncertain={isUncertain("summary")}
          onChange={(summary) => onChange({ ...resumeData, summary })}
          isExpanded={activeSection === "summary"}
          onToggle={() => toggle("summary")}
        />
      </div>

      <div id={EDITOR_SECTION_IDS.experience} className="scroll-mt-4">
        <ExperienceSection
          entries={resumeData.experience}
          uncertain={isUncertain("experience")}
          onChange={(next) => updateList("experience", next)}
          isExpanded={activeSection === "experience"}
          onToggle={() => toggle("experience")}
        />
      </div>

      <div id={EDITOR_SECTION_IDS.education} className="scroll-mt-4">
        <EducationSection
          entries={resumeData.education}
          uncertain={isUncertain("education")}
          onChange={(next) => updateList("education", next)}
          isExpanded={activeSection === "education"}
          onToggle={() => toggle("education")}
        />
      </div>

      <div id={EDITOR_SECTION_IDS.skills} className="scroll-mt-4">
        <SkillsSection
          groups={resumeData.skills}
          uncertain={isUncertain("skills")}
          onChange={(next) => updateList("skills", next)}
          isExpanded={activeSection === "skills"}
          onToggle={() => toggle("skills")}
        />
      </div>

      <div id={EDITOR_SECTION_IDS.projects} className="scroll-mt-4">
        <ProjectsSection
          entries={resumeData.projects}
          uncertain={isUncertain("projects")}
          onChange={(next) => updateList("projects", next)}
          isExpanded={activeSection === "projects"}
          onToggle={() => toggle("projects")}
        />
      </div>

      <div id={EDITOR_SECTION_IDS.certifications} className="scroll-mt-4">
        <CertificationsSection
          entries={resumeData.certifications}
          uncertain={isUncertain("certifications")}
          onChange={(next) => updateList("certifications", next)}
          isExpanded={activeSection === "certifications"}
          onToggle={() => toggle("certifications")}
        />
      </div>

      <div id={EDITOR_SECTION_IDS.achievements} className="scroll-mt-4">
        <AchievementsSection
          achievements={resumeData.achievements}
          uncertain={isUncertain("achievements")}
          onChange={(achievements) => onChange({ ...resumeData, achievements })}
          isExpanded={activeSection === "achievements"}
          onToggle={() => toggle("achievements")}
        />
      </div>
    </div>
  );
}
