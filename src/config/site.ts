import { brandConfig } from "./brand";

export const trustIndicators = [
  "Instant Analysis",
  "Privacy Focused",
  "Community Ranking",
  "Detailed Performance",
] as const;

export const categoryOptions = [
  { value: "General", label: "General / UR" },
  { value: "SEBC", label: "SEBC / OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
] as const;

export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Prefer Not to Say", label: "Prefer Not to Say" },
] as const;

export const rankingDisclaimer = `Community rankings are calculated only from results analyzed through ${brandConfig.productName} and are not official examination rankings.`;

export interface EcosystemModule {
  label: string;
  description: string;
  href: string;
  status: "live" | "coming-soon";
}

// Centralized so the homepage ecosystem preview and future module routes
// stay in sync — add a new module here when it's ready to ship.
export const ecosystemModules: EcosystemModule[] = [
  {
    label: "Exam Analyzer",
    description: "Score, accuracy, and subject-wise performance from your response sheet.",
    href: "/analyzer",
    status: "live",
  },
  {
    label: "Books & Study Materials",
    description: "A curated library of books and study materials for exam preparation.",
    href: "/books",
    status: "coming-soon",
  },
  {
    label: "Tuition & Coaching",
    description: "Discover trusted tuition centres and coaching institutes near you.",
    href: "/tuition",
    status: "coming-soon",
  },
  {
    label: "Government & Private Jobs",
    description: "Curated, exam-relevant job listings from government and private sources.",
    href: "/jobs",
    status: "coming-soon",
  },
];
