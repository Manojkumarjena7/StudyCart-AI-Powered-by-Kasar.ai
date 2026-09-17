/**
 * "Support StudyCart" donation link. Config-driven — never hardcode a payment URL or
 * QR code. Unset until a real Paytm link is provided; the UI renders disabled/"coming
 * soon" until then. See docs/RESUME-ENHANCEMENT.md §Support StudyCart.
 */
export function getSupportPaytmUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPPORT_PAYTM_URL || null;
}

/**
 * Real Paytm QR code image for the support modals (see support-modal.tsx). The QR
 * pattern itself is never generated, recreated, or altered — `public/support/paytm-qr.png`
 * is a lossless crop of the real, supplied QR image (only the surrounding personal-name
 * header and promotional banner were cropped away; the QR/logo/UPI-ID/badges region is
 * pixel-identical to the source). Overridable via NEXT_PUBLIC_SUPPORT_QR_IMAGE if the
 * asset ever needs to change.
 */
export function getSupportQrImageSrc(): string | null {
  return process.env.NEXT_PUBLIC_SUPPORT_QR_IMAGE || "/support/paytm-qr.png";
}
