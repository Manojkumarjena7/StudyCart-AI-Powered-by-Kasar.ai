/**
 * "Support StudyCart" donation link. Config-driven — never hardcode a payment URL or
 * QR code. Unset until a real Paytm link is provided; the UI renders disabled/"coming
 * soon" until then. See docs/RESUME-ENHANCEMENT.md §Support StudyCart.
 */
export function getSupportPaytmUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPPORT_PAYTM_URL || null;
}
