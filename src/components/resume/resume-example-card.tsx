import { Download, Eye } from "lucide-react";
import { ResumeThumbnail } from "@/components/resume/resume-thumbnail";
import { Badge } from "@/components/shared/ui/badge";
import type { ResumeExample } from "@/config/resume-examples";

interface ResumeExampleCardProps {
  example: ResumeExample;
  onView: (example: ResumeExample) => void;
}

export function ResumeExampleCard({ example, onView }: ResumeExampleCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-card">
      <div className="p-4 pb-0">
        <ResumeThumbnail example={example} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-text-primary">{example.title}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Badge variant="neutral" className="px-2 py-0.5 text-[10px]">
            {example.experienceLevel}
          </Badge>
          <Badge variant="neutral" className="px-2 py-0.5 text-[10px]">
            {example.category}
          </Badge>
        </div>
        <p className="mt-2 flex-1 text-xs text-text-secondary">{example.description}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onView(example)}
            className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-600"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <a
            href={example.pdfPath}
            download
            className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-brand-cyan/50 hover:text-text-primary"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
