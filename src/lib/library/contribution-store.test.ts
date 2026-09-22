import { describe, it, expect, afterEach, vi } from "vitest";
import { isUploadsWritableEnvironment } from "./contribution-store";

describe("isUploadsWritableEnvironment", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is writable when VERCEL is not set (local dev)", () => {
    vi.stubEnv("VERCEL", "");
    expect(isUploadsWritableEnvironment()).toBe(true);
  });

  it("is not writable when VERCEL is set (deployed serverless environment)", () => {
    vi.stubEnv("VERCEL", "1");
    expect(isUploadsWritableEnvironment()).toBe(false);
  });
});
