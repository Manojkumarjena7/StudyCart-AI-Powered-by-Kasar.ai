import { Heart, ExternalLink } from "lucide-react";
import { getSupportPaytmUrl } from "@/lib/utils/support";

export function SupportStudyCartSection() {
  const paytmUrl = getSupportPaytmUrl();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-bg-card px-6 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10">
            <Heart className="h-4.5 w-4.5 text-error" />
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">Support StudyCart ❤️</p>
            <p className="mt-1 max-w-md text-xs text-text-secondary">
              We&apos;re building practical career tools for students and job seekers. If
              StudyCart helps you, you can support the project.
            </p>
          </div>
        </div>

        {paytmUrl ? (
          <a
            href={paytmUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Support via Paytm
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span
            title="Coming soon"
            className="flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-lg border border-border-subtle px-4 py-2.5 text-sm font-medium text-text-secondary opacity-60"
          >
            Support via Paytm — Coming soon
          </span>
        )}
      </div>
    </section>
  );
}
