/**
 * Learning Library domain types — Phase 1 MVP (local/config-driven data only).
 * See docs/LEARNING-LIBRARY.md. These shapes are designed so a future Supabase-backed
 * repository can implement `LibraryRepository` (see repository.ts) without any change
 * to UI components — only the repository implementation swaps.
 */

export type LibraryDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type LibraryResourceType =
  | "PDF"
  | "Cheat Sheet"
  | "Roadmap"
  | "Question Bank"
  | "Guide";

export interface LibraryCategory {
  id: string;
  slug: string;
  label: string;
  description: string;
  /** Resolved via src/components/library/library-icon.tsx — icon names are data, not
   * component references, matching src/config/platform.ts's convention. */
  icon: string;
}

export interface LibraryContentPillar {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
}

export interface LibraryCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: LibraryDifficulty;
  /** Icon-tile thumbnail (no real course artwork exists yet) — see library-icon.tsx. */
  thumbnailIcon: string;
  /** Generic team credit — no fabricated named instructor. */
  instructor: string;
  lessonCount: number;
  videoCount: number;
  resourceCount: number;
  durationLabel: string;
  tags: string[];
  featured: boolean;
}

export interface LibraryLesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  durationLabel: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  type: LibraryResourceType;
  thumbnailIcon: string;
  pageCount?: number;
  tags: string[];
  author: string;
  featured: boolean;
  /** null = no real file exists yet — UI must show "Preview coming soon", never a
   * fabricated download link. See docs/LEARNING-LIBRARY.md §Demo content. */
  filePath: string | null;
  /** "demo" = curated in src/config/library-data.ts. "community" = derived from an
   * approved LibraryContribution. Never mislabel one as the other. See
   * docs/LEARNING-LIBRARY.md §Contribution MVP. */
  source: "demo" | "community";
  /** Only set when source === "community" — the originating contribution's id. */
  contributionId?: string;
}

export interface LibrarySearchResult {
  courses: LibraryCourse[];
  resources: LibraryResource[];
}

/**
 * Local Contribution MVP (Phase 2) — see docs/LEARNING-LIBRARY.md §Contribution MVP.
 * This is a temporary, local-filesystem-backed model (no Supabase, no auth). It is
 * deliberately a separate type/repository from the read-only demo content above — see
 * src/lib/library/contribution-repository.ts for why.
 */
export type ContributionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LibraryContribution {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  topic?: string;
  contributorName?: string;
  fileName: string;
  /** Public URL path under public/uploads/library-contributions/ — see
   * src/lib/library/contribution-store.ts. Local-dev-only storage. */
  filePath: string;
  fileSize: number;
  /** Extracted from the real PDF via pdf-parse at submission time — never fabricated. */
  pageCount?: number;
  status: ContributionStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
