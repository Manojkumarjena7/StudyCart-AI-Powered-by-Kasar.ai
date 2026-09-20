import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { getLibraryRepository } from "@/lib/library/repository";
import { getContributionRepository } from "@/lib/library/contribution-repository";
import { ContributionReviewBoard } from "@/components/library/contribution-review-board";

export const metadata: Metadata = {
  title: `Local Contribution Review — ${brandConfig.productName}`,
  // Deliberately not indexed/linked from navigation — this is a temporary dev tool,
  // not a public or secured admin page. See docs/LEARNING-LIBRARY.md §Contribution MVP.
  robots: { index: false, follow: false },
};

export default async function LibraryContributionsPage() {
  const [contributions, categories] = await Promise.all([
    getContributionRepository().listContributions(),
    getLibraryRepository().listCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
        <p className="text-sm text-text-primary">
          <span className="font-semibold">Local Contribution Review.</span> Temporary
          developer tool for the Phase 2 MVP — there is no authentication, and this
          page is not a secured production admin panel. Authentication, authorization,
          persistent storage and secure admin controls will be implemented in the
          future Supabase/Admin phase.
        </p>
      </div>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        Local Contribution Review
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Review, approve, or reject submitted study materials before they appear in the
        Library.
      </p>

      <div className="mt-8">
        <ContributionReviewBoard contributions={contributions} categories={categories} />
      </div>
    </div>
  );
}
