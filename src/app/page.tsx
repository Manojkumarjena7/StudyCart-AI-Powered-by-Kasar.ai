import { Hero } from "@/components/home/hero";
import { HowItHelps } from "@/components/home/how-it-helps";
import { ResumeShowcase } from "@/components/home/resume-showcase";
import { LibraryShowcase } from "@/components/home/library-showcase";
import { JobsShowcase } from "@/components/home/jobs-showcase";
import { InterviewShowcase } from "@/components/home/interview-showcase";
import { GovernmentJobsSection } from "@/components/home/government-jobs-section";
import { TechnologySection } from "@/components/home/technology-section";
import { ShortcutsSection } from "@/components/home/shortcuts-section";
import { KasarTechEcosystem } from "@/components/ecosystem";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItHelps />
      <ResumeShowcase />
      <LibraryShowcase />
      <JobsShowcase />
      <InterviewShowcase />
      <GovernmentJobsSection />
      <TechnologySection />
      <ShortcutsSection />
      <KasarTechEcosystem />
      <FinalCta />
    </>
  );
}
