import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, vi } from "vitest";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { createContributionRepository } from "./contribution-repository";
import type { ContributionStorePaths } from "./contribution-store";

let tmpDir: string;
let paths: ContributionStorePaths;
let repo: ReturnType<typeof createContributionRepository>;
let validPdfFile: File;
let notAPdfFile: File;

beforeAll(async () => {
  // A genuinely valid, minimal one-page PDF generated with pdf-lib (a real PDF
  // document, not a hand-faked stub) — used only for isolated automated testing.
  const doc = await PDFDocument.create();
  doc.addPage([200, 200]);
  const bytes = await doc.save();
  validPdfFile = new File([bytes], "sample.pdf", { type: "application/pdf" });

  notAPdfFile = new File([new TextEncoder().encode("just some text, not a pdf")], "fake.pdf", {
    type: "application/pdf",
  });
});

beforeEach(() => {
  // Fresh, isolated storage per test — never touches the real .data/public dirs.
  tmpDir = mkdtempSync(path.join(os.tmpdir(), "library-contribution-test-"));
  paths = {
    dataFile: path.join(tmpDir, "library-contributions.json"),
    uploadsDir: path.join(tmpDir, "uploads"),
  };
  repo = createContributionRepository(paths);
});

afterAll(() => {
  if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("submitContribution — validation", () => {
  it("rejects a missing title", async () => {
    const result = await repo.submitContribution({
      title: "",
      description: "desc",
      categoryId: "programming",
      file: validPdfFile,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects a missing description", async () => {
    const result = await repo.submitContribution({
      title: "Title",
      description: "   ",
      categoryId: "programming",
      file: validPdfFile,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects a missing category", async () => {
    const result = await repo.submitContribution({
      title: "Title",
      description: "desc",
      categoryId: "",
      file: validPdfFile,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects a non-PDF mime type even with a .pdf-looking name", async () => {
    const wrongType = new File([new Uint8Array([1, 2, 3])], "notes.pdf", { type: "text/plain" });
    const result = await repo.submitContribution({
      title: "Title",
      description: "desc",
      categoryId: "programming",
      file: wrongType,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects a file that claims to be a PDF but has no real PDF content (content sniffing, not just extension/mimetype)", async () => {
    const result = await repo.submitContribution({
      title: "Title",
      description: "desc",
      categoryId: "programming",
      file: notAPdfFile,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/valid PDF/i);
    }
  });

  it("rejects a file exceeding the 20MB size limit", async () => {
    const big = new File([new Uint8Array(21 * 1024 * 1024)], "big.pdf", { type: "application/pdf" });
    const result = await repo.submitContribution({
      title: "Title",
      description: "desc",
      categoryId: "programming",
      file: big,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/too large/i);
    }
  });
});

describe("submitContribution — read-only deployment environment (Vercel)", () => {
  it("returns a graceful error and writes nothing when VERCEL is set, instead of throwing", async () => {
    vi.stubEnv("VERCEL", "1");

    const result = await repo.submitContribution({
      title: "Should Not Save",
      description: "desc",
      categoryId: "programming",
      file: validPdfFile,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/local development/i);
    }

    // No PDF written, no metadata file created — the fix must fail before touching fs.
    expect(existsSync(paths.uploadsDir) && readdirSync(paths.uploadsDir).length > 0).toBe(false);
    expect(existsSync(paths.dataFile)).toBe(false);
  });
});

describe("submitContribution — creation and PENDING state", () => {
  it("creates a PENDING contribution with a real extracted page count", async () => {
    const result = await repo.submitContribution({
      title: "Java Interview Questions",
      description: "A set of common Java interview questions.",
      categoryId: "interview-preparation",
      topic: "Java",
      contributorName: "Priya",
      file: validPdfFile,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.contribution.status).toBe("PENDING");
      expect(result.contribution.title).toBe("Java Interview Questions");
      expect(result.contribution.pageCount).toBe(1);
      expect(result.contribution.filePath).toMatch(/^\/uploads\/library-contributions\/.+\.pdf$/);
    }

    const pending = await repo.listContributions("PENDING");
    expect(pending).toHaveLength(1);
  });
});

describe("approve / reject flow", () => {
  it("approving a pending contribution makes it appear via listApprovedAsResources()", async () => {
    const submitted = await repo.submitContribution({
      title: "Approved Resource",
      description: "desc",
      categoryId: "programming",
      file: validPdfFile,
    });
    if (!submitted.ok) throw new Error("setup failed");

    const approved = await repo.approveContribution(submitted.contribution.id);
    expect(approved?.status).toBe("APPROVED");

    const resources = await repo.listApprovedAsResources();
    expect(resources).toHaveLength(1);
    expect(resources[0].source).toBe("community");
    expect(resources[0].title).toBe("Approved Resource");
    expect(resources[0].filePath).toBe(submitted.contribution.filePath);
  });

  it("rejecting a pending contribution stores the reason and keeps it out of approved resources", async () => {
    const submitted = await repo.submitContribution({
      title: "Rejected Resource",
      description: "desc",
      categoryId: "programming",
      file: validPdfFile,
    });
    if (!submitted.ok) throw new Error("setup failed");

    const rejected = await repo.rejectContribution(submitted.contribution.id, "Duplicate of an existing resource");
    expect(rejected?.status).toBe("REJECTED");
    expect(rejected?.rejectionReason).toBe("Duplicate of an existing resource");

    const resources = await repo.listApprovedAsResources();
    expect(resources).toHaveLength(0);

    const rejectedList = await repo.listContributions("REJECTED");
    expect(rejectedList).toHaveLength(1);
  });

  it("a pending contribution does not appear in approved resources", async () => {
    await repo.submitContribution({
      title: "Still Pending",
      description: "desc",
      categoryId: "programming",
      file: validPdfFile,
    });

    const resources = await repo.listApprovedAsResources();
    expect(resources).toHaveLength(0);
  });
});
