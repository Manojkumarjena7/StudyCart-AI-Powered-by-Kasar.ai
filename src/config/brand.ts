export const brandConfig = {
  // Site-wide primary brand identity (navbar, footer, browser tab, root metadata).
  // Kept separate from productName/productShortName below, which remain "StudyCart"
  // — the specific product name still used by the analyzer's generated PDF reports
  // (src/features/reports/reportGenerator.ts), the ranking disclaimer, and the About
  // page's origin story. Renaming those would silently change protected business-logic
  // output and make the About page's own "platform vs. first product" narrative
  // incoherent. See docs/DESIGN-SYSTEM.md §Brand identity.
  siteName: "KasarTech.ai",
  sitePositioning: "AI Interview Support",

  productName: "StudyCart",
  productShortName: "StudyCart",
  productIdentity: "StudyCart AI Interview Support",

  productDescription:
    "AI-powered IT interview and career support platform — resume enhancement, a curated learning library, IT job listings with referral support, and interview tracking via Interview Management. Also home to a dedicated Government Job Platform for exam preparation.",

  tagline:
    "Your AI-Powered IT Interview & Career Support",

  parentCompanyName: "Kasar.ai",
  parentCompanyUrl: "https://kasar.ai",
  endorsementText: "Powered by Kasar.ai",

  location: {
    city: "Bhubaneswar",
    state: "Odisha",
    country: "India",
    display: "Bhubaneswar, Odisha, India",
    headOffice: "Bengaluru, Karnataka, India",
    otherOffices: ["Gurugram, Haryana, India", "Bhubaneswar, Odisha, India"],
  },

  kasartechAboutDescription:
    "KasarTech.ai is a technology startup building practical software products and AI-powered tools for students, professionals, and businesses. We focus on simple, useful solutions that make everyday work and career growth easier.",

  studycartFooterDescription:
    "KasarTech.ai is a technology startup building practical software products and AI-powered tools. StudyCart is our learning and career support platform, built to help students and job seekers with practical resources, career tools, and opportunities.",

  socialLinks: {
    telegram: "https://t.me/studycartAI",
    instagram: "https://instagram.com/kasartech",
    linkedin: "https://linkedin.com/company/kasartech",
  },

  contact: {
    supportEmail: "studycartkasar@gmail.com",
  },

  copyrightYear: 2024,
} as const;