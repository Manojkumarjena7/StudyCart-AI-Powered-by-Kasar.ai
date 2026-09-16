import Link from "next/link";
import { ArrowRight, FileCheck2, Info } from "lucide-react";

const SHORTCUTS = [
  {
    icon: FileCheck2,
    label: "Already have a response sheet?",
    detail: "Analyze it now with the AI Result Analyzer.",
    href: "/analyzer",
    cta: "Analyze now",
  },
  {
    icon: Info,
    label: "New here?",
    detail: "Learn more about StudyCart and Kasar.ai.",
    href: "/about",
    cta: "About us",
  },
];

export function ShortcutsSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((shortcut) => (
          <Link
            key={shortcut.href}
            href={shortcut.href}
            className="focus-ring group flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-card px-5 py-4 transition-colors hover:border-brand-cyan/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-overlay-soft">
              <shortcut.icon className="h-4.5 w-4.5 text-brand-cyan-light" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-text-primary">{shortcut.label}</span>
              <span className="block text-xs text-text-secondary">{shortcut.detail}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-brand-cyan-light">
              {shortcut.cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
