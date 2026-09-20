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
    <Card className="flex h-full flex-col p-5 transition-colors hover:border-brand-cyan/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-overlay-soft text-brand-blue">
        <LibraryIcon name={course.thumbnailIcon} className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-text-primary">{course.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary">{course.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="neutral">{categoryLabel}</Badge>
        <Badge variant="trending">{course.difficulty}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <Video className="h-3.5 w-3.5" />
          {course.videoCount} videos
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {course.resourceCount} resources
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {course.durationLabel}
        </span>
      </div>

      <Link
        href={`/library/course/${course.slug}`}
        className="focus-ring mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <PlayCircle className="h-4 w-4" />
        Start Learning
      </Link>
    </Card>
  );
}
