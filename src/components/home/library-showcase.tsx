import { SectionShell } from "@/components/home/section-shell";
import { LearningLibraryMockup } from "@/components/home/mockups/learning-library-mockup";

export function LibraryShowcase() {
  return (
    <SectionShell
      eyebrow="Learn"
      title="Learn what actually helps you get hired"
      description="Automation, manual testing, AI, programming, and interview-prep content — curated for IT job readiness, not just general study material."
      badge="Coming soon"
      reverse
      cta={{ label: "Explore the Library", href: "/library" }}
      visual={<LearningLibraryMockup />}
    />
  );
}
