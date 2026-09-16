import { CheckCircle2, Circle } from "lucide-react";
import { SectionShell } from "@/components/home/section-shell";
import { cn } from "@/lib/utils/cn";

const TOOLS = [
  { label: "AI Result Analyzer", live: true },
  { label: "Books & Study Material", live: false },
  { label: "Mock Tests", live: false },
  { label: "Notes", live: false },
];

function GovernmentToolsPreview() {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card p-4">
      <ul className="space-y-2.5">
        {TOOLS.map((tool) => (
          <li key={tool.label} className="flex items-center gap-2 text-xs">
            {tool.live ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
            )}
            <span className={cn(tool.live ? "text-text-primary" : "text-text-secondary")}>{tool.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GovernmentJobsSection() {
  return (
    <SectionShell
      eyebrow="Government Jobs"
      title="Preparing for Government Jobs?"
      description="Access answer-key analysis, exam resources, books, and other government-exam tools through our dedicated Government Job platform."
      badge="Secondary platform"
      tone="secondary"
      cta={{ label: "Explore Government Jobs", href: "/analyzer" }}
      visual={<GovernmentToolsPreview />}
    />
  );
}
