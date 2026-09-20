"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { LibraryCategory, LibraryResource } from "@/lib/library/types";
import { Input } from "@/components/shared/ui/input";
import { Select } from "@/components/shared/ui/select";
import { CategoryFilter } from "@/components/library/category-filter";
import { ResourceCard } from "@/components/library/resource-card";
import { EmptyState } from "@/components/shared/empty-state";

type SortOption = "recommended" | "title-asc";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "title-asc", label: "Title (A–Z)" },
];

interface MaterialsBrowserProps {
  resources: LibraryResource[];
  categories: LibraryCategory[];
  initialCategoryId: string | null;
  initialQuery: string;
}

export function MaterialsBrowser({
  resources,
  categories,
  initialCategoryId,
  initialQuery,
}: MaterialsBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(initialCategoryId);
  const [sort, setSort] = useState<SortOption>("recommended");

  const categoryLabelById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.label])),
    [categories]
  );

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = resources.filter((resource) => {
      const matchesCategory = !activeCategoryId || resource.categoryId === activeCategoryId;
      const matchesQuery =
        !q ||
        resource.title.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      // "recommended": featured resources first, stable order otherwise
      return Number(b.featured) - Number(a.featured);
    });

    return list;
  }, [resources, query, activeCategoryId, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search PDFs..."
            className="h-12 pl-11 text-base"
            aria-label="Search study materials"
          />
        </div>
        <Select
          options={SORT_OPTIONS}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="h-12 sm:w-48"
          aria-label="Sort study materials"
        />
      </div>

      <div className="mt-5">
        <CategoryFilter
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />
      </div>

      <div className="mt-8">
        {filteredResources.length === 0 ? (
          <EmptyState
            title="No study materials found"
            description="Try a different search term or category filter."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                categoryLabel={categoryLabelById.get(resource.categoryId) ?? resource.categoryId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
