# Resume — Product Module

**Role:** Primary flow #1 ("RESUME") of StudyCart AI Interview Support. See
[PRODUCT.md](./PRODUCT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md) for how this fits
the overall domain model.

> **Revision note (Resume MVP):** This module shipped its first real, practical MVP —
> resume examples with a working PDF viewer, and the foundation for a resume analyzer.
> This supersedes the earlier "Coming Soon" stub. The full paid "Resume Enhancement"
> flow (upload → payment → admin-fulfilled enhanced PDF) described below is still
> **FUTURE** — not built. Do not confuse the two.

## CURRENT / LIVE (`/resume`)

The goal of this MVP is narrow and deliberate: *"Help candidates understand what a good
IT resume looks like and identify what they can improve in their own resume."* Not a
resume builder, not paid enhancement — see [ROADMAP.md](./ROADMAP.md) for the phase
plan.

### Resume Templates — LIVE

Three curated, public-safe resume templates — each recreated from a real candidate's
resume with **all personally identifying information replaced by generic
placeholders** (name, email, phone, city, employer, institution, and any real
client/brand names mentioned in project text — see `Public-Safe-Resume-Templates.zip`'s
own `README.md` for the exact per-template source mapping). Independently
re-verified (not just taken on that README's word) against the rendered PDF text and
the DOCX/PDF embedded metadata before integration — no real names, emails, phone
numbers, addresses, personal URLs, or institution/employer names found in any of the
3. Shown in a balanced, non-scrolling responsive grid (1 column mobile, 2 tablet, 3
desktop — see `resume-examples-grid.tsx`).

- Config-driven: `src/config/resume-examples.ts` — the single source of truth, one
  entry per template with a `pdfPath`, `docxPath`, and `previewImagePath` (+ its
  known `previewWidth`/`previewHeight`). Adding a fourth template is a config entry +
  `public/resumes/template-04/{resume.pdf,resume.docx}` + running
  `npm run generate:resume-previews`, no other UI changes required.
- Assets live at `public/resumes/template-0N/{resume.pdf,resume.docx,preview.png}`.
  The earlier fictional demo PDFs (`software-engineer.pdf`,
  `qa-automation-engineer.pdf`, `data-analyst.pdf`, generated via
  `scripts/generate-resume-examples.mjs`) were retired — that script is left in place
  but is currently unused.
- **Card previews are real page-1 renders of the actual PDF** — generated via
  `scripts/generate-resume-previews.mjs` (`pdfjs-dist` + `@napi-rs/canvas`, both
  already project dependencies), never a hand-built HTML/CSS recreation (that was
  the previous approach, `resume-thumbnail.tsx`, now removed — a skeleton couldn't
  show a visitor the actual difference between templates). The PDF itself is still
  never loaded client-side just to show a thumbnail — the preview is a plain static
  image. See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) §Assets.
- **View** opens an accessible modal (`resume-pdf-viewer-modal.tsx`) that embeds the PDF
  in an `<iframe>`, relying on the **browser's native PDF viewer** for zoom, page
  navigation, and printing — no PDF-rendering library was added for this (per
  AI-AGENT-GUIDE.md, existing capability was checked and preferred over adding one).
  Modal: focus-trapped, closes on Escape or backdrop click, restores focus to the
  trigger on close, respects `prefers-reduced-motion`. **Viewing never shows the
  support prompt.**
- **Download** (PDF or Word, from either the card or the viewer modal) shows the
  optional `support-download-modal.tsx` prompt first — see §Support KasarTech.ai
  below. No login required either way; these are public reference documents.

### Resume Analyzer foundation — retired, repurposed into the Resume Builder entry (Phase 5a)

**Superseded.** The `/resume#analyzer` ("Check Your Resume") section described in
earlier revisions of this doc — a fake upload UI ending in "resume analysis isn't
live yet" — has been **removed**. A real, working ATS Readiness checklist and
resume editor exist now (Phases 1–4), so that placeholder was actively misleading
once they shipped. `resume-analyzer-section.tsx` no longer exists;
`resume-builder-entry-section.tsx` occupies the same `#analyzer` anchor and page
position with real "Analyze My Resume" / "Improve My Resume" entry points into
`/resume/build` — see §Resume Builder — Phase 5a below.

The Government Job Platform's unrelated `src/features/analyzer|parser|scoring|ranking`
pipeline (exam response-sheet parsing) was never involved in the Resume domain and
is untouched by any of this.

### How to Improve Your Resume — LIVE

A static, editorial 5-step horizontal guide (Structure → Keywords → Impact → Projects →
Polish) — plain content, no backend.

### Support StudyCart (page section) — LIVE (button disabled until configured)

A separate, pre-existing donation prompt on `/resume`
(`support-studycart-section.tsx`), config-driven via `NEXT_PUBLIC_SUPPORT_PAYTM_URL`
(`src/lib/utils/support.ts`). Unset today, so its button renders disabled/"Coming
soon." Unrelated to the modal system below — not touched by it.

### Support popups (shared component) — LIVE

`src/components/shared/support-modal.tsx` is a single reusable modal with two
content variants, selected via a `context` prop:

- **`"kasartech"`** — shown before a resume template's PDF or Word download
  (triggered from either the card or the PDF viewer modal's Download buttons —
  **never** from View/Preview). Both action buttons — "Continue Free Download →"
  and "Maybe Later" — **both trigger the download** and close the modal; only the
  ✕ close button (or Escape/backdrop) closes **without** downloading. The file is
  never gated, no payment is ever verified, no login is ever required.
- **`"studycart"`** — a purely informational variant opened from the global,
  persistent `support-fab.tsx` button ("❤️ Support StudyCart", fixed bottom-right on
  every page). Single "Close" button, no download semantics at all.

**Paytm QR code:** both variants render `public/support/paytm-qr.png` — the real,
supplied Paytm/UPI QR. **No QR code is generated, recreated, or altered by this
codebase**: the file is a lossless crop of the original (only the personal-name
header and a promotional banner were cropped away; the logo/QR pattern/UPI-ID/badges
are pixel-identical to the source). Overridable via `NEXT_PUBLIC_SUPPORT_QR_IMAGE`
if the asset ever needs to change; if that ever resolves to nothing, both variants
gracefully fall back (to the `getSupportPaytmUrl()` text link, or to no payment
affordance at all) rather than showing a placeholder.

**Branding is intentionally not unified**: "KasarTech.ai" is used for the
resume/career-tooling context, "StudyCart" for the general/learning context and the
global button — see `docs/DESIGN-SYSTEM.md` §Brand identity for why these two names
coexist deliberately rather than one replacing the other everywhere.

### Resume Builder — Phase 1 (`/resume/build`)

The first working foundation of a separate, from-scratch Resume Builder — not the
paid Resume Enhancement flow described under §FUTURE below, and not a replacement for
the existing `/resume` gallery, which it does not touch. As of Phase 5a it **is**
linked from `/resume` (see below) — the page itself still carries
`robots: { index: false, follow: false }` since it's a workflow/app screen, not a
marketing landing page.

Flow: **Upload a PDF → extract text → best-effort structuring → editable review
screen.** Nothing is persisted (no Supabase, no auth) — the resulting `ResumeData`
lives only in the client component's React state (`resume-builder-client.tsx`) for
this phase.

- `src/lib/resume/types.ts` — the independent `ResumeData` model (`personalInfo`,
  `summary`, `experience[]`, `education[]`, `skills[]`, `projects[]`,
  `certifications[]`, `achievements[]`), plus `ExtractionResult` (`data`,
  `uncertainFields`, `rawText`).
  **Template independence:** `ResumeData` carries no layout/template information —
  the same object must be renderable by any future template without re-entry, and
  nothing here should grow a `templateId` or styling field.
- `src/lib/resume/extraction.ts` — deterministic, dependency-free text structuring
  (no AI/LLM, no OCR). Conservative pattern/keyword heuristics only: a field is
  populated only when a rule confidently matches; otherwise it's left empty and its
  dot-path key is added to `uncertainFields` rather than guessed. Pure string→data,
  independently unit-testable (`extraction.test.ts`).
- `src/lib/resume/parser.ts` — the PDF-specific wrapper, using the existing
  `pdf-parse` dependency (same worker-setup pattern as
  `src/lib/library/pdf-validation.ts`, deliberately duplicated rather than shared —
  see §Route boundary rules in [ARCHITECTURE.md](./ARCHITECTURE.md)). Detects
  scanned/image-only PDFs (no usable text layer) and invalid PDF files, reporting
  both as a plain-language message rather than an empty resume or a raw parser
  error.
- `src/lib/resume/resume-actions.ts` — the one Server Action the client uses
  (`extractResumeFromUpload`), enforcing the PDF-type/5MB checks before parsing.
- `src/app/resume/build/page.tsx` + `src/components/resume/builder/*` — the
  upload → processing → review UI. The review screen visibly flags fields it
  couldn't confidently extract ("Please check" badges) and allows editing,
  add/delete for every array section (Experience, Education, Skills, Projects,
  Certifications) and free-text editing for Summary/Achievements. No drag-and-drop,
  no rich/Canva-style editor.

**Not built in Phase 1** (intentionally out of scope): template rendering or
switching, ATS analysis/score, job-description matching, PDF/DOCX export, AI/LLM
extraction, OCR. Template rendering (Template 01 only) is now built in Phase 2,
below; ATS/export remain later phases — see [ROADMAP.md](./ROADMAP.md).

**Known extraction limitations:** single-column, text-layer PDFs only; heuristics
are conservative by design and will under-extract (never fabricate) on unusual
resume layouts, multi-column formats, or non-standard section headings — the review
screen exists specifically so the user corrects these rather than the system
guessing.

### Resume Builder — Phase 2 (template preview, `/resume/build`)

Extends the same route with: **Review/Edit → Choose a template → edit alongside a
live preview.** Still no persistence, no auth, no export — this phase proves that
`ResumeData` can drive a real, editable rendered template, nothing more.

```
ResumeData → TemplateRenderer → Template01Renderer
```

- `src/components/resume/templates/registry.tsx` — the template registry/factory.
  `RESUME_TEMPLATES` is the metadata list (id, name, description, status, preview
  image) the picker renders from; `getTemplateRenderer(id)` resolves an id to a
  component only when that template is both real and `"available"`, returning
  `null` otherwise (unknown id and a real-but-`"coming-soon"` id both fail safely,
  never throw). `TemplateRenderer` is the one place that actually mounts a
  template's output, via `createElement` (not JSX with a dynamically-named
  variable) — chosen specifically to satisfy the project's
  `react-hooks/static-components` lint rule while keeping the dispatch table-driven
  rather than a hardcoded switch, so adding `template-02`/`template-03` later is a
  new renderer file + one array entry, no changes to the picker, editor, or preview
  panel.
- `src/components/resume/templates/template-01/` — `template-01-renderer.tsx`
  (a plain, hook-free function component: `ResumeData` in, JSX out — kept
  hook-free specifically so it can be unit-tested with `react-dom/server` instead
  of needing a DOM/jsdom test setup) and `template-01.module.css` (hand-authored,
  scoped, deliberately **not** built from the app's Tailwind theme tokens — a
  resume page must render as black-on-white regardless of the app's own
  light/dark theme). Recreated by inspecting the existing
  `public/resumes/template-01/{resume.pdf,preview.png}` as a **visual reference
  only**; that PDF/DOCX is never read or modified at runtime and the static
  `/resume` gallery is untouched.
  - No ResumeData field is template-specific (see §Template independence above).
    Two things the source PDF shows but `ResumeData` has no field for are
    intentionally not recreated: a "Languages" section (no such field), and a
    dedicated title/headline next to the name — Phase 2 derives a display-only
    headline from the current (or most recent) experience entry's role instead of
    adding a field, and simply omits it when there's no experience.
  - Every section (Skills, Experience, Education, Projects, Certifications,
    Achievements) is hidden entirely when it has no content, and the two-column
    layout collapses to one column if only one side has content — see
    `template-01-renderer.test.tsx` for the empty/partial-data cases this covers.
- `src/components/resume/templates/resume-page-preview.tsx` — a client-only
  wrapper that measures its container with `ResizeObserver` and scales the A4-sized
  page down to fit (shrink-to-fit, not a print/export pipeline) so the live preview
  stays readable at any panel width.
- `src/components/resume/builder/resume-editor-sections.tsx` — the field-editing
  controls (Personal Info, Summary, Experience, Education, Skills, Projects,
  Certifications, Achievements — edit/add/delete, no drag-and-drop) extracted out
  of the Phase 1 review screen so both `resume-review-editor.tsx` (the full-width
  Phase 1 review step) and `resume-editor-panel.tsx` (the narrow left column of the
  Phase 2 split view) edit `ResumeData` through the exact same controls instead of
  two parallel forms.
- `src/components/resume/builder/template-picker-step.tsx` — the template
  selection screen. Only Template 01 is clickable; Template 02/03 render as
  non-interactive "Coming soon" cards (reusing their existing gallery preview
  images, grayscaled) rather than fake clickable functionality.
- `src/components/resume/builder/resume-build-step.tsx` — the split-screen layout:
  the editor panel on the left, the live `TemplateRenderer` preview on the right,
  **both bound to the same `resumeData` state** in `resume-builder-client.tsx` — an
  edit re-renders the preview on the same render pass, no separate preview copy, no
  screenshot, no static PDF/iframe. Side-by-side on desktop (`lg:` breakpoint);
  stacked (editor, then preview) on mobile — a cramped side-by-side view on a phone
  is not attempted.

**A4 / print groundwork (not export):** `template-01.module.css` sizes the page to
210mm width with a 297mm (one-page) min-height and includes a `@media print` /
`@page { size: A4 }` baseline. There is no PDF export or page-break engine yet —
content taller than one page is left to overflow the page visually in the preview
rather than being clipped or paginated; see §Known limitations.

**Known limitations (Phase 2):**
- Long resumes overflow the single A4-height page in the live preview instead of
  flowing onto a rendered "page 2" — real multi-page pagination is deferred to the
  export phase.
- No "Languages" section (no corresponding `ResumeData` field); no dedicated
  role/title field (a headline is derived from experience instead, see above).
- Template 02 and Template 03 are metadata-only entries in the registry (picker
  cards, marked "Coming soon") — no renderers exist for them yet.

**Not built in Phase 2** (intentionally out of scope): ATS analysis/score,
job-description matching, PDF/DOCX export, AI/LLM extraction, OCR, Supabase,
auth, payments. ATS readiness (checklist, not a score) is now built in Phase 3,
below — export and the rest remain later phases. See [ROADMAP.md](./ROADMAP.md).

### Resume Builder — Phase 3 (ATS readiness checklist)

Adds a live **ATS Readiness** checklist to the split-screen builder — a third
consumer of the same `ResumeData` state, alongside the editor and the Template 01
preview:

```
                    ResumeData
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
     Editor          Preview         ATS Panel
```

- `src/lib/resume/ats-checklist.ts` — `getAtsChecklist(data: ResumeData)`, a pure,
  synchronous function (no AI/LLM, no job-description matching, no semantic
  keyword matching) built from ten plain, disclosed rules, each returning one of
  exactly three statuses (`"pass" | "warning" | "fail"`) with a short title and an
  actionable message:
  1. **Contact information** — pass needs a full name AND at least an email or
     phone; a partial match warns instead of failing outright.
  2. **Professional summary** — fails if empty, warns if under ~40 characters/6
     words (fixed, disclosed thresholds — not learned), otherwise passes.
  3. **Work experience** — pass needs at least one entry with real content (a
     freshly-added but still-blank entry does not count, so a live edit is
     reflected the moment it's filled in, not before).
  4. **Education** — pass needs at least one entry with an institution or degree.
  5. **Skills** — pass needs at least one non-empty skill item, in any group.
  6. **Projects** — absence is **never** a failure, only a neutral suggestion, per
     the phase brief (many strong resumes have none).
  7. **Action verbs** — checks only whether each experience bullet's first word is
     in a small, exported, literal `ACTION_VERBS` list (developed, built,
     implemented, automated, designed, tested, optimized, improved, created, led,
     managed, analyzed, reduced, increased, delivered); warns when more than half
     of a resume's bullets don't start with one of them. Explicitly not NLP/AI —
     a plain first-word lookup.
  8. **Quantifiable achievements** — a single disclosed regex over experience AND
     project bullets for percentages, currency (₹, $, €, £), and number+unit
     phrases (e.g. `20%`, `₹5L`, `30 test cases`, `3 months`). Absence is only ever
     a suggestion ("Consider adding measurable results where they are genuine."),
     never a failure.
  9. **Standard sections** — a summary check over the five checks above (Contact,
     Summary, Experience, Education, Skills): pass if all five pass, warning if at
     least three do, fail otherwise. Deliberately reuses those five checks' own
     results rather than re-deriving the logic, so it can never disagree with them.
  10. **Overall detail** — counts plain content units across every section (bullets,
      entries, skill items, achievements, certifications); below a small fixed
      threshold (`SPARSE_CONTENT_THRESHOLD = 2`) it suggests "Add more relevant
      detail to make the resume more useful." — never a fabricated score.
- **No numeric score anywhere** — no "ATS Score: 87", no "ATS Compatibility: 95%".
  Only the three statuses above, surfaced as ✓ Passed / ⚠ Needs attention /
  ✕ Missing. See the phase brief's §NO ATS SCORE for why.
- `src/components/resume/builder/resume-ats-panel.tsx` — renders
  `getAtsChecklist(resumeData)` directly (recomputed on every render, not cached
  against a stale copy) as a plain checklist, styled to read as suggestions rather
  than errors (soft success/warning/error tints, no red banner, no "failed" tone in
  the copy). Mounted in `resume-build-step.tsx`'s right column, below the Template
  01 preview — the same `resumeData` prop the editor and preview already share, so
  editing any field updates the checklist on the same render pass as the preview,
  with no refresh and no separate copy of the data.

**Not built in Phase 3** (intentionally out of scope): PDF export, DOCX export,
AI/LLM analysis, job-description matching, semantic keyword matching, a numeric
ATS score. PDF export (Template 01 only) is now built in Phase 4, below — DOCX,
more templates, and everything else here remain later phases. See
[ROADMAP.md](./ROADMAP.md).

### Resume Builder — Phase 4 (PDF export)

Adds **Download PDF** to the split-screen builder — the first phase that
completes a usable start-to-finish journey (upload → extract → review → choose
Template 01 → edit with a live preview and ATS checklist → download).

**Export strategy: browser print-to-PDF, not a second rendering engine.**
"Download PDF" calls the browser's native print dialog (`window.print()`) against
the exact same `<TemplateRenderer templateId="template-01" data={resumeData} />`
already used for the live preview — just a second, unscaled mount of it, not a
jsPDF/PDF.js layout re-implementation. This is what guarantees *what the user sees
in the preview is what appears in the exported PDF*: they're the same React
component fed the same `ResumeData`, not two independently-maintained layouts that
could drift apart.

- `src/components/resume/templates/printable-resume.tsx` — `PrintableResume`, a
  thin wrapper carrying the `resume-print-target` marker class (exported as
  `RESUME_PRINT_TARGET_CLASS`). Classed `hidden print:block`, so this second
  instance takes no space on screen and appears only inside `@media print`.
- `src/app/globals.css` — the print isolation rule, appended after the existing
  utility classes: `body * { visibility: hidden }`, then `.resume-print-target`
  (and its descendants) set back to `visibility: visible` and repositioned with
  `position: absolute; top: 0; left: 0` to the page origin, regardless of where it
  was nested (the sticky/scaled preview column, the split-screen grid, the site's
  `Navbar`/`Footer`/`SupportFab`). `position: absolute`, not `fixed`, is
  deliberate — `fixed` elements don't reliably paginate across multiple printed
  pages in every browser, and a resume longer than one page must be allowed to
  flow onto page 2+ (see §Multi-page behavior below), never truncated.
- `src/lib/resume/print-resume.ts` — `printResume(fullName)` temporarily renames
  `document.title` to `KasarTech-Resume-<Name>` (sanitized; falls back to `-Draft`
  when the name is blank) before calling `window.print()`, then restores the
  original title on the browser's `afterprint` event. This is a **best-effort**
  filename hint, not a guarantee — browsers vary in whether "Save as PDF" honors
  `document.title` as the suggested filename, and this code never claims
  otherwise. `buildPrintDocumentTitle` (the sanitizing part) is pure and unit
  tested; the `window.print()` call itself needs a real browser and is covered by
  manual verification instead.
- `src/components/resume/builder/resume-build-step.tsx` — adds the **Download
  PDF** button to the existing top toolbar, and mounts `PrintableResume` (wrapping
  a second `TemplateRenderer`) as a sibling of the editor/preview/ATS grid — not
  nested inside the sticky preview column — specifically so nothing on the
  ancestor chain introduces a CSS positioning context (`position: sticky`, etc.)
  that could hijack `.resume-print-target`'s `position: absolute` and place it
  somewhere other than the page origin.

**Support flow (reuses the existing `SupportModal` — nothing new built):**
Clicking **Download PDF** opens the existing `<SupportModal context="kasartech" />`
exactly as the static `/resume` gallery's downloads already do. Both its
"Continue Free Download →" and "Maybe Later" buttons call `onContinueDownload`
(here, `printResume(...)`) before closing — support is optional and never blocks
the export, matching that modal's existing contract. Only the ✕/backdrop/Escape
close the modal **without** printing. `SupportModal` itself was not modified.

**Print CSS hides:** the editor panel, the ATS Readiness panel, the template
picker (when on that step), the live preview's own on-screen (scaled) copy, and
the site's `Navbar`/`Footer`/`SupportFab` — all of it via the one global
"hide everything except `.resume-print-target`" rule, not per-component print
classes, so nothing new elsewhere in the app needs to remember to hide itself.

**A4 / multi-page behavior:** Template 01's own page sizing from Phase 2
(`210mm` width, `297mm` min-height, `@page { size: A4; margin: 0 }`) is reused
as-is. Because `.page` has no `max-height` and no `overflow: hidden`, content
longer than one page is **never clipped, hidden, or overlapped** — the browser's
native print pagination continues it onto additional A4 pages. No custom
pagination engine was built for this phase (explicitly out of scope); see
§Known limitations for what that means in practice.

**Not built in Phase 4** (intentionally out of scope): DOCX export, Template
02/03, AI/LLM, job-description matching, advanced/scored ATS, OCR, Supabase,
auth, payments. See [ROADMAP.md](./ROADMAP.md).

**Two real bugs found via real-browser verification, fixed in this phase (not
visible from `vitest`/curl-only checks used in Phases 1–3):**
1. `src/lib/resume/resume-actions.ts` re-exported a type
   (`export type { ParseResumePdfResult }`) from a `"use server"` file. That
   compiles fine and passes `next build`, but crashes every upload at runtime in
   the production server (`ReferenceError: ParseResumePdfResult is not defined`)
   — the "use server" transform doesn't handle a type-only re-export cleanly. This
   silently broke the **entire builder upload flow** in production since Phase 1;
   no earlier phase's validation actually submitted a file through the real
   Server Action against a `next build && next start` server, only `curl`
   (page-load only) and `vitest` (which imports the parser directly, bypassing
   the Server Action wrapper entirely). Fixed by removing the unused re-export —
   nothing outside this file imported the type through it anyway.
2. The print isolation rule's `visibility: hidden` left every hidden element's
   layout box in place, so the printed document stayed as tall as the full app
   UI and "Download PDF" produced the resume's one real page followed by several
   blank trailing pages. Fixed by also collapsing `html, body { height: 0;
   overflow: hidden }` under `@media print` — safe because `.resume-print-target`
   is `position: absolute` with no positioned ancestor, so its containing block
   is the print page area, not `body`.

Both were confirmed fixed by driving the actual built app with Playwright
(Chromium) end-to-end and inspecting a real generated PDF — see §Browser
verification below.

**Known limitations (Phase 4):**
- No custom page-break control — a section (e.g. a long experience entry) can
  split across a page boundary wherever the browser's default pagination happens
  to land, rather than always breaking cleanly between sections. `break-inside:
  avoid` is already set per-section in `template-01.module.css` from Phase 2,
  which keeps most individual entries intact, but this is a best-effort, not a
  guarantee for very long entries.
- No guaranteed filename — `document.title` is a hint some browsers use for
  "Save as PDF"; others ignore it. There is no direct-download API used here that
  could force a filename without adding a second, real PDF-rendering engine
  (explicitly avoided per the phase brief).
- `window.print()`'s dialog itself (and whether the user chooses "Save as PDF" vs.
  a physical printer) is entirely browser/OS UI outside this app's control.
- Template 02/03 have no export path — only Template 01 renders and prints in
  this phase, matching the registry's existing "coming soon" state for them.

### Resume Builder — Phase 5a (discoverability + connected Analyze/Improve entry)

A UX audit of the live product found that `/resume/build` — a fully working
upload → extract → review → template → live preview → ATS → download journey —
had **zero links pointing to it anywhere in the app** (homepage, `/resume`,
navbar, footer). Visitors could only reach it by typing the URL. `/resume`
itself, and one homepage section, still said the old "Resume Analyzer" was
"Coming soon." Phase 5a fixes discoverability and connects that stale Analyzer
messaging to the real builder — it does **not** change any extraction, ATS,
template-rendering, or PDF-export logic from Phases 1–4.

**Product model — one builder, two entry modes**, not two implementations:

```
ResumeBuilderClient (resume-builder-client.tsx)
        │
   resolvePostUploadStep(mode)
        │
  ┌─────┼──────────────┐
  │     │              │
"analyze"  "enhance"   null (direct/bookmarked visit)
  │     │              │
  v     v              v
analysis  build      review -> template -> build
  │        (Template 01 auto-selected;         (unchanged Phase 1–4 flow)
  │         no separate review/template screens)
  v
"Improve Your Resume" -> build
(same ResumeData, no re-upload)
```

- `src/components/resume/builder/resume-builder-client.tsx` — added a `BuilderStep`
  value (`"analysis"`), an `initialMode` prop (`"analyze" | "enhance" | null`), and
  one pure, exported, unit-tested function, `resolvePostUploadStep(mode)`, that
  decides what happens right after a successful upload. There is still exactly
  one `resumeData` / `uncertainFields` state pair in this component — analyze mode
  reads and writes the same state the build step already uses; nothing is
  duplicated or re-fetched.
- `src/components/resume/builder/resume-analysis-step.tsx` — **new**. The
  "Analyze My Resume" mode's first stop after upload. Renders the **exact same**
  `ResumeAtsPanel` component the Build step already uses (no second ATS
  implementation) with one "Improve Your Resume" button. That button only calls
  `setTemplateId`/`setStep` — it never touches `resumeData`, so there is no
  re-upload and no re-parsing.
- `src/app/resume/build/page.tsx` — now an async Server Component reading
  `searchParams` (`?mode=analyze` / `?mode=enhance`), following the same
  `Promise<{...}>` + `await searchParams` pattern already used by
  `src/app/library/courses/page.tsx` and `.../materials/page.tsx`. A missing or
  unrecognized `mode` resolves to `null` via the exported, unit-tested
  `resolveEntryMode()` — the existing no-mode flow is completely unchanged.
- `src/components/resume/resume-builder-entry-section.tsx` — **new**, replaces
  the deleted `resume-analyzer-section.tsx` (see §Resume Analyzer foundation
  above) at the same `id="analyzer"` anchor and page position on `/resume`. Two
  buttons, "Analyze My Resume" (`/resume/build?mode=analyze`) and "Improve My
  Resume" (`/resume/build?mode=enhance`) — no "Coming soon" badge, no fake
  upload widget; the "what's included" list and the 4-step explainer describe
  what the builder actually does today.
- `src/components/home/resume-showcase.tsx` and the Resume slide in
  `src/components/home/hero.tsx` — copy-only changes: removed the `"Coming
  soon"` badge, retitled to "Build an ATS-friendly resume" / "Build My Resume",
  per the approved brief. Both still link to `/resume` (now the real landing
  point), not directly to `/resume/build` — kept as the smallest focused change,
  no homepage redesign.

**Why "enhance" skips the review and template screens:** the audit specifically
flagged those as unnecessary extra clicks — Template 01 is the only shipped
template today (see `templates/registry.tsx`), so asking the user to "choose"
from a list of one before letting them edit adds friction with no real choice
behind it. "Analyze" keeps the existing Review → Template → Build chain after
its one new stop, since its own flow only specified reusing "the existing Resume
Builder editor" without shortening that chain.

**Verified in a real browser** (Playwright + Chromium, same setup as Phase 4)
against the production build: `/resume` → **Analyze My Resume** → upload → ATS
Readiness screen (real extracted data, real checklist) → **Improve Your
Resume** → lands in the editor with the *same* name/fields already filled in,
no re-upload prompt. Separately, `/resume` → **Improve My Resume** → upload →
lands directly in the editor + live preview + ATS panel, with neither the
standalone Review screen nor the Template picker shown in between. Editing the
Summary field in that run flipped the ATS "Professional summary" check from
failing to passing live, confirming ATS stayed connected to the same state.

**Not built in Phase 5a** (intentionally out of scope, per the approved brief):
new ATS rules, new template renderers, DOCX, AI/LLM, job-description matching,
changes to extraction/`ResumeData`/Template 01 rendering/PDF export/`SupportModal`,
and the guided "Start From Scratch" wizard (Basic Info → Experience → Education
→ Skills) — "Start From Scratch" still enters the flat review form unchanged.
Builder-internal polish (persistent step trail, mobile stacking order, the
Review/Build editor duplication) is **Phase 5b**, below.

### Resume Builder — Phase 5b (professional product UX transformation)

Phase 5a fixed discoverability; Phase 5b addressed the audit's other finding —
that the builder itself "feels more technical/odd than the simple, guided
experience" wanted, and that `/resume` still read as a generic marketing page
rather than a resume product's home screen. No extraction, ATS-rule, template-
rendering, or PDF-export logic changed — this phase is UX/composition only.

**`/resume` is now a product home, not a marketing landing page:**
- `resume-hero.tsx` and `resume-hero-mockup.tsx` (the old two-column hero with a
  trust-badge row and illustration) are **deleted** — replaced by a compact
  masthead in the rewritten `resume-builder-entry-section.tsx`: one eyebrow, one
  headline, one line of supporting copy, and two dominant actions —
  **"Upload your resume"** (`/resume/build?mode=enhance`) and **"Start from
  scratch"** (`/resume/build?mode=create`, new — see below). The Phase 5a
  Analyze entry point is preserved as a smaller secondary link ("Just want an
  ATS check first?"), not a third equally-weighted button — the brief was
  explicit that Analyze/Enhance are entry points into one system, not two
  competing products.
- `resume-recent-list.tsx` (**new**) — a "Your recent resumes" section. **No
  persistence layer exists** (`ResumeData` has been client-side-only since
  Phase 1), so this intentionally renders an honest empty state rather than the
  sample rows with fake ATS percentages shown in the visual reference —
  inventing that data would contradict this project's own standing "never
  fabricate" rule. See §Known limitations.
- `resume-template-strip.tsx` (**new**) — a compact "Popular templates" row
  reading directly from `RESUME_TEMPLATES` (the same registry the builder's
  template picker uses — no second list, no invented templates). Template 01 is
  clickable; Template 02/03 render as non-interactive "Coming soon" cards.
- `ResumeExamplesSection`, `ResumeGuideSection`, and `SupportStudyCartSection`
  (the pre-existing static gallery, writing guide, and support prompt) are
  **unmodified** and still fully functional — just reordered to sit below the
  new product-home content instead of framing the page.

**`/resume/build` now feels like an application, not a website page:**
- `site-chrome.tsx` (**new**) — a client wrapper around the global
  Navbar/Footer/SupportFab that hides all three specifically on
  `/resume/build` (checked by pathname), used from `src/app/layout.tsx` in
  place of rendering them directly. Every other route's chrome is completely
  unaffected. A second root layout via route groups would achieve the same
  isolation more "properly", but would mean restructuring nearly every existing
  route into a group for one screen's benefit — rejected as disproportionate
  risk for this phase.
- `resume-workspace-header.tsx` (**new**) — the lightweight replacement shown
  instead: brand mark + "Exit to Resume home", nothing else. Mounted once in
  `src/app/resume/build/page.tsx` above `ResumeBuilderClient`, so it's present
  across every internal step (upload, analysis, review, template, build).
- The stale **"Resume Builder — Step 1 of 2"** label (inaccurate since Phase 2
  added more steps) is removed from `resume-upload-step.tsx`; that screen was
  also retitled "Create your resume" with copy matching the approved brief, and
  its buttons relabeled "Upload Resume" / "Start from scratch". The dropzone
  copy says **PDF only** (not "PDF/DOCX" as in the brief's example) — DOCX
  extraction was never built, and claiming it would be exactly the kind of
  fabricated capability this project avoids.

**A third entry mode, `"create"`, added to `resume-builder-client.tsx`:**
skips the upload screen entirely and mounts straight into the Build step with a
blank `ResumeData` (Template 01 pre-selected, same as `"enhance"`) — "Start
from scratch" is now a genuine one-click action from `/resume`, not a buried
text link the user must first reach the upload screen to find. The existing
text link on the upload screen (for someone who lands there directly, e.g. via
`"enhance"`/`"analyze"`/no mode) still works exactly as before, unchanged.

**Mobile: replaced vertical stacking with an Edit / Preview / ATS tab
switcher** in `resume-build-step.tsx` — the exact usability problem the Phase
5a audit flagged (a phone user previously had to scroll past a full desktop-
sized editor before ever seeing the preview). All three panels stay in the DOM
at all times (no duplicated markup, no duplicated state); only visibility
toggles with the active tab below the `lg:` breakpoint, via a `hidden`/`lg:block`
class pattern. On desktop this is a no-op — the pre-existing single sticky
column containing Preview + ATS is unchanged from Phase 2–4, avoiding the
double-sticky-sibling bugs a naive split into two independently sticky
elements would have introduced.

**ATS suggestions are now clickable** (`resume-ats-panel.tsx`'s new optional
`onSelectCheck` prop, `resume-build-step.tsx`'s `CHECK_TO_SECTION_ID` map, and
new `id` anchors per field group in `resume-editor-panel.tsx`): clicking a
non-passing check switches to the Edit tab (on mobile) and scrolls the
relevant editor section into view. Checks with no single corresponding field
("Standard sections", "Overall detail" — both whole-resume overviews) are
simply not clickable. **Deliberately still no numeric ATS score** — the
visual reference for this phase showed one, but Phase 3's "NO ATS SCORE" policy
had no exception approved for it, and inventing a score-from-checklist formula
now would be a second, undocumented scoring model. This is a conscious,
documented deviation from the reference image, not an oversight.

**Verified in a real browser** (Playwright + Chromium against the production
build, same setup as Phases 4/5a): `/resume` renders as the intended product
home (no "How It Works", no upgrade/premium box, no "Coming soon" for Resume,
real recent/templates sections) on both desktop (1440px) and mobile (375px)
viewports; the Analyze flow (upload → ATS results → "Improve Your Resume" →
same data in the editor, no re-upload) and Enhance flow (upload → straight into
editor + live preview + ATS, no Review/Template screens shown) both work end
to end; editing the Summary field updated the live preview and flipped the ATS
"Professional summary" check from warning to pass in the same run; clicking
the "Projects" ATS suggestion revealed `#section-projects` in the editor; the
mobile Edit/Preview/ATS tabs each rendered their correct panel; and the
Download → Support modal → print → exported PDF was re-verified clean — one
page, the live-edited content, no editor/ATS/nav/workspace-header, matching
Phase 4's original guarantee.

**Not built in Phase 5b** (intentionally out of scope): a numeric ATS score,
the guided "Basic Info → Experience → Education → Skills" Start-From-Scratch
wizard (still the flat editor, just reached in one click now), real backend
persistence for "recent resumes", DOCX, AI/LLM, job-description matching
("Job Tailor"), Template 02/03, and a full persistent app sidebar (the visual
reference's left nav) — see §Known limitations.

**Known limitations (Phase 5b):**
- "Your recent resumes" is permanently empty until a real persistence layer
  exists — this phase intentionally did not invent one.
- No formal step indicator/breadcrumb was added across Upload → Review →
  Template → Build; each screen's own heading is the only orientation cue. The
  brief explicitly permitted skipping a stepper where it wouldn't help
  usability, and the now-shorter Analyze/Enhance/Create paths (1–2 screens
  each) reduce how much a stepper would have added anyway.
- `/resume/build` losing the global Navbar/Footer is achieved via a pathname
  check (`site-chrome.tsx`), not a true separate root layout — functionally
  equivalent for this one route, but a future route needing the same treatment
  should extend `WORKSPACE_ROUTE_PREFIXES` there rather than duplicating the
  pattern elsewhere.
- ~~The Review screen and the Build step's own editor panel still both exist
  as separate full-field forms for the no-mode/legacy path.~~ **Resolved in
  Phase 5c** — see below.

### Resume Builder — Phase 5c (editor consolidation + visual polish)

Phase 5b's own "known limitations" flagged that the no-mode/legacy path still
went through a separate standalone Review screen and a separate "choose a
template" step before reaching the Build step's editor — three different
full-page experiences for one resume, none of them re-showing what the other
had done. Phase 5c removes that duplication and does a visual-refinement pass;
no extraction/ATS-rule/Template-01-rendering/PDF-export logic changed.

**One canonical workspace, not three screens:**
- `resume-workspace.tsx` (**renamed** from `resume-build-step.tsx`,
  `ResumeBuildStep` → `ResumeWorkspace`) is now the single destination every
  entry path reaches once `ResumeData` exists — `resolvePostUploadStep()` in
  `resume-builder-client.tsx` collapsed from returning `{step, templateId?}`
  across four possible step names to a plain `"analysis" | "workspace"`:
  only "analyze" still has an intermediate stop (the ATS results screen);
  "enhance", "create", and **no mode** (the previously-unconsolidated path) all
  go straight to `ResumeWorkspace`.
- **Deleted** (verified unused elsewhere first): `resume-review-editor.tsx`
  (the standalone Phase 1 review form) and `template-picker-step.tsx` (the
  standalone Phase 2 template-choice screen) — both fully replaced, not left
  as dead code.
- `resume-editor-panel.tsx` — now documented as *the* editor, not "the Build
  step's copy of the fields also in the Review screen." Its `ResumeData` and
  props are unchanged; only its role in the architecture is clarified.
- `template-switcher.tsx` (**new**) — a small in-place dropdown in the
  workspace header replacing the old "Change template" link that used to
  navigate away to the deleted picker screen. Reads the exact same
  `RESUME_TEMPLATES` registry (no rewrite, no second list); Template 01 is
  selectable, 02/03 show as disabled "Soon" entries. Template selection now
  happens *inside* the one workspace, never as a separate step.
- **Uncertain fields are now visible on first paint of the workspace itself** —
  a one-line notice ("Please review the fields marked **Please check** below")
  appears whenever `uncertainFields.length > 0`, directly in
  `resume-workspace.tsx`, next to the same per-field "Please check" badges
  `ResumeEditorPanel` already showed. This is what replaces the old Review
  screen's confirmation step: the same information, surfaced in the one editor
  instead of a screen you had to click through first.

**Visual polish** (typography/spacing/dividers over boxes, per the brief's
"a professional UI designer does NOT put every feature into a separate
colorful card"):
- `resume-editor-sections.tsx`'s `SectionShell` no longer renders each of the
  8 field groups (Personal Info, Summary, Experience, …) as its own
  bordered-and-shadowed card. `resume-editor-panel.tsx` now wraps all of them
  in **one** card; individual sections are separated by a plain bottom
  divider instead.
- `resume-ats-panel.tsx`'s 10 checklist rows no longer each carry their own
  colored border + tinted background box. They're now a plain divided list
  with a color-coded icon per row (still pass/warning/fail — no new statuses,
  no numeric score) and a subtle hover state only on the clickable ones.
- The live preview card, the ATS panel's own outer card, and the workspace's
  mobile tab switcher **kept** their existing card/shadow treatment
  deliberately — they represent a real page, a distinct checklist, and an
  active-state control respectively, not just a form grouping, so removing
  their visual weight would have hurt clarity rather than helped it.

**Verified in a real browser** (Playwright + Chromium against the production
build, desktop 1440px and mobile 375px, same setup as Phases 4/5a/5b): `/resume`
still shows no "How It Works"/upgrade box/stale "Coming soon"; Enhance mode's
upload lands directly on the one workspace with no Review or template-picker
screen shown and the uncertain-field notice visible; editing the summary
updated the live preview and flipped the ATS check to pass in the same run;
clicking the "Projects" ATS suggestion revealed `#section-projects`; the
template switcher opened in place (no navigation) with Template 02 correctly
disabled; Download → Support modal → print produced the same clean single-page
PDF Phase 4 established; the Analyze flow (upload → ATS results → "Improve
Your Resume") landed on the same workspace with the same name already in an
editor input — the upload screen never reappeared, confirming no second
editor/re-upload; "Start from scratch" skipped the upload screen entirely and
opened the same (blank) workspace, including correctly on the mobile viewport
with its Edit/Preview/ATS tabs.

**Not built in Phase 5c** (intentionally out of scope, per the brief): AI
writing assistance, job-description matching, authentication, real
persistence, a numeric ATS score, payments, a premium tier. This phase changed
UX composition and visual styling only.

**Known limitations (Phase 5c):**
- The visual polish pass was targeted (editor sections, ATS rows) rather than
  a full design-system audit of every remaining surface in the builder — the
  upload screen, analysis screen, and product-home sections were not
  re-examined for card/shadow usage beyond what earlier phases already did.
- ~~The template switcher is a lightweight custom dropdown...~~ **Superseded
  in Phase 5d** — the dropdown was replaced by the Design tab (see below).
- Everything else noted under Phase 5b's "Known limitations" (no
  persistence, no formal step breadcrumb, pathname-based chrome hiding) still
  applies unchanged.

### Resume Builder — Phase 5d (document-editor redesign + reflow fix)

A live-verification pass on the Phase 5c workspace surfaced two real problems
the earlier phases hadn't: the editor read as "a long HTML form" (every
section's every field always visible at once) rather than a document editor,
and the layout could blink/reflow under certain conditions. Phase 5d addresses
both. No extraction/ATS-rule/Template-01-rendering/PDF-export logic changed.

**Root cause of the blinking/reflow bug, found and fixed:** the workspace page
used `min-h-screen`, which let the page grow taller than the viewport. The
live preview's "fit to width" scale (`resume-page-preview.tsx`) is computed
from its container's measured width via `ResizeObserver`. When total page
height crossed the viewport boundary, the browser's own scrollbar toggled
on/off, which changed that container's width (scrollbars steal ~15px), which
changed the computed scale, which changed the preview's height, which could
flip the scrollbar again — a genuine layout-thrash loop, not a false alarm.

- `src/app/resume/build/page.tsx` — changed `min-h-screen` to `h-screen` +
  `overflow-hidden`. The workspace itself now fills that fixed height exactly
  (`h-full flex flex-col`); the browser-level scrollbar can never appear on
  this route again, so the feedback loop's trigger is gone at the source.
  Upload/Analysis (short, simple screens) get their own single
  `overflow-y-auto` wrapper instead — see `resume-builder-client.tsx`.
- Verified directly: document height sampled five times over ~750ms stayed
  bit-for-bit identical, and stayed identical across five different viewport
  sizes (1440×900 → 1600×1000 → 1200×800 → 1920×1080 → 1440×900, each checked
  twice 200ms apart) — real automated evidence the oscillation is gone, not
  just "looks fine."

**One canonical editor, redesigned as a document-editor accordion, not a
form:**
- `resume-editor-sections.tsx` — `SectionShell` now takes `isExpanded`/
  `onToggle`/`summary` instead of always rendering every field. Collapsed, a
  section shows one compact line (e.g. "QA Engineer, Acme Corp (Jan 2023 –
  Present)" for Experience, "Manual Testing, Selenium, SQL…" for Skills); its
  full fields only render while expanded.
- `resume-editor-panel.tsx` — owns section identity (`EditorSectionKey`) and
  now takes `activeSection`/`onActiveSectionChange` as *controlled* props
  (not local state) specifically so something outside the editor — an ATS or
  Improve suggestion — can expand a section and the editor still has exactly
  one source of truth for which section is open. Personal Info is expanded by
  default on first load.
- One section open at a time: expanding a new one collapses whichever was
  open — verified directly (expanding Experience collapsed the
  previously-open Personal Info).

**Workspace reorganized around 4 tabs + an always-visible preview, not a
permanent 2-column form:**
- `resume-workspace.tsx` — rewritten. Desktop: **Edit / Design / ATS /
  Improve** tabs switch what's in the left pane; the right pane (live
  preview) is always visible next to whichever one is active — there's no
  "Preview" tab on desktop because there's nothing to switch to it from.
  Mobile: no room for two panes, so **Preview** becomes a 5th tab and exactly
  one pane shows at a time (same underlying components, no duplicated
  markup/state — this reuses the exact CSS `hidden`/`lg:block` toggling
  pattern already established in Phase 5c, just with one more tab value).
- `resume-design-panel.tsx` (**new**) — the Design tab. A plain vertical list
  reading the same `RESUME_TEMPLATES` registry as always (no rewrite, no
  second list, no marketplace grid) — replaces the Phase 5c header dropdown
  (`template-switcher.tsx`, **deleted**, confirmed unused elsewhere first).
- `resume-improve-panel.tsx` (**new**) — the Improve tab. Calls the exact same
  `getAtsChecklist()` the ATS tab uses — **not a second engine** — filtered to
  only the checks that aren't already passing, framed as a suggestions list.
  Shows an honest "nothing to suggest" state when every check passes, and
  never claims AI/rewriting capability that doesn't exist (per the brief's
  explicit "do not pretend AI is running").
- Clicking a suggestion in either ATS or Improve now: switches to the Edit
  tab, sets `activeSection` to the matching section (expanding it), and
  scrolls it into view — verified end to end (clicked the "Projects"
  suggestion from the ATS tab; the Projects section was confirmed expanded via
  screenshot, not just asserted).

**Zoom is now a real, independent control on the preview canvas only:**
- `resume-page-preview.tsx` — added `−` / percentage / `+` / `Fit` controls.
  "Fit" is the existing auto-width-fit behavior from Phase 2 unchanged;
  manual zoom overrides it in 10-point steps (50–150%), applied via the same
  `transform: scale()` the canvas already used — it never touches surrounding
  layout, and it's unrelated to (and unaffected by) the browser's own
  page-zoom feature. Verified: zooming in from a 87% auto-fit baseline moved
  to exactly 97%; "Fit" returned to exactly 87%.

**Verified in a real browser** (Playwright + Chromium against the production
build, desktop 1440×900 and mobile 375×812): every item above, plus — no
console errors or page exceptions across the entire run; no horizontal
overflow on mobile; Download → Support modal → print produced the same clean
single-page PDF Phase 4 established (re-inspected directly, byte-for-byte the
same kind of clean output — live-edited content only, no tabs/nav/zoom
controls/editor leaked in); Analyze → Improve still lands on the one workspace
with the same data already present (no re-upload, no second editor).

**Not built in Phase 5d** (intentionally out of scope, per the brief): AI
writing assistance, JD matching, authentication, persistence, a numeric ATS
score, payments, a premium tier — none of these were added anywhere,
including inside the new Improve tab.

**Known limitations (Phase 5d):**
- Zoom steps are fixed at 10 percentage points between 50–150%; there's no
  keyboard shortcut or scroll-to-zoom gesture, only the three buttons.
- The mobile tab bar now has 5 items in one row; on very narrow phones it may
  need horizontal scroll within the bar itself (not separately re-verified
  below the tested 375px width).
- Design/ATS/Improve tab content doesn't yet remember scroll position when
  switching away and back — each switch renders at the top of that pane.
- Everything else noted under Phase 5b/5c's "Known limitations" that this
  phase didn't touch (no persistence, no formal step breadcrumb,
  pathname-based chrome hiding) still applies unchanged.

## COMING SOON

- A numeric ATS score (no approved model), the guided Start-From-Scratch
  wizard, real "recent resumes" persistence, Templates 02/03, DOCX, and Job
  Tailor (job-description matching) — the Resume Builder itself is otherwise
  LIVE end-to-end, from `/resume` through download, through one canonical
  editor.
- A real Paytm support link/QR (env var currently unset).
- More resume examples (Automation, Manual Testing, Python, Java, DevOps, etc. — see
  [ADMIN-PORTAL.md](./ADMIN-PORTAL.md) intent for eventual content management).

## FUTURE (not built, architecture should stay compatible)

### Paid Resume Enhancement flow

```
REQUEST → PAYMENT → ADMIN PROCESSING → DELIVERABLE
```

1. User uploads a resume PDF.
2. System extracts/analyzes content and compares it against a curated **reference
   library** maintained by admin (see §Reference library below) — rule/example-based,
   not a claim of a proprietary AI model doing automatic comparison.
3. System surfaces issues/suggestions to the user.
4. User is offered the enhancement service and pays (see §Pricing).
5. A `resume_requests` record is created (see [ARCHITECTURE.md](./ARCHITECTURE.md)
   §Data model overview).
6. **Admin manually prepares the enhanced PDF** — not automated end-to-end fulfillment.
7. Admin uploads the final PDF against the request.
8. The user's account gets access to the deliverable; they view/download it there.

### Full future roadmap (auto-generation)

```
User Resume → Upload → Analyze → Identify issues → Choose a reference/template →
Extract user's resume information → Map into selected template → Customize →
Generate new resume → PDF / DOCX
```

### Reference library (admin-managed content, distinct from the current 3 demo examples)

Admin maintains a set of approved reference/example resumes (fresher, experienced,
developer, tester/QA, data role, etc. — potential categories: QA Automation, Manual
Testing, Software Engineering, Python, Java, Data, DevOps). These become the basis for
real analysis recommendations. Must evolve without code changes — an admin
data-management concern (see [ADMIN-PORTAL.md](./ADMIN-PORTAL.md)), not the
`resume-examples.ts` config used by the current MVP (which is a simpler, code-level
config appropriate for ~3–10 curated public examples, not a full content-management
system).

### Data model (proposed, not implemented)

`resume_requests`:
- id, user_id, uploaded_pdf_ref, status (`submitted` | `paid` | `in_progress` |
  `delivered` | `cancelled`), price_at_request, created_at, updated_at,
  deliverable_pdf_ref (nullable until admin uploads it)

`resume_references`:
- id, title, role_category, file_ref, status (`active` | `archived`), created_at,
  updated_at

These would live in the primary product's own Supabase (see
[ARCHITECTURE.md](./ARCHITECTURE.md) §Data ownership) — not the Government Job
Platform's, and not implemented yet (no auth/Supabase project exists for the primary
product today).

### Pricing

A ₹40–₹50 per-enhanced-resume price point has been mentioned as a business requirement.
Must be **configuration-driven** (e.g. a `price_at_request` field snapshotted per
request), never hard-coded inline in business logic or components. Payment integration
is a future phase (see [ROADMAP.md](./ROADMAP.md)) — not built.

### Authentication requirement

Browsing resume examples, viewing/downloading public reference PDFs, and using the
analyzer upload UI do **not** require login today (all client-side, nothing persisted).
Login becomes necessary once there's request history, saved analysis, or paid
deliverables to protect — see [PRODUCT.md](./PRODUCT.md) §Authentication.

## Status

**Resume Examples: LIVE.** **Resume Analyzer: retired/repurposed** — see §Resume
Analyzer foundation. **Resume Builder: Phase 1+2+3+4+5a+5b+5c+5d — a
professional, document-editor-style product: `/resume` is a real product home
(Upload your resume / Start from scratch / Analyze first, recent resumes,
popular templates) and `/resume/build` is a stable, fixed-viewport application
workspace (own header, no site Navbar/Footer, no reflow/blinking, Edit/Design/
ATS/Improve tabs with an always-visible live preview on desktop and a 5-tab
mobile layout, a collapsible accordion editor, clickable ATS/Improve
suggestions, zoomable preview canvas) that every entry path — Analyze,
Enhance, Create, or a direct visit — lands on with exactly one editor — LIVE,
discoverable from `/resume` and the homepage** — Templates
02/03, DOCX
export, a numeric ATS score, real "recent resumes" persistence, and the guided
Start-From-Scratch wizard are not built. **Paid Enhancement
flow: FUTURE, not implemented.** Nothing here should be marked LIVE in the service
catalog beyond what's actually functional.
