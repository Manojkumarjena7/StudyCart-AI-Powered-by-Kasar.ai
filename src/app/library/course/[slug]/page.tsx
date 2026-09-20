import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle, Clock, Layers } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { getLibraryRepository } from "@/lib/library/repository";
import { Badge } from "@/components/shared/ui/badge";
import { CourseVideoPreview } from "@/components/library/course-video-preview";
import { CourseLessonList } from "@/components/library/course-lesson-list";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getLibraryRepository().getCourseBySlug(slug);
  if (!course) return { title: `Course — ${brandConfig.productName}` };
  return {
    title: `${course.title} — ${brandConfig.productName}`,
    description: course.description,
  };
}

export default async function LibraryCourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const repository = getLibraryRepository();
  const course = await repository.getCourseBySlug(slug);
  if (!course) notFound();

  const [categories, lessons] = await Promise.all([
    repository.listCategories(),
    repository.getCourseLessons(course.id),
  ]);
  const category = categories.find((cat) => cat.id === course.categoryId) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <p className="text-xs text-text-secondary">
        <Link href="/library" className="hover:text-brand-blue hover:underline">
          Library
        </Link>{" "}
        <span className="mx-1">›</span> {course.title}
      </p>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <CourseVideoPreview title={course.title} thumbnailIcon={course.thumbnailIcon} />

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            {course.title}
          </h1>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">{course.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {category && <Badge variant="neutral">{category.label}</Badge>}
            <Badge variant="trending">{course.difficulty}</Badge>
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Clock className="h-3.5 w-3.5" />
              {course.durationLabel}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Layers className="h-3.5 w-3.5" />
              {course.lessonCount} lessons
            </span>
          </div>

          <a
            href="#lessons"
            className="focus-ring mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <PlayCircle className="h-4 w-4" />
            Start Learning
          </a>

          <div className="mt-8 rounded-2xl border border-border-subtle bg-bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-text-primary">Resources</h2>
            <p className="mt-1.5 text-sm text-text-secondary">
              This course includes {course.resourceCount} downloadable{" "}
              {course.resourceCount === 1 ? "resource" : "resources"}.{" "}
              <Link
                href={category ? `/library/materials?category=${category.slug}` : "/library/materials"}
                className="font-medium text-brand-blue hover:underline"
              >
                Browse related study materials →
              </Link>
            </p>
          </div>
        </div>

        <div id="lessons">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">Course Content</h2>
          <CourseLessonList lessons={lessons} />
        </div>
      </div>
    </div>
  );
}
