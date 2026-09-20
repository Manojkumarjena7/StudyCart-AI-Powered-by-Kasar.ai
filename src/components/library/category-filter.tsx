"use client";

import { cn } from "@/lib/utils/cn";
import type { LibraryCategory } from "@/lib/library/types";

interface CategoryFilterProps {
  categories: LibraryCategory[];
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, activeCategoryId, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "focus-ring rounded-full border px-5 py-2 text-sm font-medium transition-colors",
          activeCategoryId === null
            ? "border-brand-blue bg-brand-blue text-white"
            : "border-border-subtle text-text-secondary hover:text-text-primary"
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            "focus-ring rounded-full border px-5 py-2 text-sm font-medium transition-colors",
            activeCategoryId === category.id
              ? "border-brand-blue bg-brand-blue text-white"
              : "border-border-subtle text-text-secondary hover:text-text-primary"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
