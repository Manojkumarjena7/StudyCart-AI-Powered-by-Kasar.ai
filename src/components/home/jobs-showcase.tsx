import { SectionShell } from "@/components/home/section-shell";
import { JobListingMockup } from "@/components/home/mockups/job-listing-mockup";

export function JobsShowcase() {
  return (
    <SectionShell
      eyebrow="Get Hired"
      title="Find IT jobs, with referral support"
      description="Browse IT job listings with company, role, location, and skills at a glance. Apply directly with the company — and request a referral where one's available."
      badge="Coming soon"
      cta={{ label: "Browse Jobs", href: "/jobs" }}
      visual={<JobListingMockup />}
    />
  );
}
