import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * Response-sheet PDFs of this vendor style (confirmed against a real
 * sample PDF, 2026-07) render each numbered option's text in a distinct
 * fill color depending on correctness — green for the correct option,
 * red for the others — rather than exposing that information as plain
 * extractable text (pdf-parse's plain text stream has no marker at all
 * for correctness; it's purely a rendering color). This module reads
 * that color directly from the PDF's drawing-operator stream (the same
 * technique a PDF renderer itself uses), which is deterministic and
 * does not require OCR or image/vision analysis.
 *
 * Verified colors: "#40c64b" (green, correct) and "#f61818" (red,
 * incorrect). If a given PDF doesn't use this exact convention (e.g. a
 * different exam board's export), no colored runs will be found and
 * the caller gracefully falls back to not knowing correctness — it
 * never fabricates it.
 */

const CORRECT_COLOR = "#40c64b";
const INCORRECT_COLOR = "#f61818";
const NEW_OPTION_START = /^\s*[1-4][.)]/;

export interface ColoredOptionRun {
  /** The option's position (1-4) as printed, parsed from its own leading "N." */
  number: number;
  /** The option's text as rendered in that color (may be empty for image/formula-based options). */
  text: string;
  isCorrect: boolean;
}

interface RawColoredRun {
  color: string | null;
  text: string;
}

function mergeFragments(runs: RawColoredRun[]): RawColoredRun[] {
  const merged: RawColoredRun[] = [];
  for (const run of runs) {
    const startsNewOption = NEW_OPTION_START.test(run.text);
    const last = merged[merged.length - 1];
    if (last && last.color === run.color && !startsNewOption) {
      last.text += run.text;
    } else {
      merged.push({ ...run });
    }
  }
  return merged;
}

/**
 * Extracts every colored (green/red) option run across the whole PDF,
 * in document (reading) order. The caller consumes these sequentially,
 * matching them against the plain-text-parsed options for each question
 * in the same order.
 */
export async function extractColoredOptionRuns(buffer: Buffer): Promise<ColoredOptionRun[]> {
  let doc;
  try {
    doc = await getDocument({ data: new Uint8Array(buffer), verbosity: 0 }).promise;
  } catch {
    // If the PDF can't be opened at this lower level, just report no
    // color data — the caller falls back to text-only extraction.
    return [];
  }

  const opNameByCode = new Map<number, string>(
    Object.entries(OPS).map(([name, code]) => [code as number, name])
  );

  const allRuns: ColoredOptionRun[] = [];

try {
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const opList = await page.getOperatorList();
    console.log("Total operators:", opList.fnArray.length);

    let currentColor: string | null = null;
    const rawRuns: RawColoredRun[] = [];

    for (let i = 0; i < opList.fnArray.length; i++) {
    const opName = opNameByCode.get(opList.fnArray[i]);

    if (
      opName === "showText" ||
      opName === "showSpacedText" ||
      opName === "nextLineShowText" ||
      opName === "nextLineSetSpacingShowText"
    ) {
      console.log("TEXT OPERATOR:", opName);
    }

  if (opName?.toLowerCase().includes("color")) {
  console.log("COLOR OP:", opName, opList.argsArray[i]);

  const args = opList.argsArray[i];

  console.log("RAW RGB ARGS:", args);

  if (
    Array.isArray(args) &&
    args.length > 0 &&
    typeof args[0] === "string"
  ) {
    currentColor = args[0].toLowerCase();
  } else {
    currentColor = null;
  }

  console.log("COLOR =", currentColor);
}

  if (opName === "showText") {
    console.log(
      "SHOWTEXT RAW:",
      JSON.stringify(opList.argsArray[i], null, 2)
    );

    const glyphs = opList.argsArray[i][0] as { unicode?: string }[];
    const text = glyphs.map((g) => g.unicode ?? "").join("");

    console.log("TEXT:", JSON.stringify(text));
    console.log("COLOR:", currentColor);

    if (
      (currentColor === CORRECT_COLOR ||
        currentColor === INCORRECT_COLOR) &&
      text.trim()
    ) {
      rawRuns.push({
        color: currentColor,
        text,
      });
    }
  }
}

// Merge ONLY AFTER scanning the entire page
for (const run of mergeFragments(rawRuns)) {
  const match = run.text.match(/^\s*([1-4])[.)]\s*([\s\S]*)$/);

  if (!match) continue;

        allRuns.push({
          number: Number(match[1]),
          text: match[2].trim(),
          isCorrect: run.color === CORRECT_COLOR,
        });
    }

  } // end page loop

} catch {
  // Partial extraction failure (e.g. one malformed page)
  return allRuns;
}

return allRuns;
}