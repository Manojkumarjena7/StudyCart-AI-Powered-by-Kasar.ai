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
