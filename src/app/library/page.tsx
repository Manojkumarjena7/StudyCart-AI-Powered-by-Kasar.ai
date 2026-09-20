import type { Metadata } from "next";
import Link from "next/link";
import { brandConfig } from "@/config/brand";
import { getLibraryRepository } from "@/lib/library/repository";
import { LibraryHero } from "@/components/library/library-hero";
import { LibraryCategoryCards } from "@/components/library/library-category-cards";
import { LibrarySection } from "@/components/library/library-section";
import { CourseCard } from "@/components/library/course-card";
import { ResourceCard } from "@/components/library/resource-card";
import { ContributeCta } from "@/components/library/contribute-cta";

export const metadata: Metadata = {
  title: `Learning Library — ${brandConfig.productName}`,
  description:
    "Learn practical skills, prepare for interviews, and grow your career with curated courses, videos, and study materials.",
};

export default async function LibraryPage() {
  const repository = getLibraryRepository();
  const [pillars, categories, featuredCourses, featuredResources] = await Promise.all([
    repository.listContentPillars(),
    repository.listCategories(),
    repository.listFeaturedCourses(),
    repository.listFeaturedResources(),
  ]);

  const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]));
  const categoryLabel = (categoryId: string) => categoryLabelById.get(categoryId) ?? categoryId;

  return (
    <>
      <LibraryHero />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LibraryCategoryCards pillars={pillars} />
      </section>

      <LibrarySection
        title="Popular Courses"
        description="Structured, video-based courses across programming, testing, and career skills."
        viewAllHref="/library/courses"
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} categoryLabel={categoryLabel(course.categoryId)} />
          ))}
        </div>
      </LibrarySection>

      <LibrarySection title="Browse by Category">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/library/courses?category=${category.slug}`}
              className="focus-ring rounded-full border border-border-subtle px-4 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-brand-cyan/40 hover:text-text-primary"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </LibrarySection>

      <LibrarySection
        title="Recommended Resources"
        description="Notes, cheat sheets, and roadmaps to support your learning."
        viewAllHref="/library/materials"
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              categoryLabel={categoryLabel(resource.categoryId)}
            />
          ))}
        </div>
      </LibrarySection>

      <ContributeCta />
    </>
  );
}
