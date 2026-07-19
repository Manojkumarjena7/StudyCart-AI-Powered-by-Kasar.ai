/**
 * Centralized brand configuration.
 *
 * The student platform is an independent product with its own identity —
 * KaSarTech.AI is the parent technology company, referenced only via a
 * subtle endorsement ("by KaSarTech.AI"), never as the primary product
 * name throughout the UI.
 *
 * `productName` is intentionally a placeholder until the final,
 * independent student-platform brand name is chosen. Changing the
 * product's name platform-wide only requires editing this one file —
 * no component should ever hardcode the product name directly.
 */
export const brandConfig = {
  // TODO: replace with the final independent student-platform brand name.
  productName: "KaSar Exam Analyzer",
  productShortName: "Exam Analyzer",
  productDescription:
    "Upload your answer key PDF or paste your response sheet link to instantly calculate your score, accuracy, negative marks, subject performance, and community rank.",
  tagline: "Know Your Score. Understand Your Performance.",

  parentCompanyName: "KaSarTech.AI",
  // TODO: replace with the live KaSarTech.AI website URL once available.
  parentCompanyUrl: "https://kasartech.ai",
  endorsementText: "by KaSarTech.AI",

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
    supportEmail: "support@kasartech.ai",
  },

  copyrightYear: 2026,
} as const;
