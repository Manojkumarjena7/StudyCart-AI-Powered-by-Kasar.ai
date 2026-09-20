"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/shared/ui/input";
import { SearchResults } from "@/components/library/search-results";
import { getLibraryRepository } from "@/lib/library/repository";
import type { LibraryCategory, LibrarySearchResult } from "@/lib/library/types";

const repository = getLibraryRepository();

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
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, PDFs, topics..."
          className="pl-11"
          aria-label="Search the Learning Library"
        />
      </div>

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
