/**
 * Centralized brand configuration.
 *
 * The student platform is an independent product ("StudyCart") with its
 * own identity — Kasar.ai is the parent technology company, referenced
 * only via a subtle endorsement ("Powered by Kasar.ai"), never as the
 * primary product name throughout the UI.
 *
 * Changing the product's name platform-wide only requires editing this
 * one file — no component should ever hardcode the product name
 * directly.
 */
export const brandConfig = {
  productName: "StudyCart",
  productShortName: "StudyCart",
  productDescription:
    "Upload your answer key PDF or paste your response sheet link to instantly calculate your score, accuracy, negative marks, subject performance, and community rank.",
  tagline: "Know Your Score. Understand Your Performance.",

  parentCompanyName: "Kasar.ai",
  // TODO: replace with the live Kasar.ai website URL once available.
  parentCompanyUrl: "https://kasar.ai",
  endorsementText: "Powered by Kasar.ai",

  location: {
    city: "Bhubaneswar",
    state: "Odisha",
    country: "India",
    display: "Bhubaneswar, Odisha, India",
  },

  socialLinks: {
    telegram: "https://t.me/kasartech",
    instagram: "https://instagram.com/kasartech",
    linkedin: "https://linkedin.com/company/kasartech",
  },

  contact: {
    // TODO: replace with a live, monitored support inbox.
    supportEmail: "support@kasar.ai",
  },

  copyrightYear: 2026,
} as const;
