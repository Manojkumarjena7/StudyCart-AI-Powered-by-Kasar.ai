import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { ResumeBuilderEntrySection } from "@/components/resume/resume-builder-entry-section";
import { ResumeRecentList } from "@/components/resume/resume-recent-list";
import { ResumeTemplateStrip } from "@/components/resume/resume-template-strip";
import { ResumeExamplesSection } from "@/components/resume/resume-examples-section";
import { ResumeGuideSection } from "@/components/resume/resume-guide-section";
import { SupportStudyCartSection } from "@/components/resume/support-studycart-section";

export const metadata: Metadata = {
  title: `Resume — ${brandConfig.productName}`,
  description:
    "Upload your resume or start from scratch, improve it with ATS feedback, and download a professional, ATS-friendly resume.",
};

/**
 * The Resume product home — a start screen, not a marketing landing page. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b for the reasoning
 * behind this ordering: the two primary actions and product-relevant content
 * (recent resumes, templates) come first; the pre-existing static example
 * gallery, writing guide, and support section — all still useful, all
 * unmodified — are kept further down rather than removed.
 */
export default function ResumePage() {
  return (
    <>
      <ResumeBuilderEntrySection />
      <ResumeRecentList />
      <ResumeTemplateStrip />
      <ResumeExamplesSection />
      <ResumeGuideSection />
      <SupportStudyCartSection />
    </>
  );
}
