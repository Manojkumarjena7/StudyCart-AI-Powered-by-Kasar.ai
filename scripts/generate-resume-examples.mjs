// Generates the reference/demo resume PDFs shown on /resume.
// Run: node scripts/generate-resume-examples.mjs
// Output: public/resumes/*.pdf
//
// These are clearly-labeled fictional sample resumes for career guidance — not real
// people. Uses jsPDF (already a project dependency; also used by
// src/features/reports/reportGenerator.ts) rather than adding a new PDF library.
// See docs/RESUME-ENHANCEMENT.md §Resume Examples.

import { jsPDF } from "jspdf";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "resumes");

const COLORS = {
  ink: "#0f172a",
  muted: "#64748b",
  accent: "#0e7490",
  line: "#e2e8f0",
};

const MARGIN = 48;
const PAGE_WIDTH = 612; // US Letter, pt
const CONTENT_RIGHT = PAGE_WIDTH - MARGIN;

function header(doc, { name, role, email, phone, location, linkedin }) {
  let y = MARGIN + 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(COLORS.ink);
  doc.text(name, MARGIN, y);

  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.accent);
  doc.text(role, MARGIN, y);

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(COLORS.muted);
  doc.text(`${email}  |  ${phone}  |  ${location}  |  ${linkedin}`, MARGIN, y);

  y += 10;
  doc.setDrawColor(COLORS.line);
  doc.line(MARGIN, y, CONTENT_RIGHT, y);
  return y + 22;
}

function sectionTitle(doc, title, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.accent);
  doc.text(title.toUpperCase(), MARGIN, y);
  return y + 14;
}

function paragraph(doc, text, y, maxWidth = CONTENT_RIGHT - MARGIN) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(COLORS.ink);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, MARGIN, y);
  return y + lines.length * 12 + 6;
}

function bulletList(doc, items, y, maxWidth = CONTENT_RIGHT - MARGIN - 12) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(COLORS.ink);
  for (const item of items) {
    doc.setTextColor(COLORS.accent);
    doc.text("-", MARGIN, y);
    doc.setTextColor(COLORS.ink);
    const lines = doc.splitTextToSize(item, maxWidth);
    doc.text(lines, MARGIN + 12, y);
    y += lines.length * 12 + 3;
  }
  return y + 6;
}

function entryHeading(doc, title, meta, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.ink);
  doc.text(title, MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.muted);
  doc.text(meta, CONTENT_RIGHT, y, { align: "right" });
  return y + 14;
}

function skillRow(doc, skills, y) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(COLORS.ink);
  const lines = doc.splitTextToSize(skills.join("   •   "), CONTENT_RIGHT - MARGIN);
  doc.text(lines, MARGIN, y);
  return y + lines.length * 13 + 8;
}

function footer(doc) {
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.muted);
  doc.text(
    "Sample resume for demonstration purposes — StudyCart AI Interview Support reference library.",
    MARGIN,
    780
  );
}

function buildResume(spec) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  let y = header(doc, spec.contact);

  y = sectionTitle(doc, "Summary", y);
  y = paragraph(doc, spec.summary, y);

  y = sectionTitle(doc, "Skills", y);
  y = skillRow(doc, spec.skills, y);

  y = sectionTitle(doc, "Experience", y);
  for (const exp of spec.experience) {
    y = entryHeading(doc, `${exp.title} — ${exp.company}`, exp.period, y);
    y = bulletList(doc, exp.bullets, y);
  }

  y = sectionTitle(doc, "Projects", y);
  for (const proj of spec.projects) {
    y = entryHeading(doc, proj.title, proj.stack, y);
    y = bulletList(doc, proj.bullets, y);
  }

  y = sectionTitle(doc, "Education", y);
  y = entryHeading(doc, spec.education.degree, spec.education.period, y);
  y = paragraph(doc, spec.education.institution, y);

  footer(doc);
  return doc;
}

const RESUMES = [
  {
    file: "software-engineer.pdf",
    contact: {
      name: "Rohan Mehta",
      role: "Software Engineer",
      email: "rohan.mehta@example.com",
      phone: "+91 90000 00001",
      location: "Pune, India",
      linkedin: "linkedin.com/in/rohanmehta",
    },
    summary:
      "Final-year Computer Science graduate with hands-on experience building full-stack web applications. Comfortable across the stack, with a focus on clean, maintainable code and shipping features end to end.",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "REST APIs", "PostgreSQL", "Git", "Docker (basics)"],
    experience: [
      {
        title: "Software Engineering Intern",
        company: "Nimbus Labs",
        period: "May 2025 – Aug 2025",
        bullets: [
          "Built a customer-facing dashboard feature used by 500+ daily active users, reducing manual reporting time by 40%.",
          "Fixed 25+ bugs across the frontend codebase and added test coverage for two previously untested modules.",
          "Collaborated with 2 senior engineers in code review, adopting the team's TypeScript and testing conventions.",
        ],
      },
    ],
    projects: [
      {
        title: "TaskFlow — Team Task Tracker",
        stack: "React, Node.js, PostgreSQL",
        bullets: [
          "Built a full-stack task management app with drag-and-drop boards and real-time updates for a 4-person team.",
          "Designed the REST API and database schema from scratch; deployed on a free-tier cloud host.",
        ],
      },
    ],
    education: {
      degree: "B.Tech, Computer Science",
      institution: "Savitribai Phule Pune University",
      period: "2022 – 2026",
    },
  },
  {
    file: "qa-automation-engineer.pdf",
    contact: {
      name: "Ananya Sharma",
      role: "QA Automation Engineer",
      email: "ananya.sharma@example.com",
      phone: "+91 90000 00002",
      location: "Bengaluru, India",
      linkedin: "linkedin.com/in/ananyasharma",
    },
    summary:
      "QA Automation Engineer with 2 years of experience designing and maintaining automated test suites for web and API applications. Focused on reducing regression time and catching defects before release.",
    skills: ["Selenium", "Playwright", "Java", "Python", "API Testing (Postman/RestAssured)", "Jenkins", "JIRA", "Git"],
    experience: [
      {
        title: "QA Automation Engineer",
        company: "ABC Technologies",
        period: "Jan 2023 – Present",
        bullets: [
          "Built and maintained a Selenium + Java automation suite covering 200+ regression test cases, cutting manual regression time from 3 days to 6 hours.",
          "Integrated automated tests into the Jenkins CI pipeline, catching an average of 8 defects per release before staging.",
          "Wrote API-level tests for 15+ endpoints using RestAssured, improving pre-release defect detection by 30%.",
        ],
      },
      {
        title: "QA Intern",
        company: "Brightline Software",
        period: "Jun 2022 – Dec 2022",
        bullets: [
          "Executed manual test cases for 3 sprint releases and logged 60+ defects with clear reproduction steps.",
        ],
      },
    ],
    projects: [
      {
        title: "E-commerce Checkout Automation Framework",
        stack: "Playwright, TypeScript, GitHub Actions",
        bullets: [
          "Built a page-object-model framework covering the full checkout flow, running on every pull request.",
          "Reduced flaky test failures by 70% by introducing explicit waits and retry logic.",
        ],
      },
    ],
    education: {
      degree: "B.E., Information Science",
      institution: "Visvesvaraya Technological University",
      period: "2018 – 2022",
    },
  },
  {
    file: "data-analyst.pdf",
    contact: {
      name: "Karthik Iyer",
      role: "Data Analyst",
      email: "karthik.iyer@example.com",
      phone: "+91 90000 00003",
      location: "Hyderabad, India",
      linkedin: "linkedin.com/in/karthikiyer",
    },
    summary:
      "Data Analyst with 3 years of experience turning raw business data into dashboards and reports that support decision-making. Strong in SQL, Python, and building visualizations stakeholders actually use.",
    skills: ["SQL", "Python (pandas)", "Power BI", "Tableau", "Excel", "A/B Testing", "ETL basics", "Statistics"],
    experience: [
      {
        title: "Data Analyst",
        company: "Orbit Cloud",
        period: "Jul 2022 – Present",
        bullets: [
          "Built and maintained 6 Power BI dashboards used weekly by leadership, replacing manual spreadsheet reporting.",
          "Wrote SQL queries against a 40M-row transactions table to identify a churn pattern that informed a retention campaign, contributing to a 12% reduction in churn.",
          "Automated a recurring weekly report with Python, saving approximately 5 hours of manual work per week.",
        ],
      },
      {
        title: "Business Analytics Intern",
        company: "Pivot Systems",
        period: "Jan 2022 – Jun 2022",
        bullets: [
          "Cleaned and analyzed survey data from 2,000+ respondents to support a product feature prioritization decision.",
        ],
      },
    ],
    projects: [
      {
        title: "Retail Sales Forecasting Dashboard",
        stack: "Python, pandas, Power BI",
        bullets: [
          "Built a forecasting model on 3 years of historical sales data and visualized results in an interactive dashboard.",
        ],
      },
    ],
    education: {
      degree: "B.Sc., Statistics",
      institution: "Osmania University",
      period: "2018 – 2021",
    },
  },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const spec of RESUMES) {
  const doc = buildResume(spec);
  const bytes = Buffer.from(doc.output("arraybuffer"));
  writeFileSync(join(OUT_DIR, spec.file), bytes);
  console.log(`Generated public/resumes/${spec.file} (${bytes.byteLength} bytes)`);
}
