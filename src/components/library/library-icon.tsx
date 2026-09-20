import {
  Code2,
  Braces,
  TestTube2,
  Globe2,
  Atom,
  Sparkles,
  Brain,
  TrendingUp,
  Video,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";

// Resolves the string `icon`/`thumbnailIcon` keys stored in src/config/library-data.ts
// to components — icon names are data, not component references, matching
// src/components/shared/pillar-icon.tsx's convention so this stays safe to eventually
// drive from an admin-managed source.
const ICONS: Record<string, LucideIcon> = {
  Code2,
  Braces,
  TestTube2,
  Globe2,
  Atom,
  Sparkles,
  Brain,
  TrendingUp,
  Video,
  FileText,
  Users,
};

export function LibraryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? FileText;
  return <Icon className={className} />;
}
