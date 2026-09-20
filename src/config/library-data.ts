/**
 * Learning Library demo/local content — Phase 1 MVP. Single source of truth for all
 * course, lesson, resource, and category data consumed through
 * src/lib/library/repository.ts (never import this file directly from UI components —
 * go through the repository so a future Supabase-backed implementation is a drop-in
 * swap). See docs/LEARNING-LIBRARY.md.
 *
 * This is clearly-marked demo content for the MVP, not real user-generated or
 * admin-curated data. No third-party course branding is used — thumbnails are generic
 * icon tiles (see library-icon.tsx), and instructor credit is the generic
 * "KasarTech.ai Team" rather than a fabricated named person.
 */

import type {
  LibraryCategory,
  LibraryContentPillar,
  LibraryCourse,
  LibraryLesson,
  LibraryResource,
} from "@/lib/library/types";

export const libraryCategories: LibraryCategory[] = [
  {
    id: "programming",
    slug: "programming",
    label: "Programming",
    description: "Core programming languages and fundamentals.",
    icon: "Code2",
  },
  {
    id: "automation-testing",
    slug: "automation-testing",
    label: "Automation Testing",
    description: "Selenium, Playwright, and test automation practices.",
    icon: "TestTube2",
  },
  {
    id: "web-development",
    slug: "web-development",
    label: "Web Development",
    description: "Frontend, backend, and full-stack web development.",
    icon: "Globe2",
  },
  {
    id: "ai-genai",
    slug: "ai-genai",
    label: "AI / GenAI",
    description: "AI fundamentals and GenAI-assisted testing and development.",
    icon: "Sparkles",
  },
  {
    id: "interview-preparation",
    slug: "interview-preparation",
    label: "Interview Preparation",
    description: "Technical interview questions, MCQs, and preparation guides.",
    icon: "Brain",
  },
  {
    id: "career-growth",
    slug: "career-growth",
    label: "Career Growth",
    description: "Resume, career strategy, and professional growth resources.",
    icon: "TrendingUp",
  },
];

export const libraryContentPillars: LibraryContentPillar[] = [
  {
    id: "courses",
    icon: "Video",
    title: "Courses & Videos",
    description: "Learn through structured courses and video lessons.",
    href: "/library/courses",
  },
  {
    id: "materials",
    icon: "FileText",
    title: "Study Materials",
    description: "Notes, PDFs, cheat sheets, roadmaps and useful resources.",
    href: "/library/materials",
  },
  {
    id: "practice",
    icon: "Brain",
    title: "Practice & Interview",
    description: "Interview questions, MCQs and technical preparation.",
    href: "/library/materials?category=interview-preparation",
  },
  {
    id: "community",
    icon: "Users",
    title: "Community Resources",
    description: "Useful resources and knowledge shared by learners and professionals.",
    href: "/library#contribute",
  },
];

export const libraryCourses: LibraryCourse[] = [
  {
    id: "python-for-beginners",
    slug: "python-for-beginners",
    title: "Python for Beginners",
    description:
      "A practical introduction to Python — syntax, data structures, functions, and file handling — built for job-ready fundamentals.",
    categoryId: "programming",
    difficulty: "Beginner",
    thumbnailIcon: "Code2",
    instructor: "KasarTech.ai Team",
    lessonCount: 6,
    videoCount: 6,
    resourceCount: 2,
    durationLabel: "3h 10m",
    tags: ["Python", "Fundamentals", "Scripting"],
    featured: true,
  },
  {
    id: "javascript-essentials",
    slug: "javascript-essentials",
    title: "JavaScript Essentials",
    description:
      "Core JavaScript concepts — variables, functions, async/await, and the DOM — for anyone starting in web development.",
    categoryId: "programming",
    difficulty: "Beginner",
    thumbnailIcon: "Braces",
    instructor: "KasarTech.ai Team",
    lessonCount: 5,
    videoCount: 5,
    resourceCount: 1,
    durationLabel: "2h 45m",
    tags: ["JavaScript", "Fundamentals", "Web"],
    featured: false,
  },
  {
    id: "selenium-automation-testing",
    slug: "selenium-automation-testing",
    title: "Selenium Automation Testing",
    description:
      "Build real automated test suites with Selenium WebDriver — locators, waits, page object model, and CI-friendly patterns.",
    categoryId: "automation-testing",
    difficulty: "Intermediate",
    thumbnailIcon: "TestTube2",
    instructor: "KasarTech.ai Team",
    lessonCount: 7,
    videoCount: 7,
    resourceCount: 3,
    durationLabel: "4h 20m",
    tags: ["Selenium", "Automation", "QA"],
    featured: true,
  },
  {
    id: "playwright-modern-testing",
    slug: "playwright-modern-testing",
    title: "Playwright for Modern Web Testing",
    description:
      "Modern end-to-end testing with Playwright — auto-waiting, network mocking, and cross-browser test strategy.",
    categoryId: "automation-testing",
    difficulty: "Intermediate",
    thumbnailIcon: "TestTube2",
    instructor: "KasarTech.ai Team",
    lessonCount: 5,
    videoCount: 5,
    resourceCount: 2,
    durationLabel: "3h 05m",
    tags: ["Playwright", "Automation", "E2E"],
    featured: false,
  },
  {
    id: "web-development-full-stack",
    slug: "web-development-full-stack",
    title: "Web Development — Full Stack Basics",
    description:
      "A guided path across frontend, backend, and databases — enough to build and ship a real full-stack application.",
    categoryId: "web-development",
    difficulty: "Intermediate",
    thumbnailIcon: "Globe2",
    instructor: "KasarTech.ai Team",
    lessonCount: 8,
    videoCount: 8,
    resourceCount: 3,
    durationLabel: "5h 30m",
    tags: ["Full Stack", "Web", "Backend"],
    featured: true,
  },
  {
    id: "react-for-frontend-developers",
    slug: "react-for-frontend-developers",
    title: "React for Frontend Developers",
    description:
      "Component-driven UI development with React — hooks, state, and building interfaces that scale.",
    categoryId: "web-development",
    difficulty: "Beginner",
    thumbnailIcon: "Atom",
    instructor: "KasarTech.ai Team",
    lessonCount: 6,
    videoCount: 6,
    resourceCount: 2,
    durationLabel: "3h 40m",
    tags: ["React", "Frontend", "UI"],
    featured: false,
  },
  {
    id: "ai-genai-testing-fundamentals",
    slug: "ai-genai-testing-fundamentals",
    title: "AI & GenAI Testing Fundamentals",
    description:
      "How AI and GenAI tools are changing software testing — prompt-assisted test design, LLM-based test generation, and practical limits.",
    categoryId: "ai-genai",
    difficulty: "Intermediate",
    thumbnailIcon: "Sparkles",
    instructor: "KasarTech.ai Team",
    lessonCount: 5,
    videoCount: 5,
    resourceCount: 2,
    durationLabel: "2h 55m",
    tags: ["AI", "GenAI", "Testing"],
    featured: true,
  },
  {
    id: "cracking-technical-interviews",
    slug: "cracking-technical-interviews",
    title: "Cracking Technical Interviews",
    description:
      "A structured approach to technical interviews — problem-solving patterns, communication, and common IT interview formats.",
    categoryId: "interview-preparation",
    difficulty: "Beginner",
    thumbnailIcon: "Brain",
    instructor: "KasarTech.ai Team",
    lessonCount: 6,
    videoCount: 6,
    resourceCount: 2,
    durationLabel: "3h 15m",
    tags: ["Interview", "Career", "Problem Solving"],
    featured: false,
  },
];

/** Lessons keyed by courseId — never hardcode a lesson list inside a UI component;
 * always read it through libraryRepository.getCourseLessons(). */
export const libraryLessons: LibraryLesson[] = [
  // Python for Beginners
  { id: "py-1", courseId: "python-for-beginners", order: 1, title: "Introduction to Python", durationLabel: "12:34" },
  { id: "py-2", courseId: "python-for-beginners", order: 2, title: "Variables and Data Types", durationLabel: "14:10" },
  { id: "py-3", courseId: "python-for-beginners", order: 3, title: "Control Flow and Loops", durationLabel: "16:05" },
  { id: "py-4", courseId: "python-for-beginners", order: 4, title: "Functions", durationLabel: "18:20" },
  { id: "py-5", courseId: "python-for-beginners", order: 5, title: "File Handling", durationLabel: "15:30" },
  { id: "py-6", courseId: "python-for-beginners", order: 6, title: "Mini Project", durationLabel: "22:00" },

  // JavaScript Essentials
  { id: "js-1", courseId: "javascript-essentials", order: 1, title: "JavaScript Basics", durationLabel: "13:20" },
  { id: "js-2", courseId: "javascript-essentials", order: 2, title: "Functions and Scope", durationLabel: "15:45" },
  { id: "js-3", courseId: "javascript-essentials", order: 3, title: "Working with the DOM", durationLabel: "17:10" },
  { id: "js-4", courseId: "javascript-essentials", order: 4, title: "Async / Await", durationLabel: "16:00" },
  { id: "js-5", courseId: "javascript-essentials", order: 5, title: "Mini Project", durationLabel: "20:15" },

  // Selenium Automation Testing
  { id: "sel-1", courseId: "selenium-automation-testing", order: 1, title: "Setting Up Selenium WebDriver", durationLabel: "14:00" },
  { id: "sel-2", courseId: "selenium-automation-testing", order: 2, title: "Locators and Element Interaction", durationLabel: "18:30" },
  { id: "sel-3", courseId: "selenium-automation-testing", order: 3, title: "Waits and Synchronization", durationLabel: "16:45" },
  { id: "sel-4", courseId: "selenium-automation-testing", order: 4, title: "Page Object Model", durationLabel: "20:10" },
  { id: "sel-5", courseId: "selenium-automation-testing", order: 5, title: "Handling Forms and Alerts", durationLabel: "15:20" },
  { id: "sel-6", courseId: "selenium-automation-testing", order: 6, title: "Running Tests in CI", durationLabel: "19:00" },
  { id: "sel-7", courseId: "selenium-automation-testing", order: 7, title: "Capstone Project", durationLabel: "25:00" },

  // Playwright for Modern Web Testing
  { id: "pw-1", courseId: "playwright-modern-testing", order: 1, title: "Why Playwright", durationLabel: "10:15" },
  { id: "pw-2", courseId: "playwright-modern-testing", order: 2, title: "Auto-Waiting and Selectors", durationLabel: "15:40" },
  { id: "pw-3", courseId: "playwright-modern-testing", order: 3, title: "Network Mocking", durationLabel: "17:25" },
  { id: "pw-4", courseId: "playwright-modern-testing", order: 4, title: "Cross-Browser Testing", durationLabel: "14:50" },
  { id: "pw-5", courseId: "playwright-modern-testing", order: 5, title: "Capstone Project", durationLabel: "22:10" },

  // Web Development — Full Stack Basics
  { id: "web-1", courseId: "web-development-full-stack", order: 1, title: "How the Web Works", durationLabel: "11:20" },
  { id: "web-2", courseId: "web-development-full-stack", order: 2, title: "HTML & CSS Foundations", durationLabel: "18:00" },
  { id: "web-3", courseId: "web-development-full-stack", order: 3, title: "JavaScript in the Browser", durationLabel: "16:30" },
  { id: "web-4", courseId: "web-development-full-stack", order: 4, title: "Building a REST API", durationLabel: "20:15" },
  { id: "web-5", courseId: "web-development-full-stack", order: 5, title: "Connecting a Database", durationLabel: "19:45" },
  { id: "web-6", courseId: "web-development-full-stack", order: 6, title: "Authentication Basics", durationLabel: "17:10" },
  { id: "web-7", courseId: "web-development-full-stack", order: 7, title: "Deploying Your App", durationLabel: "14:20" },
  { id: "web-8", courseId: "web-development-full-stack", order: 8, title: "Capstone Project", durationLabel: "28:00" },

  // React for Frontend Developers
  { id: "react-1", courseId: "react-for-frontend-developers", order: 1, title: "Components and Props", durationLabel: "14:15" },
  { id: "react-2", courseId: "react-for-frontend-developers", order: 2, title: "State and Events", durationLabel: "16:20" },
  { id: "react-3", courseId: "react-for-frontend-developers", order: 3, title: "Hooks in Depth", durationLabel: "18:40" },
  { id: "react-4", courseId: "react-for-frontend-developers", order: 4, title: "Forms and Validation", durationLabel: "15:10" },
  { id: "react-5", courseId: "react-for-frontend-developers", order: 5, title: "Fetching Data", durationLabel: "17:00" },
  { id: "react-6", courseId: "react-for-frontend-developers", order: 6, title: "Capstone Project", durationLabel: "23:30" },

  // AI & GenAI Testing Fundamentals
  { id: "ai-1", courseId: "ai-genai-testing-fundamentals", order: 1, title: "How GenAI Changes Testing", durationLabel: "13:00" },
  { id: "ai-2", courseId: "ai-genai-testing-fundamentals", order: 2, title: "Prompt-Assisted Test Design", durationLabel: "15:25" },
  { id: "ai-3", courseId: "ai-genai-testing-fundamentals", order: 3, title: "LLM-Based Test Generation", durationLabel: "16:50" },
  { id: "ai-4", courseId: "ai-genai-testing-fundamentals", order: 4, title: "Practical Limits and Risks", durationLabel: "14:10" },
  { id: "ai-5", courseId: "ai-genai-testing-fundamentals", order: 5, title: "Capstone Exercise", durationLabel: "18:45" },

  // Cracking Technical Interviews
  { id: "int-1", courseId: "cracking-technical-interviews", order: 1, title: "Interview Formats Explained", durationLabel: "12:10" },
  { id: "int-2", courseId: "cracking-technical-interviews", order: 2, title: "Problem-Solving Patterns", durationLabel: "17:35" },
  { id: "int-3", courseId: "cracking-technical-interviews", order: 3, title: "Communicating Your Thinking", durationLabel: "14:50" },
  { id: "int-4", courseId: "cracking-technical-interviews", order: 4, title: "Behavioral Questions", durationLabel: "13:20" },
  { id: "int-5", courseId: "cracking-technical-interviews", order: 5, title: "Mock Interview Walkthrough", durationLabel: "20:00" },
  { id: "int-6", courseId: "cracking-technical-interviews", order: 6, title: "Final Checklist", durationLabel: "9:40" },
];

/** filePath is intentionally null for every entry — no real PDF assets exist for the
 * Library yet. UI must render a "Preview coming soon" state instead of a download
 * link. See docs/LEARNING-LIBRARY.md §Demo content and §Anti-fabrication rule. */
export const libraryResources: LibraryResource[] = [
  {
    id: "python-interview-questions",
    title: "Python Interview Questions",
    description: "A curated set of commonly asked Python interview questions with concise explanations.",
    categoryId: "interview-preparation",
    type: "Question Bank",
    thumbnailIcon: "FileText",
    pageCount: 24,
    tags: ["Python", "Interview"],
    author: "KasarTech.ai Team",
    featured: true,
    filePath: null,
  },
  {
    id: "selenium-automation-cheat-sheet",
    title: "Selenium Automation Cheat Sheet",
    description: "Quick-reference commands and patterns for Selenium WebDriver automation.",
    categoryId: "automation-testing",
    type: "Cheat Sheet",
    thumbnailIcon: "TestTube2",
    pageCount: 8,
    tags: ["Selenium", "Automation"],
    author: "KasarTech.ai Team",
    featured: true,
    filePath: null,
  },
  {
    id: "playwright-testing-guide",
    title: "Playwright Testing Guide",
    description: "A practical guide to setting up and structuring Playwright end-to-end tests.",
    categoryId: "automation-testing",
    type: "Guide",
    thumbnailIcon: "TestTube2",
    pageCount: 18,
    tags: ["Playwright", "Automation"],
    author: "KasarTech.ai Team",
    featured: false,
    filePath: null,
  },
  {
    id: "api-testing-notes",
    title: "API Testing Notes",
    description: "Core concepts and checklists for functional and contract API testing.",
    categoryId: "automation-testing",
    type: "Guide",
    thumbnailIcon: "FileText",
    pageCount: 15,
    tags: ["API Testing", "QA"],
    author: "KasarTech.ai Team",
    featured: false,
    filePath: null,
  },
  {
    id: "genai-testing-roadmap",
    title: "GenAI Testing Roadmap",
    description: "A step-by-step roadmap for learning AI-assisted and GenAI-based testing skills.",
    categoryId: "ai-genai",
    type: "Roadmap",
    thumbnailIcon: "Sparkles",
    pageCount: 6,
    tags: ["AI", "GenAI", "Roadmap"],
    author: "KasarTech.ai Team",
    featured: true,
    filePath: null,
  },
  {
    id: "qa-automation-roadmap",
    title: "QA Automation Roadmap",
    description: "A structured learning path from manual testing fundamentals to full automation.",
    categoryId: "automation-testing",
    type: "Roadmap",
    thumbnailIcon: "TestTube2",
    pageCount: 6,
    tags: ["QA", "Automation", "Roadmap"],
    author: "KasarTech.ai Team",
    featured: false,
    filePath: null,
  },
  {
    id: "sql-interview-preparation",
    title: "SQL Interview Preparation",
    description: "Frequently asked SQL interview questions covering joins, indexing, and query optimization.",
    categoryId: "interview-preparation",
    type: "Question Bank",
    thumbnailIcon: "FileText",
    pageCount: 20,
    tags: ["SQL", "Interview"],
    author: "KasarTech.ai Team",
    featured: false,
    filePath: null,
  },
  {
    id: "resume-career-guide",
    title: "Resume & Career Guide",
    description: "Practical guidance on structuring a resume and planning career growth in IT roles.",
    categoryId: "career-growth",
    type: "Guide",
    thumbnailIcon: "TrendingUp",
    pageCount: 12,
    tags: ["Resume", "Career"],
    author: "KasarTech.ai Team",
    featured: true,
    filePath: null,
  },
];
