import { describe, it, expect } from "vitest";
import { createEmptyResumeData, type ResumeData } from "./types";
import { getAtsChecklist, ACTION_VERBS } from "./ats-checklist";

function statusOf(result: ReturnType<typeof getAtsChecklist>, id: string) {
  return result.checks.find((c) => c.id === id)?.status;
}

const COMPLETE_RESUME: ResumeData = {
  personalInfo: {
    fullName: "Jordan Smith",
    email: "jordan.smith@example.com",
    phone: "+1 555-000-1111",
    location: "Austin, TX",
    links: [],
  },
  summary:
    "Results-driven software engineer with five years of experience building and shipping web applications across the stack.",
  experience: [
    {
      id: "e1",
      role: "Senior Engineer",
      company: "Acme Corp",
      startDate: "Jan 2022",
      current: true,
      bullets: [
        "Developed a billing platform used by 40% more customers within 6 months",
        "Reduced API latency by 30% through targeted query optimization",
      ],
    },
    {
      id: "e2",
      role: "Software Engineer",
      company: "Beta Inc",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      bullets: ["Built internal tooling for the support team", "Automated 15 manual QA test cases"],
    },
  ],
  education: [{ id: "ed1", institution: "State University", degree: "B.Sc. Computer Science", startDate: "2016", endDate: "2020" }],
  skills: [{ id: "s1", category: "Languages", items: ["TypeScript", "Python"] }],
  projects: [{ id: "p1", name: "Personal Site", bullets: ["Built with Next.js and deployed to 100+ users"] }],
  certifications: [{ id: "c1", name: "AWS Certified Developer" }],
  achievements: ["Won 1st place at CodeFest 2023"],
};

describe("getAtsChecklist — complete resume", () => {
  const result = getAtsChecklist(COMPLETE_RESUME);

  it("passes contact, summary, experience, education, skills, projects", () => {
    expect(statusOf(result, "contact")).toBe("pass");
    expect(statusOf(result, "summary")).toBe("pass");
    expect(statusOf(result, "experience")).toBe("pass");
    expect(statusOf(result, "education")).toBe("pass");
    expect(statusOf(result, "skills")).toBe("pass");
    expect(statusOf(result, "projects")).toBe("pass");
  });

  it("passes action verbs (bullets start with developed/reduced/built/automated)", () => {
    expect(statusOf(result, "action-verbs")).toBe("pass");
  });

  it("passes quantifiable achievements (40%, 30%, 15, 100+)", () => {
    expect(statusOf(result, "quantifiable-achievements")).toBe("pass");
  });

  it("passes the standard-sections overview", () => {
    expect(statusOf(result, "standard-sections")).toBe("pass");
  });

  it("passes overall detail (not sparse)", () => {
    expect(statusOf(result, "sparse-content")).toBe("pass");
  });

  it("never produces a numeric score field", () => {
    for (const check of result.checks) {
      expect(check.message).not.toMatch(/\d+%\s*(ats|score|compat)/i);
      expect((check as Record<string, unknown>).score).toBeUndefined();
    }
  });
});

describe("getAtsChecklist — missing contact information", () => {
  it("fails when both name and email/phone are missing", () => {
    const data = { ...createEmptyResumeData() };
    const result = getAtsChecklist(data);
    expect(statusOf(result, "contact")).toBe("fail");
  });

  it("warns (not fails) when only the name is present", () => {
    const data: ResumeData = { ...createEmptyResumeData(), personalInfo: { fullName: "Alex Kim", links: [] } };
    const result = getAtsChecklist(data);
    expect(statusOf(result, "contact")).toBe("warning");
  });

  it("warns (not fails) when only an email is present", () => {
    const data: ResumeData = { ...createEmptyResumeData(), personalInfo: { fullName: "", email: "a@b.com", links: [] } };
    const result = getAtsChecklist(data);
    expect(statusOf(result, "contact")).toBe("warning");
  });

  it("passes when name and phone are both present", () => {
    const data: ResumeData = { ...createEmptyResumeData(), personalInfo: { fullName: "Alex Kim", phone: "555-1234", links: [] } };
    expect(statusOf(getAtsChecklist(data), "contact")).toBe("pass");
  });
});

describe("getAtsChecklist — missing summary", () => {
  it("fails when summary is empty", () => {
    const data = { ...COMPLETE_RESUME, summary: "" };
    expect(statusOf(getAtsChecklist(data), "summary")).toBe("fail");
  });

  it("warns when summary is present but very short", () => {
    const data = { ...COMPLETE_RESUME, summary: "Engineer." };
    expect(statusOf(getAtsChecklist(data), "summary")).toBe("warning");
  });

  it("passes when summary is present and substantial", () => {
    expect(statusOf(getAtsChecklist(COMPLETE_RESUME), "summary")).toBe("pass");
  });
});

describe("getAtsChecklist — missing experience", () => {
  it("fails when there are no experience entries", () => {
    const data = { ...COMPLETE_RESUME, experience: [] };
    expect(statusOf(getAtsChecklist(data), "experience")).toBe("fail");
  });

  it("fails when an experience entry exists but is entirely blank", () => {
    const data: ResumeData = { ...COMPLETE_RESUME, experience: [{ id: "e1", role: "", company: "", bullets: [] }] };
    expect(statusOf(getAtsChecklist(data), "experience")).toBe("fail");
  });

  it("passes with multiple experience entries", () => {
    expect(statusOf(getAtsChecklist(COMPLETE_RESUME), "experience")).toBe("pass");
    expect(COMPLETE_RESUME.experience.length).toBeGreaterThan(1);
  });
});

describe("getAtsChecklist — missing education", () => {
  it("fails when there are no education entries", () => {
    const data = { ...COMPLETE_RESUME, education: [] };
    expect(statusOf(getAtsChecklist(data), "education")).toBe("fail");
  });

  it("passes when at least one education entry has an institution or degree", () => {
    expect(statusOf(getAtsChecklist(COMPLETE_RESUME), "education")).toBe("pass");
  });
});

describe("getAtsChecklist — missing skills", () => {
  it("fails when there are no skill items", () => {
    const data = { ...COMPLETE_RESUME, skills: [] };
    expect(statusOf(getAtsChecklist(data), "skills")).toBe("fail");
  });

  it("fails when a skill group exists but has no items", () => {
    const data = { ...COMPLETE_RESUME, skills: [{ id: "s1", items: [] }] };
    expect(statusOf(getAtsChecklist(data), "skills")).toBe("fail");
  });

  it("passes when at least one skill item exists", () => {
    expect(statusOf(getAtsChecklist(COMPLETE_RESUME), "skills")).toBe("pass");
  });
});

describe("getAtsChecklist — missing projects never hard-fails", () => {
  it("returns a warning (never fail) when there are no projects", () => {
    const data = { ...COMPLETE_RESUME, projects: [] };
    const status = statusOf(getAtsChecklist(data), "projects");
    expect(status).toBe("warning");
    expect(status).not.toBe("fail");
  });

  it("passes when a project exists", () => {
    expect(statusOf(getAtsChecklist(COMPLETE_RESUME), "projects")).toBe("pass");
  });
});

describe("getAtsChecklist — action verbs", () => {
  it("passes with strong action verbs at the start of bullets", () => {
    const data = {
      ...COMPLETE_RESUME,
      experience: [
        { id: "e1", role: "Engineer", company: "Acme", bullets: ["Developed a new feature", "Led the migration project"] },
      ],
    };
    expect(statusOf(getAtsChecklist(data), "action-verbs")).toBe("pass");
    for (const verb of ["developed", "led"]) {
      expect(ACTION_VERBS).toContain(verb);
    }
  });

  it("warns when most bullets lack a recognizable action verb", () => {
    const data = {
      ...COMPLETE_RESUME,
      experience: [
        {
          id: "e1",
          role: "Engineer",
          company: "Acme",
          bullets: ["Responsible for the billing module", "Worked with the support team", "Was part of the QA rotation"],
        },
      ],
    };
    expect(statusOf(getAtsChecklist(data), "action-verbs")).toBe("warning");
  });

  it("warns when there are no bullets to check at all", () => {
    const data = { ...COMPLETE_RESUME, experience: [{ id: "e1", role: "Engineer", company: "Acme", bullets: [] }] };
    expect(statusOf(getAtsChecklist(data), "action-verbs")).toBe("warning");
  });
});

describe("getAtsChecklist — quantifiable achievements", () => {
  it("passes when a bullet contains a percentage", () => {
    const data = { ...COMPLETE_RESUME, experience: [{ id: "e1", role: "Engineer", company: "Acme", bullets: ["Improved throughput by 20%"] }] };
    expect(statusOf(getAtsChecklist(data), "quantifiable-achievements")).toBe("pass");
  });

  it("passes when a bullet contains a currency amount", () => {
    const data = { ...COMPLETE_RESUME, experience: [{ id: "e1", role: "Engineer", company: "Acme", bullets: ["Managed a budget of ₹5L"] }] };
    expect(statusOf(getAtsChecklist(data), "quantifiable-achievements")).toBe("pass");
  });

  it("passes when a bullet contains a count/time metric", () => {
    const data = { ...COMPLETE_RESUME, experience: [{ id: "e1", role: "Engineer", company: "Acme", bullets: ["Automated 30 test cases over 3 months"] }] };
    expect(statusOf(getAtsChecklist(data), "quantifiable-achievements")).toBe("pass");
  });

  it("warns (never fails) when no bullet has a measurable indicator", () => {
    const data = {
      ...COMPLETE_RESUME,
      experience: [{ id: "e1", role: "Engineer", company: "Acme", bullets: ["Helped the team ship features"] }],
      projects: [],
    };
    const status = statusOf(getAtsChecklist(data), "quantifiable-achievements");
    expect(status).toBe("warning");
    expect(status).not.toBe("fail");
  });
});

describe("getAtsChecklist — sparse resume", () => {
  it("warns on an almost-empty resume", () => {
    const data: ResumeData = { ...createEmptyResumeData(), personalInfo: { fullName: "Sam Lee", links: [] } };
    expect(statusOf(getAtsChecklist(data), "sparse-content")).toBe("warning");
  });

  it("does not warn once there is a reasonable amount of content", () => {
    expect(statusOf(getAtsChecklist(COMPLETE_RESUME), "sparse-content")).toBe("pass");
  });

  it("never fabricates a numeric score for a sparse resume", () => {
    const result = getAtsChecklist(createEmptyResumeData());
    const sparse = result.checks.find((c) => c.id === "sparse-content");
    expect(sparse?.message).toContain("Add more relevant detail");
  });
});

describe("getAtsChecklist — empty optional sections do not crash", () => {
  it("runs cleanly on completely empty ResumeData", () => {
    const result = getAtsChecklist(createEmptyResumeData());
    expect(result.checks).toHaveLength(10);
    for (const check of result.checks) {
      expect(["pass", "warning", "fail"]).toContain(check.status);
      expect(check.title.length).toBeGreaterThan(0);
      expect(check.message.length).toBeGreaterThan(0);
    }
  });

  it("standard-sections reflects how many of the five core checks pass", () => {
    const allMissing = getAtsChecklist(createEmptyResumeData());
    expect(statusOf(allMissing, "standard-sections")).toBe("fail");

    const allPresent = getAtsChecklist(COMPLETE_RESUME);
    expect(statusOf(allPresent, "standard-sections")).toBe("pass");
  });
});
