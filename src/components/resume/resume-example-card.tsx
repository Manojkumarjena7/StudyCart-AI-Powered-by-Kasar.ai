import Image from "next/image";
import { Download, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";
import type { ResumeExample } from "@/config/resume-examples";

interface ResumeExampleCardProps {
  example: ResumeExample;
  onView: (example: ResumeExample) => void;
  onRequestDownload: (example: ResumeExample, format: "pdf" | "docx") => void;
}

export function ResumeExampleCard({ example, onView, onRequestDownload }: ResumeExampleCardProps) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-card">
      <div className="p-4 pb-0">
        {/* Real page-1 render of the actual PDF (see scripts/generate-resume-previews.mjs)
            — not a hand-built skeleton. White background is intentional: it represents
            an actual paper page, not themed UI chrome, so it stays a real white/A4
            rectangle in every theme (Day/Night/KasarTech Green). */}
        <div className="aspect-[900/1273] w-full overflow-hidden rounded-lg border border-border-subtle bg-white shadow-card">
          <Image
            src={example.previewImagePath}
            alt={`${example.title} resume preview, page 1`}
            width={example.previewWidth}
            height={example.previewHeight}
            className="h-full w-full object-contain object-top transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
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

        <button
          type="button"
          onClick={() => onView(example)}
          className="focus-ring mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onRequestDownload(example, "pdf")}
            className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-brand-cyan/50 hover:text-text-primary"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
          <button
            type="button"
            onClick={() => onRequestDownload(example, "docx")}
            className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-brand-cyan/50 hover:text-text-primary"
          >
            <FileText className="h-3.5 w-3.5" />
            Word
          </button>
        </div>
      </div>
    </div>
  );
}
