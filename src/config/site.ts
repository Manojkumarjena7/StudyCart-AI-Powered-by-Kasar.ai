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
