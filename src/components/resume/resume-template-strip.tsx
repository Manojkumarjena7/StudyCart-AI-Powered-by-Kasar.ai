import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/shared/ui/badge";
import { RESUME_TEMPLATES } from "@/components/resume/templates/registry";
import { cn } from "@/lib/utils/cn";

/**
 * A compact "Popular templates" strip on the Resume product home — reuses the
 * real template registry (no invented templates). Template 01 is clickable and
 * jumps straight into the builder with it pre-selected; Template 02/03 render
 * as non-interactive "Coming soon" cards, matching the picker inside the
 * builder (template-picker-step.tsx) rather than a second, divergent
 * implementation. Deliberately small — this is not a template marketplace. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b.
 */
export function ResumeTemplateStrip() {
  return (
    <section className="border-b border-border-subtle bg-bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-sm font-semibold text-text-primary">Popular templates</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {RESUME_TEMPLATES.map((template) => {
            const isAvailable = template.status === "available";
            const card = (
              <div className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-card">
                <div className="aspect-[900/1273] w-full overflow-hidden bg-white">
                  <Image
                    src={template.previewImagePath}
                    alt={`${template.name} preview`}
                    width={200}
                    height={283}
                    className={cn("h-full w-full object-cover object-top", !isAvailable && "grayscale opacity-60")}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5">
                  <span className="text-xs font-medium text-text-primary">{template.name}</span>
                  <Badge variant={isAvailable ? "success" : "neutral"} className="px-1.5 py-0 text-[9px]">
                    {isAvailable ? "Available" : "Soon"}
                  </Badge>
                </div>
              </div>
            );

            if (!isAvailable) {
              return (
                <div key={template.id} aria-disabled="true" className="cursor-not-allowed">
                  {card}
                </div>
              );
            }

            return (
              <Link key={template.id} href="/resume/build?mode=enhance" className="focus-ring rounded-xl">
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
