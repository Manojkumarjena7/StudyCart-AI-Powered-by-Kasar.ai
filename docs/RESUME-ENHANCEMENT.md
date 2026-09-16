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

### Resume Examples — LIVE

Three curated, real, downloadable reference resumes (Software Engineer / Fresher, QA
Automation Engineer / 1–3 years, Data Analyst / 2–4 years), shown in a horizontal
carousel (desktop: ~3–4 visible; mobile: one at a time, native scroll-snap).

- Config-driven: `src/config/resume-examples.ts` — the single source of truth. Adding a
  fourth example is a config entry + a PDF file, no UI changes required.
- The 3 PDFs are real, generated files (not stock content, not broken links) at
  `public/resumes/*.pdf`, built with `jsPDF` (already a project dependency, already
  used by `src/features/reports/reportGenerator.ts` — no new PDF library was added).
  Regenerate/extend via `npm run generate:resume-examples`
  (`scripts/generate-resume-examples.mjs`). Each PDF is explicitly footer-labeled
  "Sample resume for demonstration purposes" — these are fictional candidates, not real
  people.
- Card thumbnails are **CSS-built mockups** (`resume-thumbnail.tsx`), not rendered PDF
  pages or images — no PDF is loaded until the user clicks View or Download. See
  [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) §Assets.
- **View** opens an accessible modal (`resume-pdf-viewer-modal.tsx`) that embeds the PDF
  in an `<iframe>`, relying on the **browser's native PDF viewer** for zoom, page
  navigation, and printing — no PDF-rendering library was added for this (per
  AI-AGENT-GUIDE.md, existing capability was checked and preferred over adding one).
  Modal: focus-trapped, closes on Escape or backdrop click, restores focus to the
  trigger on close, has its own Download link, respects `prefers-reduced-motion`.
- **Download** works directly (`<a download>`) — no login required, these are public
  reference documents.

### Resume Analyzer foundation — UI live, analysis NOT live

`/resume#analyzer` ("Check Your Resume") has a fully working upload UI: drag-and-drop or
click to browse, client-side PDF-type and 5MB size validation, a 3-step explainer
(Upload → AI Analysis → Get Insights), and a "what you'll get" checklist.

**There is no real resume/ATS analysis backend.** The existing analyzer pipeline
(`src/features/analyzer|parser|scoring|ranking`) is built specifically for exam
response-sheet parsing (candidate/exam/question/marking-scheme domain) — it is **not**
resume text analysis and was not repurposed for this. Clicking "Analyze My Resume"
after selecting a file shows an honest message ("resume analysis isn't live yet... your
file wasn't uploaded or stored anywhere") — never a fabricated score, ATS percentage, or
placeholder result. See docs/AI-AGENT-GUIDE.md §4 "Do NOT Invent — Automation."

### How to Improve Your Resume — LIVE

A static, editorial 5-step horizontal guide (Structure → Keywords → Impact → Projects →
Polish) — plain content, no backend.

### Support StudyCart — LIVE (button disabled until configured)

A donation prompt, config-driven via `NEXT_PUBLIC_SUPPORT_PAYTM_URL`
(`src/lib/utils/support.ts`). Unset today, so the button renders disabled/"Coming soon."
No QR code is shown — a QR image was **not fabricated**; it will only appear once a real
one is provided and configured. No payment gateway, no pricing, nothing hard-coded.

## COMING SOON

- Real resume/ATS analysis — requires a real backend (see below); the UI foundation
  already exists.
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

**Resume Examples: LIVE.** **Resume Analyzer: UI foundation LIVE, real analysis NOT
implemented.** **Paid Enhancement flow: FUTURE, not implemented.** Nothing here should
be marked LIVE in the service catalog beyond what's actually functional.
