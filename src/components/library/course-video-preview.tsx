import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import { LibraryIcon } from "@/components/library/library-icon";

/**
 * Polished placeholder for the course video area — no real video streaming exists
 * yet (Phase 1 MVP is local/config data only). The architecture (course/lesson data
 * model, per-lesson fields) already supports adding real video URLs later without a
 * UI rewrite — see docs/LEARNING-LIBRARY.md §Future direction.
 */
export function CourseVideoPreview({
  title,
  thumbnailIcon,
}: {
  title: string;
  thumbnailIcon: string;
}) {
  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2823] to-[#071a17] text-white shadow-card">
      <div className="absolute right-4 top-4">
        <Badge variant="neutral" className="border-white/20 bg-white/10 text-white">
          Preview coming soon
        </Badge>
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
        <LibraryIcon name={thumbnailIcon} className="h-7 w-7" />
      </div>
      <button
        type="button"
        disabled
        className="mt-5 flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/90 disabled:cursor-not-allowed"
        aria-label="Video playback coming soon"
      >
        <PlayCircle className="h-5 w-5" />
        {title}
      </button>
    </div>
  );
}
