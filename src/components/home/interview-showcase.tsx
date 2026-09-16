import { SectionShell } from "@/components/home/section-shell";
import { InterviewTrackerMockup } from "@/components/home/mockups/interview-tracker-mockup";
import { getInterviewManagementUrl } from "@/lib/utils/interview-management";

export function InterviewShowcase() {
  const interviewManagementUrl = getInterviewManagementUrl();

  return (
    <SectionShell
      id="interview-support"
      eyebrow="Interview"
      title="Prepare. Practice. Track."
      description="Track interview stages, HR feedback, and outcomes through Interview Management — a dedicated, separate application built for exactly this. It opens in a new tab, whether you're an individual candidate or a coaching institution."
      badge="External application"
      reverse
      cta={{
        label: interviewManagementUrl ? "Open Interview Management" : "Interview Management",
        href: interviewManagementUrl ?? "#",
        external: true,
        disabled: !interviewManagementUrl,
      }}
      visual={<InterviewTrackerMockup />}
    />
  );
}
