import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  Wallet,
  Landmark,
  Code2,
  School,
  HeartPulse,
  QrCode,
  Boxes,
  Users,
  MessageSquareText,
} from "lucide-react";

export type ProductStatus = "live" | "coming-soon";

export interface ProductDemo {
  /** Preferred format, smallest file size, best browser support. */
  webm?: string;
  mp4?: string;
  gif?: string;
  /** Screenshot thumbnails; clicking one changes the preview. Real assets only — omit if none exist yet. */
  screenshots?: string[];
}

export interface EcosystemProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind-safe hex used for this product's accent gradient/glow. */
  accentFrom: string;
  accentTo: string;
  status: ProductStatus;
  liveUrl?: string;
  learnMoreUrl?: string;
  demo?: ProductDemo;
  features: string[];
  technologies?: string[];
  /** Renders a live, real UI preview built from this app's own components instead of a static image. */
  useLivePreview?: boolean;
}

export interface RoadmapProduct {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

/**
 * The single source of truth for the KasarTech Ecosystem component.
 * To add a new live product, add one object here — no component code
 * needs to change. This file is intentionally the only thing that
 * differs when this component is copied into another KasarTech app.
 */
export const ecosystemProducts: EcosystemProduct[] = [
  {
    id: "studycart",
    name: "StudyCart",
    tagline: "AI Exam Response Analyzer",
    description:
      "Upload your response sheet and get an instant, accurate breakdown of your score, accuracy, and subject-wise performance.",
    icon: GraduationCap,
    accentFrom: "#2563eb",
    accentTo: "#22d3ee",
    status: "live",
    liveUrl: "/analyzer",
    learnMoreUrl: "/about",
    features: [
      "Real response-sheet parsing",
      "Subject-wise breakdown",
      "Detailed question analysis",
      "Downloadable PDF report",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    useLivePreview: true,
  },
  {
    id: "ledger",
    name: "Ledger",
    tagline: "Personal Finance Tracker",
    description: "Track expenses, manage budgets, and build healthy financial habits with clear, simple analytics.",
    icon: Wallet,
    accentFrom: "#16a34a",
    accentTo: "#4ade80",
    status: "coming-soon",
    features: ["Expense tracking", "Budget planning", "Smart reports", "Goal tracking"],
  },
  {
    id: "loan-sivam",
    name: "Loan SIVAM",
    tagline: "Loan & EMI Management",
    description: "Manage loans, track EMIs, and stay on top of your financial commitments in one place.",
    icon: Landmark,
    accentFrom: "#7c3aed",
    accentTo: "#c084fc",
    status: "coming-soon",
    features: ["EMI calendar", "Loan dashboard", "Statement analysis", "Payment reminders"],
  },
];

/** The parent company entry — shown alongside products, styled distinctly (not a product card). */
export const kasarTechCompany = {
  name: "KasarTech.ai",
  tagline: "Technology & Solutions",
  description: "The technology company building every product in this ecosystem.",
  icon: Code2,
  accentFrom: "#2563eb",
  accentTo: "#818cf8",
  learnMoreUrl: "/about",
  pillars: [
    { label: "AI Solutions", icon: Code2 },
    { label: "Web Development", icon: Boxes },
    { label: "Product Design", icon: Users },
    { label: "Cloud Services", icon: MessageSquareText },
  ],
};

/** Future products — shown as a roadmap, never claimed as live. */
export const roadmapProducts: RoadmapProduct[] = [
  { id: "school-erp", name: "School ERP", description: "Complete school management solution", icon: School },
  {
    id: "hospital-management",
    name: "Hospital Management",
    description: "Smart healthcare management system",
    icon: HeartPulse,
  },
  { id: "restaurant-qr", name: "Restaurant QR", description: "QR menu, ordering & restaurant management", icon: QrCode },
  { id: "inventory", name: "Inventory System", description: "Smart inventory & stock management", icon: Boxes },
  { id: "hrms", name: "HRMS", description: "Human resource management system", icon: Users },
  { id: "ai-chatbot", name: "AI Chatbot", description: "Intelligent chatbot for business automation", icon: MessageSquareText },
];
