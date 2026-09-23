"use client";

import { useState } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { SupportModal } from "@/components/shared/support-modal";
import { cn } from "@/lib/utils/cn";
import type { ResumeData } from "@/lib/resume/types";
import { printResume } from "@/lib/resume/print-resume";
import { TemplateRenderer, type ResumeTemplateId } from "@/components/resume/templates/registry";
import { ResumePagePreview } from "@/components/resume/templates/resume-page-preview";
import { PrintableResume } from "@/components/resume/templates/printable-resume";
import { ResumeEditorPanel, EDITOR_SECTION_IDS, type EditorSectionKey } from "./resume-editor-panel";
import { ResumeAtsPanel } from "./resume-ats-panel";
import { ResumeDesignPanel } from "./resume-design-panel";
import { ResumeImprovePanel } from "./resume-improve-panel";

interface ResumeWorkspaceProps {
  resumeData: ResumeData;
  onChange: (next: ResumeData) => void;
  uncertainFields: string[];
  templateId: ResumeTemplateId;
  onChangeTemplateId: (id: ResumeTemplateId) => void;
}

/** Desktop shows 4 tabs driving the LEFT pane only — the RIGHT pane (preview)
 * is always visible next to whichever one is active, so there's no "preview"
 * tab on desktop. Mobile has no room for two panes side by side, so "preview"
 * becomes a 5th selectable tab there instead. */
type WorkspaceTab = "edit" | "design" | "ats" | "improve" | "preview";

const DESKTOP_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "design", label: "Design" },
  { id: "ats", label: "ATS" },
  { id: "improve", label: "Improve" },
];

const MOBILE_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
  { id: "design", label: "Design" },
  { id: "ats", label: "ATS" },
  { id: "improve", label: "Improve" },
];

/** Maps an ATS/Improve check id to the editor section it's about, so clicking
 * a suggestion can jump the user straight there. Checks with no single
 * corresponding section ("standard-sections", "sparse-content" — both are
 * whole-resume overviews, not about one field) are intentionally left out and
 * simply aren't clickable. */
const CHECK_TO_SECTION: Partial<Record<string, EditorSectionKey>> = {
  contact: "contact",
  summary: "summary",
  experience: "experience",
  education: "education",
  skills: "skills",
  projects: "projects",
  "action-verbs": "experience",
  "quantifiable-achievements": "experience",
};

/**
 * THE canonical Resume Workspace, redesigned in Phase 5d around a document-
 * editor interaction model (see docs/RESUME-ENHANCEMENT.md §Resume Builder —
 * Phase 5d) instead of Phase 2–5c's permanently-visible two-column form:
 *
 *                     ResumeData
 *                         |
 *      +----------+----------+-----------+-----------+
 *      v          v          v           v           v
 *   Edit tab   Design tab  ATS tab   Improve tab  Preview (always visible,
 *  (accordion)                                     desktop right pane /
 *                                                   mobile "Preview" tab)
 *
 * All five read and write the exact same ResumeData/templateId state — no
 * separate copies, no second ATS engine (Improve reuses getAtsChecklist(),
 * just filtered to actionable items), no second template list (Design reuses
 * the same RESUME_TEMPLATES registry as everywhere else).
 *
 * Desktop: the 4 real tabs (Edit/Design/ATS/Improve) switch what's in the left
 * pane; the right pane is always the live preview. Mobile: no room for two
 * panes, so Preview becomes a 5th tab and only one pane is ever shown.
 *
 * Layout stability (the Phase 5d bug fix): this component fills its parent's
 * fixed viewport-height shell exactly (`h-full flex flex-col`, `min-h-0` on
 * the scrollable middle row) — see app/resume/build/page.tsx. Neither pane
 * relies on the page growing taller than the viewport, which is what
 * previously let the browser's own scrollbar toggle on/off and feed back into
 * the live-preview's auto-fit scale calculation (see resume-page-preview.tsx).
 *
 * "Download PDF" uses the browser's own print dialog against a second, unscaled
 * mount of the exact same <TemplateRenderer> + ResumeData used above — never a
 * separate jsPDF/PDF-layout engine. See print-resume.ts and printable-resume.tsx.
 */
export function ResumeWorkspace({ resumeData, onChange, uncertainFields, templateId, onChangeTemplateId }: ResumeWorkspaceProps) {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("edit");
  const [activeSection, setActiveSection] = useState<EditorSectionKey | null>("contact");

  function handleSelectCheck(checkId: string) {
    const targetSection = CHECK_TO_SECTION[checkId];
    if (!targetSection) return;
    setActiveTab("edit");
    setActiveSection(targetSection);
    // Wait a frame so the Edit tab's content is actually visible (not
    // `display:none`) before asking the browser to scroll to it.
    requestAnimationFrame(() => {
      document.getElementById(EDITOR_SECTION_IDS[targetSection])?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const showLeftPane = activeTab !== "preview";
  const showRightPane = activeTab === "preview"; // desktop overrides this to always-on below

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-1 py-2 sm:px-0">
        <div className="flex gap-1 overflow-x-auto">
          {/* Desktop tab set (no Preview — the right pane is always visible). */}
          <div className="hidden gap-1 lg:flex">
            {DESKTOP_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "focus-ring rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeTab === tab.id ? "bg-overlay-soft text-text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Mobile tab set (includes Preview, since there's only one visible pane). */}
          <div className="flex gap-1 lg:hidden">
            {MOBILE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "focus-ring shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
                  activeTab === tab.id ? "bg-overlay-soft text-text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <Button type="button" variant="gradient" size="sm" onClick={() => setShowSupportModal(true)}>
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </Button>
      </div>

      {uncertainFields.length > 0 && (
        <div className="flex shrink-0 items-center gap-2 px-1 py-2 text-xs text-text-secondary sm:px-0">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning" />
          Please review the fields marked <span className="font-medium text-warning">Please check</span> in Edit —
          we weren&apos;t fully confident about them.
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* LEFT pane: tab content. Always shown on desktop; shown on mobile
            whenever the active tab isn't "preview". */}
        <div className={cn(!showLeftPane && "hidden", "lg:block", "min-h-0 overflow-y-auto pr-1")}>
          {activeTab === "design" ? (
            <ResumeDesignPanel templateId={templateId} onChange={onChangeTemplateId} />
          ) : activeTab === "ats" ? (
            <ResumeAtsPanel resumeData={resumeData} onSelectCheck={handleSelectCheck} />
          ) : activeTab === "improve" ? (
            <ResumeImprovePanel resumeData={resumeData} onSelectCheck={handleSelectCheck} />
          ) : (
            <ResumeEditorPanel
              resumeData={resumeData}
              onChange={onChange}
              uncertainFields={uncertainFields}
              activeSection={activeSection}
              onActiveSectionChange={setActiveSection}
            />
          )}
        </div>

        {/* RIGHT pane: the live preview. Always shown on desktop (`lg:block`
            unconditionally); on mobile only when its own tab is active. No
            `sticky` here — the grid row itself doesn't scroll (each pane owns
            its own internal scroll area instead), so there's nothing for a
            sticky position to stick against. */}
        <div className={cn(!showRightPane && "hidden", "lg:block", "min-h-0 overflow-hidden")}>
          <div className="flex h-full min-h-[420px] flex-col rounded-2xl border border-border-subtle bg-bg-secondary p-3 sm:p-4">
            <ResumePagePreview>
              <TemplateRenderer templateId={templateId} data={resumeData} />
            </ResumePagePreview>
          </div>
        </div>
      </div>

      {/* Hidden on screen; shown only for @media print — see printable-resume.tsx. */}
      <PrintableResume>
        <TemplateRenderer templateId={templateId} data={resumeData} />
      </PrintableResume>

      <SupportModal
        context={showSupportModal ? "kasartech" : null}
        onContinueDownload={() => printResume(resumeData.personalInfo.fullName)}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
