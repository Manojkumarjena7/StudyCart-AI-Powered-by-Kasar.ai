"use server";

import { parseResumePdf, type ParseResumePdfResult } from "@/lib/resume/parser";

// Do not `export type { ParseResumePdfResult }` from this file: found in Phase 4
// browser verification that the "use server" build transform breaks at runtime
// ("ReferenceError: ParseResumePdfResult is not defined") when a "use server"
// module re-exports a type, even though it's erased at compile time everywhere
// else. Import the type directly from ./parser instead.

/**
 * Server Action for the Resume Builder upload step — the only way the client
 * component touches PDF parsing. Mirrors the existing pattern in
 * src/lib/library/contribution-actions.ts: a plain "use server" async function
 * called directly from a client component, with a File passed as a normal argument.
 *
 * Nothing is persisted here — the resulting ResumeData lives only in client-side
 * React state for this phase (see docs/RESUME-ENHANCEMENT.md §Resume Builder).
 */
// 4MB, matches resume-upload-dropzone.tsx's own limit. Kept below Vercel's
// ~4.5MB hard request-body ceiling for Node.js Serverless Functions (a
// platform-level limit that applies regardless of next.config.ts's own
// serverActions.bodySizeLimit), so an oversized upload is always rejected by
// our own graceful check before it can ever hit that platform limit.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

export async function extractResumeFromUpload(file: File): Promise<ParseResumePdfResult> {
  if (!file) {
    return { ok: false, reason: "invalid-pdf", error: "Please upload a PDF file." };
  }
  if (file.type && file.type !== "application/pdf") {
    return { ok: false, reason: "invalid-pdf", error: "Only PDF files are accepted." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, reason: "invalid-pdf", error: "File is too large — please keep it under 4MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    return await parseResumePdf(buffer);
  } catch (error) {
    console.error(
      "extractResumeFromUpload: unexpected failure",
      error instanceof Error ? { name: error.name, message: error.message } : error
    );
    // TEMP DIAGNOSTIC (2026-09-26): see matching note in parser.ts — surfacing
    // the real error text since no Vercel log access is available here.
    const debugDetail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return {
      ok: false,
      reason: "unexpected",
      error: `Something went wrong while reading your resume. Please try again. [DEBUG: ${debugDetail}]`,
    };
  }
}
