/**
 * Central service-catalog config for StudyCart AI Interview Support.
 * See docs/ARCHITECTURE.md "Service catalog model" — this is the single source of
 * truth for domain pillars; do not duplicate pillar metadata in components.
 *
 * Phase 1 scope: top-level pillars only (drives navbar/footer). Per-pillar `services`
 * lists are populated in later phases as Resume/Library/Jobs are actually built.
 */

export type ServiceStatus = "LIVE" | "IN_PROGRESS" | "COMING_SOON" | "PLANNED" | "PROPOSED";

export type PlatformDomain =
  | "resume"
  | "library"
  | "jobs"
  | "interview-support"
  | "government-jobs"
  | "student-services";

export interface PlatformService {
  id: string;
  title: string;
  description: string;
  icon: string; // resolved via src/components/shared/pillar-icon.tsx
  href: string;
  status: ServiceStatus;
  badge?: string;
  external?: boolean;
  domain: PlatformDomain;
}

export interface PlatformPillar {
  id: string;
  /** Full name, used in headings/cards. */
  title: string;
  /** Short label for nav — may differ from title (e.g. "Get Hired" vs "IT Jobs"). */
  navLabel: string;
  description: string;
  icon: string;
  href: string;
  status: ServiceStatus;
  domain: PlatformDomain;
  external?: boolean;
  services: PlatformService[];
}

// Interview Support has no internal route — resolve its href from
// NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL at render time (see Navbar), never hardcode a
// production URL here. See docs/INTERVIEW-MANAGEMENT.md.
export const INTERVIEW_MANAGEMENT_ENV_VAR = "NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL";

export const platformPillars: PlatformPillar[] = [
  {
    id: "resume",
    title: "Resume",
    navLabel: "Resume",
    description: "Upload your resume for AI-assisted analysis and enhancement.",
    icon: "FileText",
    href: "/resume",
    status: "PLANNED",
    domain: "resume",
    services: [],
  },
  {
    id: "library",
    title: "Learning Library",
    navLabel: "Learn",
    description: "Curated technical, interview-prep, and career learning content.",
    icon: "BookOpen",
    href: "/library",
    status: "PLANNED",
    domain: "library",
    services: [],
  },
  {
    id: "jobs",
    title: "IT Jobs",
    navLabel: "Get Hired",
    description: "IT job listings with referral support.",
    icon: "Briefcase",
    href: "/jobs",
    status: "COMING_SOON",
    domain: "jobs",
    services: [],
  },
  {
    id: "interview-support",
    title: "Interview Support",
    navLabel: "Interview Support",
    description: "Track interviews, HR feedback, and outcomes in Interview Management.",
    icon: "MessagesSquare",
    href: "#", // resolved dynamically — see Navbar + docs/INTERVIEW-MANAGEMENT.md
    status: "PLANNED",
    domain: "interview-support",
    external: true,
    services: [],
  },
  {
    id: "government-jobs",
    title: "Government Jobs",
    navLabel: "Government Jobs",
    description: "AI Result Analyzer and government exam tools.",
    icon: "Landmark",
    // Interim routing decision (docs/ROADMAP.md open question #5): the dedicated
    // /government-jobs hub doesn't exist until Phase 8, so this points at the one
    // LIVE entry point today. Revisit when the hub ships.
    href: "/analyzer",
    status: "LIVE",
    domain: "government-jobs",
    services: [],
  },
];
