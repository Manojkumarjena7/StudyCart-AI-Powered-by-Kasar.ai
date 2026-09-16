import { Lock, PlayCircle } from "lucide-react";

const ITEMS = [
  { title: "Automation Testing Basics", category: "Automation", locked: false },
  { title: "Manual Testing Playbook", category: "Manual", locked: true },
  { title: "AI for QA Engineers", category: "AI", locked: true },
  { title: "System Design Primer", category: "Programming", locked: true },
  { title: "Interview Question Bank", category: "Interview", locked: false },
  { title: "Career Growth Guide", category: "Career", locked: true },
];

/** Illustrative learning-library panel — see docs/DESIGN-SYSTEM.md §Assets. */
export function LearningLibraryMockup() {
  return (
    <div className="w-full rounded-2xl border border-border-subtle bg-bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-primary">Learning Library</p>
        <span className="rounded-full bg-overlay-soft px-2.5 py-1 text-[11px] text-text-secondary">
          6 categories
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-xl border border-border-subtle bg-bg-secondary p-3"
          >
            <div className="flex h-14 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue/15 to-brand-cyan-light/15">
              <PlayCircle className="h-5 w-5 text-brand-cyan-light" />
            </div>
            <p className="mt-2.5 text-[11px] font-medium leading-snug text-text-primary">{item.title}</p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-text-secondary">{item.category}</span>
              {item.locked && <Lock className="h-3 w-3 text-text-secondary" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
