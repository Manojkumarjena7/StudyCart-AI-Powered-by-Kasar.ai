import { ResumeExampleCard } from "@/components/resume/resume-example-card";
import type { ResumeExample } from "@/config/resume-examples";

interface ResumeExamplesGridProps {
  examples: ResumeExample[];
  onView: (example: ResumeExample) => void;
  onRequestDownload: (example: ResumeExample, format: "pdf" | "docx") => void;
}

/**
 * Balanced, non-scrolling grid for exactly 3 templates today — 1 column on mobile,
 * 2 on tablet, 3 (equal-width, centered) on desktop. No horizontal scroll/carousel
 * machinery: with a small, fixed template count there's nothing to scroll through.
 */
export function ResumeExamplesGrid({ examples, onView, onRequestDownload }: ResumeExamplesGridProps) {
  return (
    <div
      role="region"
      aria-label="Resume templates"
      className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {examples.map((example) => (
        <ResumeExampleCard
          key={example.id}
          example={example}
          onView={onView}
          onRequestDownload={onRequestDownload}
        />
      ))}
    </div>
  );
}
