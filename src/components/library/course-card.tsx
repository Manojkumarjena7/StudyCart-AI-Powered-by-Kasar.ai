import Link from "next/link";
import { PlayCircle, Video, FileText, Clock } from "lucide-react";
import type { LibraryCourse } from "@/lib/library/types";
import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { LibraryIcon } from "@/components/library/library-icon";

export function CourseCard({
  course,
  categoryLabel,
}: {
  course: LibraryCourse;
  categoryLabel: string;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors hover:border-brand-cyan/40">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-overlay-soft to-overlay-strong">
        {course.featured && (
          <span className="absolute right-3 top-3">
            <Badge variant="trending">Popular</Badge>
          </span>
        )}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card text-brand-blue shadow-card">
          <LibraryIcon name={course.thumbnailIcon} className="h-8 w-8" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-text-primary">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{course.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="neutral">{categoryLabel}</Badge>
          <Badge variant="trending">{course.difficulty}</Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Video className="h-4 w-4" />
            {course.videoCount} videos
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            {course.resourceCount} resources
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {course.durationLabel}
          </span>
        </div>

        <Link
          href={`/library/course/${course.slug}`}
          className="focus-ring mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <PlayCircle className="h-4 w-4" />
          Start Learning
        </Link>
      </div>
    </Card>
  );
}
