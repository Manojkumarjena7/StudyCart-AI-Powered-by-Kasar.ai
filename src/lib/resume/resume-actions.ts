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
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB, matches resume-upload-dropzone.tsx's own limit

export async function extractResumeFromUpload(file: File): Promise<ParseResumePdfResult> {
  if (!file) {
    return { ok: false, reason: "invalid-pdf", error: "Please upload a PDF file." };
  }
  if (file.type && file.type !== "application/pdf") {
    return { ok: false, reason: "invalid-pdf", error: "Only PDF files are accepted." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, reason: "invalid-pdf", error: "File is too large — please keep it under 5MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    return await parseResumePdf(buffer);
  } catch (error) {
    console.error("extractResumeFromUpload: unexpected failure", error);
    return {
      ok: false,
      reason: "unexpected",
      error: "Something went wrong while reading your resume. Please try again.",
    };
  }
}
