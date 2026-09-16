import { cn } from "@/lib/utils/cn";
import type { ResumeExample } from "@/config/resume-examples";

const ACCENTS: Record<ResumeExample["accent"], string> = {
  blue: "from-brand-blue/15 to-brand-blue/5 text-brand-blue",
  cyan: "from-brand-cyan/15 to-brand-cyan/5 text-brand-cyan-light",
  violet: "from-violet-500/15 to-violet-500/5 text-violet-500",
};

/**
 * Lightweight CSS-built resume preview — not a rendered PDF page or an image, so the
 * card never loads the actual PDF just to show a thumbnail. See
 * docs/DESIGN-SYSTEM.md §Assets.
 */
export function ResumeThumbnail({ example, className }: { example: ResumeExample; className?: string }) {
  const accent = ACCENTS[example.accent];

  return (
    <div
      className={cn(
        "flex aspect-[3/4] w-full flex-col gap-2.5 overflow-hidden rounded-lg border border-border-subtle bg-bg-card p-4",
        className
      )}
      aria-hidden="true"
    >
      <div className={cn("h-2.5 w-2/3 rounded-sm bg-gradient-to-r", accent)} />
      <div className="h-1.5 w-2/5 rounded-sm bg-overlay-strong" />
      <div className="mt-1 h-px w-full bg-border-subtle" />
      <div className="space-y-1">
        <div className="h-1 w-full rounded-sm bg-overlay-soft" />
        <div className="h-1 w-full rounded-sm bg-overlay-soft" />
        <div className="h-1 w-3/4 rounded-sm bg-overlay-soft" />
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("h-2.5 w-9 rounded-full bg-gradient-to-r opacity-70", accent)} />
        ))}
      </div>
      <div className="mt-1 h-1 w-1/3 rounded-sm bg-overlay-strong" />
      <div className="space-y-1">
        <div className="h-1 w-full rounded-sm bg-overlay-soft" />
        <div className="h-1 w-5/6 rounded-sm bg-overlay-soft" />
      </div>
      <div className="mt-1 h-1 w-1/3 rounded-sm bg-overlay-strong" />
      <div className="space-y-1">
        <div className="h-1 w-full rounded-sm bg-overlay-soft" />
        <div className="h-1 w-2/3 rounded-sm bg-overlay-soft" />
      </div>
    </div>
  );
}
