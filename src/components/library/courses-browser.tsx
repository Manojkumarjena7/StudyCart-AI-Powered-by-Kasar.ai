"use client";

import { useMemo, useState } from "react";
import type { LibraryCategory, LibraryCourse } from "@/lib/library/types";
import { CategoryFilter } from "@/components/library/category-filter";
import { CourseCard } from "@/components/library/course-card";
import { EmptyState } from "@/components/shared/empty-state";

interface CoursesBrowserProps {
  courses: LibraryCourse[];
  categories: LibraryCategory[];
  initialCategoryId: string | null;
}

export function CoursesBrowser({ courses, categories, initialCategoryId }: CoursesBrowserProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(initialCategoryId);

  const categoryLabelById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.label])),
    [categories]
  );

  const filteredCourses = useMemo(
    () =>
      activeCategoryId ? courses.filter((course) => course.categoryId === activeCategoryId) : courses,
    [courses, activeCategoryId]
  );

  return (
    <div>
      <CategoryFilter
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />

      <div className="mt-6">
        {filteredCourses.length === 0 ? (
          <EmptyState
            title="No courses in this category yet"
            description="Try a different category, or check back soon as new courses are added."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                categoryLabel={categoryLabelById.get(course.categoryId) ?? course.categoryId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
