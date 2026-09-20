import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";
import { getLibraryRepository } from "@/lib/library/repository";
import { CoursesBrowser } from "@/components/library/courses-browser";

export const metadata: Metadata = {
  title: `Courses & Videos — ${brandConfig.productName}`,
  description: "Browse structured courses and video lessons across programming, testing, and career skills.",
};

interface CoursesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function LibraryCoursesPage({ searchParams }: CoursesPageProps) {
  const { category } = await searchParams;
  const repository = getLibraryRepository();
  const [courses, categories] = await Promise.all([
    repository.listCourses(),
    repository.listCategories(),
  ]);

  const initialCategory = category ? categories.find((c) => c.slug === category) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-light">
        Learning Library
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
        Courses &amp; Videos
      </h1>
      <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
        Structured learning with lessons and video content, organized by topic.
      </p>

      <div className="mt-10">
        <CoursesBrowser
          courses={courses}
          categories={categories}
          initialCategoryId={initialCategory?.id ?? null}
        />
      </div>
    </div>
  );
}
