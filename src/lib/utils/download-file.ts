/**
 * Triggers a same-origin file download without navigating the page — used after the
 * optional support prompt so the actual download always fires regardless of which
 * button the user picks. Plain `<a download>` click, same as the browser's native
 * download affordance; no new capability, no server round trip.
 */
export function downloadFile(url: string, filename?: string) {
  const link = document.createElement("a");
  link.href = url;
  if (filename) link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
