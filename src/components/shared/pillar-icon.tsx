import { FileText, BookOpen, Briefcase, MessagesSquare, Landmark, type LucideIcon } from "lucide-react";

// Resolves the string `icon` keys stored in src/config/platform.ts to components.
// Keeping icon names as data (not component references) in platform.ts is what makes
// that config safe to eventually drive from an admin-managed source — see
// docs/ARCHITECTURE.md "Service catalog model".
const ICONS: Record<string, LucideIcon> = {
  FileText,
  BookOpen,
  Briefcase,
  MessagesSquare,
  Landmark,
};

export function PillarIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? FileText;
  return <Icon className={className} />;
}
