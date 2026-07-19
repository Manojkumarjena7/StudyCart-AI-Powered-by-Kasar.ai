# Remaining Fixes Update — Merge Guide

## Files to replace (copy over existing files at the same path)

```
src/features/parser/adapters/digialm/extractor.ts
src/features/parser/adapters/digialm/extractor.test.ts
src/features/parser/adapters/pdf/normalize.ts
src/features/parser/adapters/pdf/pdf.parser.ts
src/features/parser/adapters/pdf/pdf.parser.test.ts
src/features/parser/adapters/pdf/textExtractor.ts
src/features/parser/adapters/pdf/textExtractor.test.ts
src/features/parser/adapters/pdf/__fixtures__/sample-response-sheet.pdf
src/features/parser/adapters/pdf/index.ts
src/components/results/performance-charts.tsx
package.json
package-lock.json
```

## New files to add (if not already present from the earlier PDF patch)

```
src/features/parser/adapters/pdf/colorExtractor.ts
src/features/parser/adapters/pdf/colorExtractor.test.ts
```

**Note:** if you already applied the earlier `PDF_Parser_Final_Update.zip` patch, the
entire `src/features/parser/adapters/pdf/` folder here is identical to that patch —
it's re-included in this ZIP only to guarantee you have the fixed version, since
Issue 2 in your report ("Correct = 0, Wrong = 0, Skipped = 100") matches exactly the
symptom of the *pre-patch* code. Re-copying it is a safe no-op if you already merged
it; it resolves Issue 2 if you hadn't.

## Issue-by-issue summary

### Issue 1 — DigiAlm Correct/Wrong reversed → **fixed**
Root cause: the tick-icon detection regex (`/tick|check(mark)?/i`) was not anchored
against the word **"checked"** — a very common CSS/attribute keyword meaning "this
radio input is *selected*" (i.e. the candidate's own choice), completely unrelated to
whether that choice was *correct*. If the real page marks a selected radio input with
a `checked` class/attribute, the old regex would treat that selection as if it were
the green tick marking the correct answer. For a wrong answer where the (wrong) chosen
option happened to sort before the true correct option, this silently swapped which
option counted as "correct," inverting the outcome for that question.

Fix: narrowed the pattern to `/tick|check(?!ed)(?:mark)?/i` — a negative lookahead
that keeps matching `tick`, `check`, `checkmark`, `check-icon` etc., but explicitly
excludes `checked`/`unchecked`. A regression test (`extractor.test.ts`) locks this in:
a fixture where the wrong, `checked` (selected) option is listed before the correct,
`tick`-marked option now correctly resolves to `outcome: "wrong"`.

Marking scheme (`+1` correct / `-0.25` wrong / `0` skipped) was verified independently
and was already correct — untouched by this fix, and confirmed still correct against
your real uploaded PDF's official marking-scheme note.

### Issue 2 — PDF parser all-skipped → **already fixed in a prior patch**
This exact symptom (`Correct = 0, Wrong = 0, Skipped = 100`) matches the code *before*
`PDF_Parser_Final_Update.zip` was applied. Re-verified against your real uploaded PDF
in this session: current code produces `28 Correct / 62 Wrong / 10 Skipped / Final
Score = 12.5`, not all-skipped. If you're still seeing all-skipped locally, the patch
likely wasn't merged yet — this ZIP includes the complete, already-fixed `pdf/` folder
again to make sure.

### Issue 3 — Subject-wise totals incorrect → **no code change needed; confirmed fixed**
Subject aggregation (`buildSubjectBlocks` in both `digialm/normalize.ts` and
`pdf/normalize.ts`) was already computing each subject's correct/wrong/skipped/total
independently and correctly — this was verified directly against your real PDF: every
subject's numbers sum exactly to the overall totals (100 total / 28 correct / 62 wrong
/ 10 skipped across all subjects). The incorrect subject totals you saw were a
downstream symptom of Issue 1 (and, if unpatched, Issue 2) — once those are fixed,
subject-wise numbers are correct automatically, since they're derived from the same
per-question `outcome` field.

### Issue 4 — Charts upgraded
`performance-charts.tsx` only — same data props (`summary`, `subjects`), same 3
charts, same page layout. Added: percentage labels on the pie chart and value labels
above each bar, a distinct color per subject (rotating palette) instead of one flat
color per bar chart, legends on both bar charts (previously only the pie chart had
one), fully rounded bar corners, richer hover tooltips (colored dot + bold value +
percentage where applicable), and smooth 700ms animations on all three charts.

## package.json / package-lock.json changes

One direct dependency, `pdfjs-dist@5.4.296` (pinned exact version) — needed by
`colorExtractor.ts` for the PDF fix. This was already introduced in the earlier PDF
patch; included again here since `package.json`/`package-lock.json` travel with the
PDF folder.

## Is `npm install` required after copying?

**Yes**, because `package.json`/`package-lock.json` are included.

## Any config files changed?

**No.** `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`,
`vitest.config.ts` are all unchanged.

## Verification completed in this session

- `npm test` — 85/85 passing
- `npm run lint` — 0 errors, 0 warnings
- `npm run build` — production build succeeds
- Debug logs: none present (nothing added this session needed removal)
- Cross-checked against your real uploaded PDF: 28 Correct / 62 Wrong / 10 Skipped /
  Final Score 12.5, with subject-wise totals summing correctly

## Explicitly NOT touched

Scoring engine, ranking service, repositories, authentication, branding, navigation,
routing, result page layout/structure (only the charts component's internals changed),
detailed analysis page, homepage, About page.
