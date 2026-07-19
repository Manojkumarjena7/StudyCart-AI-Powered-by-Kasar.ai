import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { StudentResult } from "@/types/domain";

/**
 * Phase 1 persistence shim.
 *
 * Why not a plain in-memory Map? Next.js compiles Route Handlers and
 * React Server Components into separate module graphs, so a
 * module-level singleton does NOT reliably stay shared between a
 * Server Action / page render and other routes, even within the same
 * running process. Writing to a small JSON file on disk sidesteps that
 * without introducing any real infrastructure (no DB, no cache server) —
 * appropriate for a Phase 1 demo, and it is fully isolated behind the
 * `StudentResultsRepository` interface so swapping in real Supabase
 * later requires no changes outside this repository implementation.
 *
 * Known Phase 1 limitation: on ephemeral/serverless hosts (e.g. Vercel),
 * the local filesystem is not guaranteed to persist across invocations.
 * This is fine for local/self-hosted demo use; production persistence
 * should move to the Supabase-backed repository in the next phase.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "student-results.json");

function ensureStore(): Record<string, StudentResult> {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, "{}", "utf-8");
    return {};
  }
  try {
    const raw = readFileSync(DATA_FILE, "utf-8");
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function readStudentResult(id: string): StudentResult | null {
  const store = ensureStore();
  return store[id] ?? null;
}

export function writeStudentResult(result: StudentResult): void {
  const store = ensureStore();
  store[result.id] = result;
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}
