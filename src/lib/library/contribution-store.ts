import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { LibraryContribution } from "@/lib/library/types";

/**
 * Local, filesystem-backed storage for Library contributions — Phase 2 MVP only.
 * See docs/LEARNING-LIBRARY.md §Contribution MVP.
 *
 * TEMPORARY / DEVELOPMENT-ONLY: metadata lives in a local JSON file (mirroring the
 * pattern in src/lib/supabase/repositories/fileStore.ts for the Government Job
 * Platform, but kept fully separate from that module per the route/domain boundary
 * rules in docs/ARCHITECTURE.md) and uploaded PDF binaries are written straight into
 * `public/uploads/library-contributions/` so they're servable via the same plain
 * static-file mechanism already used for demo PDFs (public/resumes/*). This only
 * works because `public/` is writable in local dev — it will NOT work on a read-only
 * production filesystem (e.g. Vercel). `isUploadsWritableEnvironment()` below is the
 * single source of truth callers must check before attempting a write; the future
 * Supabase migration replaces this with Supabase Storage. See
 * docs/LEARNING-LIBRARY.md §Future Supabase migration plan.
 */

export interface ContributionStorePaths {
  dataFile: string;
  uploadsDir: string;
}

export function defaultContributionStorePaths(): ContributionStorePaths {
  const dataDir = process.env.VERCEL ? path.join(os.tmpdir(), ".data") : path.join(process.cwd(), ".data");
  return {
    dataFile: path.join(dataDir, "library-contributions.json"),
    uploadsDir: path.join(process.cwd(), "public", "uploads", "library-contributions"),
  };
}

/**
 * Whether this process can actually persist an uploaded PDF. `public/` is part of
 * Vercel's read-only deployment bundle at runtime — writing to it there throws
 * (EROFS), so contribution submission must not even attempt it. Same `VERCEL` signal
 * already used by src/lib/supabase/repositories/fileStore.ts and
 * defaultContributionStorePaths() above, kept as one named check so every caller
 * (the repository's write path, and the /library/contribute page's notice banner)
 * agrees on the same answer.
 */
export function isUploadsWritableEnvironment(): boolean {
  return !process.env.VERCEL;
}

export function readContributions(paths: ContributionStorePaths): LibraryContribution[] {
  if (!existsSync(paths.dataFile)) return [];
  try {
    const raw = readFileSync(paths.dataFile, "utf-8");
    return raw.trim() ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeContributions(paths: ContributionStorePaths, list: LibraryContribution[]): void {
  const dir = path.dirname(paths.dataFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(paths.dataFile, JSON.stringify(list, null, 2), "utf-8");
}

/** Writes the PDF binary to disk and returns its public URL path (e.g.
 * "/uploads/library-contributions/<id>.pdf"). */
export function saveContributionFile(paths: ContributionStorePaths, id: string, buffer: Buffer): string {
  if (!existsSync(paths.uploadsDir)) mkdirSync(paths.uploadsDir, { recursive: true });
  const fileName = `${id}.pdf`;
  writeFileSync(path.join(paths.uploadsDir, fileName), buffer);
  return `/uploads/library-contributions/${fileName}`;
}
