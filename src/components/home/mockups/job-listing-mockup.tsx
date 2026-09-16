import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { cn } from "@/lib/utils/cn";

const JOBS = [
  { role: "Frontend Engineer", company: "Nimbus Labs", location: "Remote", referral: true, active: true },
  { role: "QA Automation Engineer", company: "Pivot Systems", location: "Bengaluru", referral: false, active: false },
  { role: "Backend Developer", company: "Orbit Cloud", location: "Hyderabad", referral: true, active: false },
];

/** Illustrative job-listing + detail panel — see docs/DESIGN-SYSTEM.md §Assets. */
export function JobListingMockup() {
  const active = JOBS.find((j) => j.active) ?? JOBS[0];

  return (
    <div className="grid w-full gap-4 sm:grid-cols-[1.1fr_1fr]">
      <div className="space-y-2 rounded-2xl border border-border-subtle bg-bg-card p-3 shadow-card">
        {JOBS.map((job) => (
          <div
            key={job.role}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5",
              job.active
                ? "border-brand-cyan/40 bg-brand-cyan/10"
                : "border-transparent hover:border-border-subtle"
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-overlay-soft">
              <Building2 className="h-4 w-4 text-text-secondary" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-text-primary">{job.role}</p>
              <p className="truncate text-[11px] text-text-secondary">{job.company}</p>
            </div>
            {job.referral && (
              <Badge variant="trending" className="shrink-0 px-2 py-0.5 text-[10px]">
                Referral
              </Badge>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-card">
        <p className="text-sm font-semibold text-text-primary">{active.role}</p>
        <p className="mt-0.5 text-xs text-text-secondary">{active.company}</p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-secondary">
          <MapPin className="h-3 w-3" />
          {active.location}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["React", "TypeScript", "Next.js"].map((skill) => (
            <span key={skill} className="rounded-full bg-overlay-soft px-2 py-0.5 text-[10px] text-text-secondary">
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <Button variant="gradient" size="sm" className="flex-1" type="button">
            Apply externally
          </Button>
          {active.referral && (
            <Button variant="secondary" size="sm" type="button">
              Referral
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
