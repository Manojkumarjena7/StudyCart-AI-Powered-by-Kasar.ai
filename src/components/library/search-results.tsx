import Link from "next/link";
import type { LibraryCourse, LibraryResource } from "@/lib/library/types";
import { CourseCard } from "@/components/library/course-card";
import { ResourceCard } from "@/components/library/resource-card";
import { EmptyState } from "@/components/shared/empty-state";

interface SearchResultsProps {
  query: string;
  courses: LibraryCourse[];
  resources: LibraryResource[];
  categoryLabel: (categoryId: string) => string;
}

export function SearchResults({ query, courses, resources, categoryLabel }: SearchResultsProps) {
  const hasResults = courses.length > 0 || resources.length > 0;

  return (
    <div className="mt-6 rounded-2xl border border-border-subtle bg-bg-card p-5 text-left shadow-card sm:p-6">
      <p className="text-xs font-medium text-text-secondary">
        Results for <span className="text-text-primary">&ldquo;{query}&rdquo;</span>
      </p>

      {!hasResults ? (
        <div className="mt-4">
          <EmptyState
            title="No matches yet"
            description="Try a different keyword, or browse courses and study materials directly."
          />
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {courses.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Courses
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {courses.slice(0, 4).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    categoryLabel={categoryLabel(course.categoryId)}
                  />
                ))}
              </div>
            </div>
          )}

          {resources.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Study Materials
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {resources.slice(0, 4).map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    categoryLabel={categoryLabel(resource.categoryId)}
                  />
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/library/materials?q=${encodeURIComponent(query)}`}
            className="focus-ring inline-block text-sm font-medium text-brand-blue hover:underline"
          >
            See all matching study materials →
          </Link>
        </div>
      )}
    </div>
  );
}
