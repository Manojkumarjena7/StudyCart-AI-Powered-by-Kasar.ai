"use client";

import { jsPDF } from "jspdf";
import type { StudentResult } from "@/types/domain";
import { rankingDisclaimer } from "@/config/site";
import { brandConfig } from "@/config/brand";

const PAGE_MARGIN = 40;
const COLORS = {
  ink: "#0f172a",
  muted: "#64748b",
  accent: "#0e7490",
  line: "#e2e8f0",
};

function addHeader(doc: jsPDF, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(COLORS.ink);
  doc.text(brandConfig.productName, PAGE_MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.muted);
  doc.text(brandConfig.endorsementText, PAGE_MARGIN, y + 14);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 555, y, { align: "right" });

  doc.setDrawColor(COLORS.line);
  doc.line(PAGE_MARGIN, y + 22, 555, y + 22);
  return y + 44;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(COLORS.accent);
  doc.text(title, PAGE_MARGIN, y);
  return y + 18;
}

function addKeyValueGrid(doc: jsPDF, entries: [string, string][], y: number): number {
  doc.setFontSize(10);
  const colWidth = 257;
  let row = 0;
  for (const [label, value] of entries) {
    const col = row % 2;
    const x = PAGE_MARGIN + col * colWidth;
    const rowY = y + Math.floor(row / 2) * 32;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.muted);
    doc.text(label, x, rowY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.ink);
    doc.text(String(value), x, rowY + 14);
    row++;
  }
  return y + Math.ceil(entries.length / 2) * 32 + 12;
}

function addTable(
  doc: jsPDF,
  headers: string[],
  rows: (string | number)[][],
  y: number,
  colWidths: number[]
): number {
  const startX = PAGE_MARGIN;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.muted);
  let x = startX;
  headers.forEach((h, i) => {
    doc.text(h, x, y);
    x += colWidths[i];
  });
  y += 6;
  doc.setDrawColor(COLORS.line);
  doc.line(startX, y, startX + colWidths.reduce((a, b) => a + b, 0), y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.ink);
  for (const row of rows) {
    x = startX;
    row.forEach((cell, i) => {
      doc.text(String(cell), x, y);
      x += colWidths[i];
    });
    y += 16;
  }
  return y + 10;
}

/**
 * Generates a professional result-report PDF entirely client-side (no
 * server round-trip, no persistence) and triggers a browser download.
 * Only the minimal data already shown on the result page is included —
 * nothing extra is exposed.
 */
export function downloadResultReport(result: StudentResult): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = 50;

  y = addHeader(doc, y);

  y = addSectionTitle(doc, "Candidate & Exam Information", y);
  const infoEntries: [string, string][] = [];
  if (result.candidate.name) infoEntries.push(["Candidate Name", result.candidate.name]);
  if (result.candidate.rollNumber) infoEntries.push(["Roll Number", result.candidate.rollNumber]);
  if (result.candidate.applicationNumber)
    infoEntries.push(["Application Number", result.candidate.applicationNumber]);
  if (result.exam.examName) infoEntries.push(["Exam Name", result.exam.examName]);
  if (result.exam.post) infoEntries.push(["Post", result.exam.post]);
  if (result.exam.examDate) infoEntries.push(["Exam Date", result.exam.examDate]);
  if (result.exam.shift) infoEntries.push(["Shift", result.exam.shift]);
  if (result.exam.centre) infoEntries.push(["Centre", result.exam.centre]);
  if (result.candidate.category) infoEntries.push(["Category", result.candidate.category]);
  y = addKeyValueGrid(doc, infoEntries, y);

  y = addSectionTitle(doc, "Score Summary", y);
  y = addKeyValueGrid(
    doc,
    [
      ["Final Score", String(result.scoreSummary.finalScore)],
      ["Total Questions", String(result.scoreSummary.totalQuestions)],
      ["Attempted", String(result.scoreSummary.attempted)],
      ["Correct", String(result.scoreSummary.correct)],
      ["Wrong", String(result.scoreSummary.wrong)],
      ["Skipped", String(result.scoreSummary.skipped)],
      ["Accuracy", `${result.scoreSummary.accuracy}%`],
      ["Positive Marks", String(result.scoreSummary.positiveMarks)],
      ["Negative Marks", String(result.scoreSummary.negativeMarks)],
    ],
    y
  );

  y = addSectionTitle(doc, "Subject-Wise Performance", y);
  y = addTable(
    doc,
    ["Subject", "Total", "Correct", "Wrong", "Skipped", "Accuracy", "Score"],
    result.subjectPerformance.map((s) => [
      s.subject,
      s.total,
      s.correct,
      s.wrong,
      s.skipped,
      `${s.accuracy}%`,
      s.score,
    ]),
    y,
    [140, 55, 55, 55, 55, 60, 50]
  );

  if (y > 680) {
    doc.addPage();
    y = 50;
  }
  y = addSectionTitle(doc, "Community Ranking", y);
  const rankingEntries: [string, string][] = [
    ["Overall Rank", `#${result.ranking.overallRank.toLocaleString("en-IN")} / ${result.ranking.totalCandidates.toLocaleString("en-IN")}`],
  ];
  if (result.ranking.categoryRank) {
    rankingEntries.push([
      "Category Rank",
      `#${result.ranking.categoryRank.toLocaleString("en-IN")} / ${result.ranking.categoryTotalCandidates?.toLocaleString("en-IN") ?? "-"}`,
    ]);
  }
  if (result.ranking.genderRank) {
    rankingEntries.push([
      "Gender Rank",
      `#${result.ranking.genderRank.toLocaleString("en-IN")} / ${result.ranking.genderTotalCandidates?.toLocaleString("en-IN") ?? "-"}`,
    ]);
  }
  y = addKeyValueGrid(doc, rankingEntries, y);

  doc.setFontSize(8);
  doc.setTextColor(COLORS.muted);
  doc.text(doc.splitTextToSize(rankingDisclaimer, 515), PAGE_MARGIN, y + 6);

  const fileNameSafe = (result.candidate.name ?? "result").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${fileNameSafe}-result-report.pdf`);
}
