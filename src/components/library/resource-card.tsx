import { FileText, Download, User } from "lucide-react";
import type { LibraryResource } from "@/lib/library/types";
import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { LibraryIcon } from "@/components/library/library-icon";

export function ResourceCard({
  resource,
  categoryLabel,
}: {
  resource: LibraryResource;
  categoryLabel: string;
}) {
  const isAvailable = Boolean(resource.filePath);

  return (
    <Card className="flex h-full flex-col p-6 transition-colors hover:border-brand-cyan/40">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
          <LibraryIcon name={resource.thumbnailIcon} className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-text-primary">{resource.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary">{resource.description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant="neutral">{categoryLabel}</Badge>
        <Badge variant="neutral">{resource.type}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-secondary">
        {resource.pageCount !== undefined && (
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            {resource.pageCount} pages
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {resource.author}
        </span>
      </div>

      {isAvailable ? (
        <a
          href={resource.filePath ?? undefined}
          download
          className="focus-ring mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      ) : (
        <span
          title="Preview coming soon"
          className="mt-6 flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-border-subtle px-4 py-3 text-sm font-medium text-text-secondary opacity-70"
        >
          Preview coming soon
        </span>
      )}
    </Card>
  );
}
