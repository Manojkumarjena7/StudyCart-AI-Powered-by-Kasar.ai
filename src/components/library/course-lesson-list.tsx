import { PlayCircle } from "lucide-react";
import type { LibraryLesson } from "@/lib/library/types";

export function CourseLessonList({ lessons }: { lessons: LibraryLesson[] }) {
  return (
    <ol className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-card">
      {lessons.map((lesson) => (
        <li key={lesson.id} className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-overlay-soft text-xs font-semibold text-text-secondary">
            {String(lesson.order).padStart(2, "0")}
          </span>
          <PlayCircle className="h-4 w-4 shrink-0 text-text-secondary" />
          <span className="flex-1 truncate text-sm text-text-primary">{lesson.title}</span>
          <span className="shrink-0 text-xs text-text-secondary">{lesson.durationLabel}</span>
        </li>
      ))}
    </ol>
  );
}
