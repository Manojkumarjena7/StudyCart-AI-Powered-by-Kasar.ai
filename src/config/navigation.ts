import { brandConfig } from "./brand";

export interface NavItem {
  label: string;
  href: string;
  comingSoon?: boolean;
}

// Domain nav items (Resume/Learn/Get Hired/Interview Support/Government Jobs) come
// from src/config/platform.ts — the single source of truth for pillar metadata. This
// file only holds nav items that aren't a platform pillar: Home, legal, and community.
// See docs/ARCHITECTURE.md "Service catalog model".

export const footerCommunityLinks = [
  { label: "Telegram", key: "telegram" },
  { label: "Instagram", key: "instagram" },
  { label: "LinkedIn", key: "linkedin" },
] as const satisfies readonly { label: string; key: keyof typeof brandConfig.socialLinks }[];

export const footerLegalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "About", href: "/about" },
];
