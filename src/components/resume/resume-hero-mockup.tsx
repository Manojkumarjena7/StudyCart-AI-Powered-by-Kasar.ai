import { CheckSquare, ShieldCheck, Briefcase, Sparkles } from "lucide-react";

const BADGES = [
  { label: "Clean Structure", icon: CheckSquare },
  { label: "ATS Friendly", icon: ShieldCheck },
  { label: "Includes Projects", icon: Briefcase },
  { label: "Professional Format", icon: Sparkles },
];

/** Illustrative resume mockup for the hero — not a real screenshot. See docs/DESIGN-SYSTEM.md §Assets. */
export function ResumeHeroMockup() {
  return (
    <div className="relative w-full max-w-md">
      <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-card">
        <p className="text-lg font-semibold text-text-primary">Aman Kumar</p>
        <p className="text-xs text-brand-cyan-light">QA Automation Engineer</p>
        <p className="mt-1 text-[10px] text-text-secondary">
          aman.kumar@example.com · +91 98765 43210 · Bengaluru, India
        </p>

        <div className="mt-4 h-px w-full bg-border-subtle" />

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          Summary
        </p>
        <div className="mt-1.5 space-y-1">
          <div className="h-1 w-full rounded-sm bg-overlay-soft" />
          <div className="h-1 w-5/6 rounded-sm bg-overlay-soft" />
        </div>

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          Skills
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {["Selenium", "Python", "Playwright", "API Testing", "Jenkins"].map((skill) => (
            <span key={skill} className="rounded-full bg-overlay-soft px-2 py-0.5 text-[9px] text-text-secondary">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          Experience
        </p>
        <p className="mt-1.5 text-[10px] font-medium text-text-primary">QA Automation Engineer</p>
        <p className="text-[9px] text-text-secondary">ABC Technologies, Bengaluru · Jan 2022 – Present</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-2 self-end rounded-full border border-border-subtle bg-bg-card px-3 py-1.5 shadow-card"
          >
            <badge.icon className="h-3.5 w-3.5 text-success" />
            <span className="text-[11px] font-medium text-text-primary">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
