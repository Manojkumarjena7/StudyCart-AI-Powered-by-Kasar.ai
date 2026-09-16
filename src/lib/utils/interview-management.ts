/**
 * Interview Management has no internal route — this is the one place that resolves
 * its URL from the environment. Never hardcode a production URL. See
 * docs/INTERVIEW-MANAGEMENT.md.
 */
export function getInterviewManagementUrl(): string | null {
  return process.env.NEXT_PUBLIC_INTERVIEW_MANAGEMENT_URL || null;
}
