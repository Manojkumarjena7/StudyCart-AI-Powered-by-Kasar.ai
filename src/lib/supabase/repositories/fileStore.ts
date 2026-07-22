import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import type { StudentResult } from "@/types/domain";

// Use a writable temp directory on Vercel
const DATA_DIR =
  process.env.VERCEL
    ? path.join(os.tmpdir(), ".data")
    : path.join(process.cwd(), ".data");

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