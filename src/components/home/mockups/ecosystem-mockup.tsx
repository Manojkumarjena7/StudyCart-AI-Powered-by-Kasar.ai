import { FileText, BookOpen, Briefcase, Mic } from "lucide-react";

const NODES = [
  { label: "Resume", icon: FileText, pos: "top-2 left-1/2 -translate-x-1/2" },
  { label: "Learn", icon: BookOpen, pos: "top-1/2 right-2 -translate-y-1/2" },
  { label: "Get Hired", icon: Briefcase, pos: "bottom-2 left-1/2 -translate-x-1/2" },
  { label: "Interview", icon: Mic, pos: "top-1/2 left-2 -translate-y-1/2" },
];

/** Illustrative "one platform" ecosystem panel — see docs/DESIGN-SYSTEM.md §Assets. */
export function EcosystemMockup() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-card">
      <svg className="absolute inset-6" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <line x1="50" y1="50" x2="50" y2="10" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="50" y1="50" x2="90" y2="50" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="50" y1="50" x2="50" y2="90" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="50" y1="50" x2="10" y2="50" stroke="var(--color-border)" strokeWidth="1" />
      </svg>

      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan-light text-xs font-semibold text-white shadow-card">
        StudyCart
      </span>

      {NODES.map((node) => (
        <div key={node.label} className={`absolute flex flex-col items-center gap-1.5 ${node.pos}`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary">
            <node.icon className="h-4.5 w-4.5 text-brand-cyan-light" />
          </span>
          <span className="text-[10px] font-medium text-text-secondary">{node.label}</span>
        </div>
      ))}
    </div>
  );
}
