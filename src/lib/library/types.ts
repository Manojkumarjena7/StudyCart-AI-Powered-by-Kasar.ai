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
}

export interface LibrarySearchResult {
  courses: LibraryCourse[];
  resources: LibraryResource[];
}
