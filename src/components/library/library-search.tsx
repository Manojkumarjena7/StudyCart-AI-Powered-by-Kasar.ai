"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/shared/ui/input";
import { SearchResults } from "@/components/library/search-results";
import { getLibraryRepository } from "@/lib/library/repository";
import type { LibraryCategory, LibrarySearchResult } from "@/lib/library/types";

const repository = getLibraryRepository();

// Real tags already present in src/config/library-data.ts — not fabricated terms.
const POPULAR_SEARCHES = ["Python", "Selenium", "Playwright", "API Testing", "GenAI", "SQL"];

export function LibrarySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LibrarySearchResult>({ courses: [], resources: [] });
  const [categories, setCategories] = useState<LibraryCategory[]>([]);

  useEffect(() => {
    repository.listCategories().then(setCategories);
  }, []);

  useEffect(() => {
    let active = true;
    repository.search(query).then((result) => {
      if (active) setResults(result);
    });
    return () => {
      active = false;
    };
  }, [query]);

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((category) => [category.id, category.label]));
    return (categoryId: string) => map.get(categoryId) ?? categoryId;
  }, [categories]);

  const trimmedQuery = query.trim();

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, PDFs, topics..."
          className="h-14 rounded-xl pl-14 text-base shadow-card"
          aria-label="Search the Learning Library"
        />
      </div>

      {trimmedQuery.length === 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-left">
          <span className="text-xs font-medium text-text-secondary">Popular:</span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="focus-ring rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-brand-cyan/40 hover:text-text-primary"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {trimmedQuery.length > 0 && (
        <SearchResults
          query={trimmedQuery}
          courses={results.courses}
          resources={results.resources}
          categoryLabel={categoryLabel}
        />
      )}
    </div>
  );
}
