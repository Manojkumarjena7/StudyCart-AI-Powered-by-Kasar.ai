import { brandConfig } from "./brand";

export interface NavItem {
  label: string;
  href: string;
  comingSoon?: boolean;
}

// Adding a future module = adding one line here. No layout restructuring needed.
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: brandConfig.productShortName, href: "/analyzer" },
  { label: "About", href: "/about" },
  { label: "Jobs", href: "/jobs", comingSoon: true },
  { label: "Books", href: "/books", comingSoon: true },
  { label: "Tuition", href: "/tuition", comingSoon: true },
];

export const footerExploreNav: NavItem[] = mainNav;

export const footerCommunityLinks = [
  { label: "Telegram", key: "telegram" },
  { label: "Instagram", key: "instagram" },
  { label: "LinkedIn", key: "linkedin" },
] as const satisfies readonly { label: string; key: keyof typeof brandConfig.socialLinks }[];

export const footerLegalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
