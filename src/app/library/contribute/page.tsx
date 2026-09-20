import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { getLibraryRepository } from "@/lib/library/repository";
import { ContributionForm } from "@/components/library/contribution-form";

export const metadata: Metadata = {
  title: `Contribute a Study Material — ${brandConfig.productName}`,
  description: "Share a PDF resource with the KasarTech.ai community. Submissions are reviewed before publishing.",
};

export default async function LibraryContributePage() {
  const categories = await getLibraryRepository().listCategories();

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

      <div className="mt-10">
        <ContributionForm categories={categories} />
      </div>
    </div>
  );
}
