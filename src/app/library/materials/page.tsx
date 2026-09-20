import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { getLibraryRepository } from "@/lib/library/repository";
import { MaterialsBrowser } from "@/components/library/materials-browser";

export const metadata: Metadata = {
  title: `Study Materials — ${brandConfig.productName}`,
  description: "Notes, PDFs, cheat sheets, roadmaps and useful resources for IT career preparation.",
};

interface MaterialsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function LibraryMaterialsPage({ searchParams }: MaterialsPageProps) {
  const { category, q } = await searchParams;
  const repository = getLibraryRepository();
  const [resources, categories] = await Promise.all([
    repository.listResources(),
    repository.listCategories(),
  ]);

  const initialCategory = category ? categories.find((c) => c.slug === category) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
        Learning Library
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        Study Materials (PDFs)
      </h1>
      <p className="mt-3 max-w-2xl text-base text-text-secondary">
        Download high-quality study material shared by KasarTech.ai and the community.
      </p>

      <div className="mt-8">
        <MaterialsBrowser
          resources={resources}
          categories={categories}
          initialCategoryId={initialCategory?.id ?? null}
          initialQuery={q ?? ""}
        />
      </div>
    </div>
  );
}
