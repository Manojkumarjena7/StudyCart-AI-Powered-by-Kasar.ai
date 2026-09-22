import { randomUUID } from "node:crypto";
import type { ContributionStatus, LibraryContribution, LibraryResource } from "@/lib/library/types";
import { validatePdfBuffer } from "@/lib/library/pdf-validation";
import {
  defaultContributionStorePaths,
  isUploadsWritableEnvironment,
  readContributions,
  saveContributionFile,
  writeContributions,
  type ContributionStorePaths,
} from "@/lib/library/contribution-store";

/**
 * Server-only repository for the Library Contribution MVP (Phase 2).
 * See docs/LEARNING-LIBRARY.md §Contribution MVP.
 *
 * This is deliberately a SEPARATE module from src/lib/library/repository.ts
 * (`LibraryRepository`), not additional methods bolted onto that interface, because
 * `LibraryRepository`/`mockLibraryRepository` are imported by "use client" components
 * (e.g. library-search.tsx) and must stay free of Node-only APIs (`node:fs`,
 * `node:crypto`) so they can be bundled for the browser. Contribution storage needs
 * real filesystem access, so it can only run on the server — this module must only
 * ever be imported from Server Components, Server Actions
 * (contribution-actions.ts), or tests. Never import this from a "use client" file.
 *
 * UI never touches storage directly: client components call the "use server" actions
 * in contribution-actions.ts, which call this repository.
 */

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB

export interface SubmitContributionInput {
  title: string;
  description: string;
  categoryId: string;
  topic?: string;
  contributorName?: string;
  file: File;
}

export type SubmitContributionResult =
  | { ok: true; contribution: LibraryContribution }
  | { ok: false; error: string };

function contributionToResource(contribution: LibraryContribution): LibraryResource {
  return {
    id: `contribution-${contribution.id}`,
    title: contribution.title,
    description: contribution.description,
    categoryId: contribution.categoryId,
    type: "PDF",
    thumbnailIcon: "FileText",
    pageCount: contribution.pageCount,
    tags: contribution.topic ? [contribution.topic] : [],
    author: contribution.contributorName?.trim() || "Community Contributor",
    featured: false,
    filePath: contribution.filePath,
    source: "community",
    contributionId: contribution.id,
  };
}

export function createContributionRepository(paths: ContributionStorePaths = defaultContributionStorePaths()) {
  return {
    async listContributions(status?: ContributionStatus): Promise<LibraryContribution[]> {
      const all = readContributions(paths);
      return status ? all.filter((c) => c.status === status) : all;
    },

    async getContributionById(id: string): Promise<LibraryContribution | null> {
      return readContributions(paths).find((c) => c.id === id) ?? null;
    },

    async submitContribution(input: SubmitContributionInput): Promise<SubmitContributionResult> {
      const title = input.title.trim();
      const description = input.description.trim();
      const categoryId = input.categoryId.trim();

      if (!title) return { ok: false, error: "Resource title is required." };
      if (!description) return { ok: false, error: "Description is required." };
      if (!categoryId) return { ok: false, error: "Please select a category." };
      if (!input.file) return { ok: false, error: "Please upload a PDF file." };

      // Metadata/extension check first (cheap) — never the only check.
      if (input.file.type && input.file.type !== "application/pdf") {
        return { ok: false, error: "Only PDF files are accepted." };
      }
      if (input.file.size > MAX_FILE_BYTES) {
        return { ok: false, error: "File is too large — please keep it under 20MB." };
      }

      // Fail fast, before touching the filesystem at all: on a read-only deployment
      // (Vercel — see isUploadsWritableEnvironment()), public/ cannot be written to,
      // and attempting it throws (EROFS). This is the fix for the "This page
      // couldn't load / A server error occurred" crash — see
      // docs/LEARNING-LIBRARY.md §Contribution MVP for the incident writeup.
      if (!isUploadsWritableEnvironment()) {
        return {
          ok: false,
          error:
            "Contribution uploads are only available in local development for this MVP phase. This will be enabled once real storage is connected.",
        };
      }

      const buffer = Buffer.from(await input.file.arrayBuffer());

      // Real content validation — catches a renamed non-PDF file even if its
      // extension/MIME type claims otherwise.
      const validation = await validatePdfBuffer(buffer);
      if (!validation.valid) {
        return { ok: false, error: validation.reason ?? "This file is not a valid PDF." };
      }

      // Defense in depth: isUploadsWritableEnvironment() should already prevent
      // reaching this code on a read-only deployment, but any other unexpected fs
      // failure (permissions, disk full, etc.) must never throw out of a Server
      // Action uncaught — that's what produces Next.js's generic crash page instead
      // of a normal in-form error.
      try {
        const id = randomUUID();
        const filePath = saveContributionFile(paths, id, buffer);

        const contribution: LibraryContribution = {
          id,
          title,
          description,
          categoryId,
          topic: input.topic?.trim() || undefined,
          contributorName: input.contributorName?.trim() || undefined,
          fileName: input.file.name,
          filePath,
          fileSize: input.file.size,
          pageCount: validation.pageCount,
          status: "PENDING",
          submittedAt: new Date().toISOString(),
        };

        const all = readContributions(paths);
        all.push(contribution);
        writeContributions(paths, all);

        return { ok: true, contribution };
      } catch (error) {
        console.error("submitContribution: failed to persist contribution", error);
        return {
          ok: false,
          error: "Something went wrong while saving your submission. Please try again.",
        };
      }
    },

    async approveContribution(id: string): Promise<LibraryContribution | null> {
      try {
        const all = readContributions(paths);
        const index = all.findIndex((c) => c.id === id);
        if (index === -1) return null;
        all[index] = {
          ...all[index],
          status: "APPROVED",
          reviewedAt: new Date().toISOString(),
          rejectionReason: undefined,
        };
        writeContributions(paths, all);
        return all[index];
      } catch (error) {
        console.error("approveContribution: failed to persist status change", error);
        return null;
      }
    },

    async rejectContribution(id: string, reason?: string): Promise<LibraryContribution | null> {
      try {
        const all = readContributions(paths);
        const index = all.findIndex((c) => c.id === id);
        if (index === -1) return null;
        all[index] = {
          ...all[index],
          status: "REJECTED",
          reviewedAt: new Date().toISOString(),
          rejectionReason: reason?.trim() || undefined,
        };
        writeContributions(paths, all);
        return all[index];
      } catch (error) {
        console.error("rejectContribution: failed to persist status change", error);
        return null;
      }
    },

    /** Approved contributions, mapped into the same shape as demo LibraryResource
     * entries (source: "community") so /library/materials can merge them in without
     * any change to the resource-rendering UI. */
    async listApprovedAsResources(): Promise<LibraryResource[]> {
      return readContributions(paths)
        .filter((c) => c.status === "APPROVED")
        .map(contributionToResource);
    },
  };
}

const contributionRepository = createContributionRepository();

export function getContributionRepository() {
  return contributionRepository;
}
