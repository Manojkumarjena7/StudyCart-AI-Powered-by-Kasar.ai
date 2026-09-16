import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { ResumeHero } from "@/components/resume/resume-hero";
import { ResumeExamplesSection } from "@/components/resume/resume-examples-section";
import { ResumeAnalyzerSection } from "@/components/resume/resume-analyzer-section";
import { ResumeGuideSection } from "@/components/resume/resume-guide-section";
import { SupportStudyCartSection } from "@/components/resume/support-studycart-section";

export const metadata: Metadata = {
  title: `Resume — ${brandConfig.productName}`,
  description:
    "Explore professional IT resume examples, check your own resume, and learn how to present your skills, projects, and experience better.",
};

export default function ResumePage() {
  return (
    <>
      <ResumeHero />
      <ResumeExamplesSection />
      <ResumeAnalyzerSection />
      <ResumeGuideSection />
      <SupportStudyCartSection />
    </>
  );
}
