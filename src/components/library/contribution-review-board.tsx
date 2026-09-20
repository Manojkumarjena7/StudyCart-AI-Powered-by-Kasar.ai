"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Check, X as XIcon, FileText } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ContributionStatusBadge } from "@/components/library/contribution-status-badge";
import { PdfPreviewModal } from "@/components/library/pdf-preview-modal";
import { approveContributionAction, rejectContributionAction } from "@/lib/library/contribution-actions";
import type { ContributionStatus, LibraryCategory, LibraryContribution } from "@/lib/library/types";

type Tab = ContributionStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

/** Explicit locale/timeZone so the server render and the client hydration always
 * produce an identical string — the default (locale-less) `toLocaleString()` differs
 * between the server's Node locale and the browser's locale and causes a hydration
 * mismatch, which can leave click handlers in this subtree unreliable. */
function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}

interface ContributionReviewBoardProps {
  contributions: LibraryContribution[];
  categories: LibraryCategory[];
}

export function ContributionReviewBoard({ contributions, categories }: ContributionReviewBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("PENDING");
  const [preview, setPreview] = useState<{ title: string; pdfPath: string } | null>(null);
  const [reasonDraft, setReasonDraft] = useState<Record<string, string>>({});

  const categoryLabelById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.label])),
    [categories]
  );

  const grouped = useMemo(() => {
    const counts: Record<Tab, number> = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    for (const c of contributions) counts[c.status]++;
    return counts;
  }, [contributions]);

  const visible = contributions.filter((c) => c.status === tab);

  function handleApprove(id: string) {
    startTransition(async () => {
      await approveContributionAction(id);
      router.refresh();
    });
  }

  function handleReject(id: string) {
    const reason = reasonDraft[id]?.trim() || undefined;
    startTransition(async () => {
      await rejectContributionAction(id, reason);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Contribution status">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={`focus-ring rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
              tab === t.value
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-border-subtle text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label} ({grouped[t.value]})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {visible.length === 0 ? (
          <EmptyState
            title={`No ${tab.toLowerCase()} contributions`}
            description="Submissions will show up here once they come in."
          />
        ) : (
          visible.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-border-subtle bg-bg-card p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-text-primary">{c.title}</h3>
                    <ContributionStatusBadge status={c.status} />
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{c.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
                    <span>Contributor: {c.contributorName || "Anonymous"}</span>
                    <span>Category: {categoryLabelById.get(c.categoryId) ?? c.categoryId}</span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {c.fileName}
                      {c.pageCount ? ` · ${c.pageCount} pages` : ""}
                    </span>
                    <span>Submitted: {formatSubmittedAt(c.submittedAt)}</span>
                  </div>
                  {c.status === "REJECTED" && c.rejectionReason && (
                    <p className="mt-2 text-xs text-error">Rejection reason: {c.rejectionReason}</p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreview({ title: c.title, pdfPath: c.filePath })}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>

                  {c.status === "PENDING" && (
                    <>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleApprove(c.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleReject(c.id)}
                      >
                        <XIcon className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </>
                  )}

                  {c.status === "APPROVED" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleReject(c.id)}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {c.status === "PENDING" && (
                <div className="mt-3">
                  <Input
                    value={reasonDraft[c.id] ?? ""}
                    onChange={(e) => setReasonDraft((prev) => ({ ...prev, [c.id]: e.target.value }))}
                    placeholder="Optional rejection reason..."
                    className="max-w-md text-xs"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <PdfPreviewModal
        title={preview?.title ?? null}
        pdfPath={preview?.pdfPath ?? null}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
