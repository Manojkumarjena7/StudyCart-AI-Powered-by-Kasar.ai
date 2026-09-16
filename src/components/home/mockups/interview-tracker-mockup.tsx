import { Check } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import { cn } from "@/lib/utils/cn";

const STAGES = [
  { label: "Applied", state: "done" },
  { label: "Scheduled", state: "done" },
  { label: "Interview Round 1", state: "current" },
  { label: "Feedback", state: "pending" },
  { label: "Result", state: "pending" },
] as const;

/** Illustrative interview-tracking panel — see docs/DESIGN-SYSTEM.md §Assets. */
export function InterviewTrackerMockup() {
  return (
    <div className="w-full rounded-2xl border border-border-subtle bg-bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-primary">Interview Tracker</p>
        <Badge variant="neutral" className="px-2 py-0.5 text-[10px]">
          Interview Management
        </Badge>
      </div>

      <div className="mt-5 flex items-center">
        {STAGES.map((stage, i) => (
          <div key={stage.label} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                  stage.state === "done" && "border-success bg-success/15 text-success",
                  stage.state === "current" && "border-brand-cyan-light bg-brand-cyan/15 text-brand-cyan-light",
                  stage.state === "pending" && "border-border-subtle text-text-secondary"
                )}
              >
                {stage.state === "done" ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {i < STAGES.length - 1 && (
                <span
                  className={cn(
                    "mx-1 h-px flex-1",
                    stage.state === "done" ? "bg-success/40" : "bg-border-subtle"
                  )}
                />
              )}
            </div>
            <p className="mt-2 text-center text-[10px] leading-tight text-text-secondary">{stage.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-border-subtle bg-bg-secondary px-3 py-2.5 text-xs text-text-secondary">
        Full scheduling, HR feedback, and outcome tracking happen in{" "}
        <span className="text-text-primary">Interview Management</span> — a separate application.
      </div>
    </div>
  );
}
