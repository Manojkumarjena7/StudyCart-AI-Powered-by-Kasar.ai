import type {
  LibraryCategory,
  LibraryContentPillar,
  LibraryCourse,
  LibraryLesson,
  LibraryResource,
  LibrarySearchResult,
} from "@/lib/library/types";
import { mockLibraryRepository } from "@/lib/library/mock-repository";

/**
 * Learning Library data-access contract. UI components must only depend on this
 * interface, never on src/config/library-data.ts directly — that keeps the swap from
 * `mockLibraryRepository` to a future Supabase-backed implementation a drop-in change
 * with zero UI rewrites. See docs/LEARNING-LIBRARY.md §Data architecture.
 *
 * All methods are async (even though the current implementation is synchronous
 * local data) so call sites already match the shape a real network-backed
 * repository will need.
 */
export interface LibraryRepository {
  listCategories(): Promise<LibraryCategory[]>;
  getCategoryBySlug(slug: string): Promise<LibraryCategory | null>;
  listContentPillars(): Promise<LibraryContentPillar[]>;

  listCourses(): Promise<LibraryCourse[]>;
  listFeaturedCourses(): Promise<LibraryCourse[]>;
  getCourseBySlug(slug: string): Promise<LibraryCourse | null>;
  getCourseLessons(courseId: string): Promise<LibraryLesson[]>;

  listResources(): Promise<LibraryResource[]>;
  listFeaturedResources(): Promise<LibraryResource[]>;
  getResourceById(id: string): Promise<LibraryResource | null>;

  /** Simple title/tag search across courses and resources — used by the Library
   * home search bar. Category filtering for dedicated list pages is done by the
   * caller via listCourses()/listResources() plus a client-side filter, not here. */
  search(query: string): Promise<LibrarySearchResult>;
}

// Note: Phase 2's Contribution MVP (submit/approve/reject) is intentionally NOT part
// of this interface. `mockLibraryRepository` is imported by "use client" components
// (e.g. library-search.tsx) and must stay free of Node-only APIs so it can be bundled
// for the browser; contribution storage needs real filesystem access and can only run
// server-side. See src/lib/library/contribution-repository.ts and
// docs/LEARNING-LIBRARY.md §Contribution MVP.

/**
 * Returns the active Library repository. Today this always returns the local
 * mock/config-backed implementation — do NOT branch on env vars or create a fake
 * Supabase implementation here. When a real backend is added later, this factory is
 * the single place that changes.
 */
export function getLibraryRepository(): LibraryRepository {
  return mockLibraryRepository;
}
