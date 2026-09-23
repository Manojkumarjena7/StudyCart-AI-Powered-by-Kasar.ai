import { SectionShell } from "@/components/home/section-shell";
import { ResumeAnalysisMockup } from "@/components/home/mockups/resume-analysis-mockup";

export function ResumeShowcase() {
  return (
    <SectionShell
      eyebrow="Resume"
      title="Build an ATS-friendly resume"
      description="Upload your existing resume or start from scratch. Get ATS feedback, improve your content, choose a professional design, and download your resume."
      cta={{ label: "Build My Resume", href: "/resume" }}
      visual={<ResumeAnalysisMockup />}
    />
  );
}
