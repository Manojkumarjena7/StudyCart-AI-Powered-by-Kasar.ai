import { SectionShell } from "@/components/home/section-shell";
import { ResumeAnalysisMockup } from "@/components/home/mockups/resume-analysis-mockup";

export function ResumeShowcase() {
  return (
    <SectionShell
      eyebrow="Resume"
      title="Upload once. Know exactly what to fix."
      description="Your resume is checked against a curated reference library of strong fresher, developer, and QA resumes — you get clear, specific issues and suggestions, not a black-box score. Request an enhanced version when you're ready."
      badge="Coming soon"
      cta={{ label: "Improve My Resume", href: "/resume" }}
      visual={<ResumeAnalysisMockup />}
    />
  );
}
