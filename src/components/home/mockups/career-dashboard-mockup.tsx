import { Sparkles, FileText, Target, Mic } from "lucide-react";
import { Progress } from "@/components/shared/ui/progress";

/**
 * Illustrative "career dashboard" panel — not a real screenshot. Built entirely from
 * design-system tokens so it can be swapped for a real product screenshot/video later
 * (see docs/DESIGN-SYSTEM.md §Assets) without touching any layout that uses it.
 */
const METRICS = [
  { label: "Resume Score", value: 82, icon: FileText },
  { label: "ATS Score", value: 76, icon: Target },
  { label: "Profile Strength", value: 64, icon: Sparkles },
  { label: "Interview Readiness", value: 58, icon: Mic },
];

export function CareerDashboardMockup() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan-light text-sm font-semibold text-white">
            SC
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">Career Readiness</p>
            <p className="text-xs text-text-secondary">Updated just now</p>
          </div>
        </div>
        <span className="rounded-full bg-overlay-soft px-2.5 py-1 text-[11px] font-medium text-text-secondary">
          Preview
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 p-5">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-border-subtle bg-bg-secondary p-3.5">
            <div className="flex items-center justify-between">
              <metric.icon className="h-4 w-4 text-brand-cyan-light" />
              <span className="text-sm font-semibold text-text-primary">{metric.value}%</span>
            </div>
            <p className="mt-2 text-[11px] text-text-secondary">{metric.label}</p>
            <Progress value={metric.value} className="mt-2" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-border-subtle bg-bg-secondary/60 px-5 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <p className="text-xs text-text-secondary">
          Recommended next step: <span className="text-text-primary">tighten your resume summary</span>
        </p>
      </div>
    </div>
  );
}
