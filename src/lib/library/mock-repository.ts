import type { LibraryRepository } from "@/lib/library/repository";
import type { LibrarySearchResult } from "@/lib/library/types";
import {
  libraryCategories,
  libraryContentPillars,
  libraryCourses,
  libraryLessons,
  libraryResources,
} from "@/config/library-data";

/**
 * Local/config-backed implementation of LibraryRepository — the only Library data
 * source for this MVP phase. See docs/LEARNING-LIBRARY.md §Data architecture.
 *
 * Deliberately NOT a fake Supabase client and does not touch
 * process.env.NEXT_PUBLIC_SUPABASE_* — those stay reserved for a real future
 * migration per the Phase 1 decision to not connect Supabase yet.
 */
export const mockLibraryRepository: LibraryRepository = {
  async listCategories() {
    return libraryCategories;
  },

  async getCategoryBySlug(slug) {
    return libraryCategories.find((category) => category.slug === slug) ?? null;
  },

  async listContentPillars() {
    return libraryContentPillars;
  },

  async listCourses() {
    return libraryCourses;
  },

  async listFeaturedCourses() {
    return libraryCourses.filter((course) => course.featured);
  },

  async getCourseBySlug(slug) {
    return libraryCourses.find((course) => course.slug === slug) ?? null;
  },

  async getCourseLessons(courseId) {
    return libraryLessons
      .filter((lesson) => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  },

  async listResources() {
    return libraryResources;
  },

  async listFeaturedResources() {
    return libraryResources.filter((resource) => resource.featured);
  },

  async getResourceById(id) {
    return libraryResources.find((resource) => resource.id === id) ?? null;
  },

  async search(query): Promise<LibrarySearchResult> {
    const q = query.trim().toLowerCase();
    if (!q) return { courses: [], resources: [] };

    const matches = (haystack: string[]) =>
      haystack.some((value) => value.toLowerCase().includes(q));

    return {
      courses: libraryCourses.filter((course) =>
        matches([course.title, course.description, ...course.tags])
      ),
      resources: libraryResources.filter((resource) =>
        matches([resource.title, resource.description, ...resource.tags])
      ),
    };
  },
};
