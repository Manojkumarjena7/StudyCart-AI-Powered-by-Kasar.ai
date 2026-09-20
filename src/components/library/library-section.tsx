import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface LibrarySectionProps {
  title: string;
  description?: string;
  viewAllHref?: string;
  children: ReactNode;
}

export function LibrarySection({ title, description, viewAllHref, children }: LibrarySectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">{description}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="focus-ring flex shrink-0 items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
