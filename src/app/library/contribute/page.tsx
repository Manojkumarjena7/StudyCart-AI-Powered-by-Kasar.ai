import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { getLibraryRepository } from "@/lib/library/repository";
import { isUploadsWritableEnvironment } from "@/lib/library/contribution-store";
import { ContributionForm } from "@/components/library/contribution-form";

export const metadata: Metadata = {
  title: `Contribute a Study Material — ${brandConfig.productName}`,
  description: "Share a PDF resource with the KasarTech.ai community. Submissions are reviewed before publishing.",
};

export default async function LibraryContributePage() {
  const categories = await getLibraryRepository().listCategories();
  const uploadsWritable = isUploadsWritableEnvironment();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
          Learning Library
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Contribute a Study Material
        </h1>
        <p className="mt-4 text-balance text-base text-text-secondary sm:text-lg">
          Share your knowledge with the community. After review, it will be published
          in the Library.
        </p>
      </div>

      {!uploadsWritable && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
          <p className="text-sm text-text-primary">
            <span className="font-semibold">Uploads aren&apos;t available here yet.</span>{" "}
            Contribution uploads are only available in local development for this MVP
            phase — this will be enabled once real storage is connected.
          </p>
        </div>
      )}

      <div className="mt-10">
        <ContributionForm categories={categories} />
      </div>
    </div>
  );
}
