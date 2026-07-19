import { lookup as dnsLookup } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { isIP } from "node:net";
import { ParserError } from "./errors";

/**
 * Server-side fetcher for student-submitted response-sheet URLs.
 *
 * This is NOT a general-purpose URL fetcher. It exists specifically to
 * retrieve a single public HTML page and is deliberately restricted to
 * prevent SSRF:
 *   - only http/https, only GET
 *   - hostname (and every redirect hop's hostname) must resolve to a
 *     public, non-private, non-loopback, non-link-local IP address
 *   - the TCP connection is pinned to the IP address that was actually
 *     validated (prevents DNS-rebinding TOCTOU attacks)
 *   - bounded timeout, bounded response size, bounded redirect count
 *   - final destination is re-validated after every redirect
 */

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 MB is generous for an HTML response sheet
const USER_AGENT = "KaSarTech-AnswerKeyAnalyzer/1.0 (+https://kasartech.example/bot)";

export interface SafeFetchResult {
  html: string;
  finalUrl: string;
  contentType: string | null;
}

function isPrivateOrReservedIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;

  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // loopback
  if (a === 0) return true; // "this" network
  if (a === 169 && b === 254) return true; // link-local / cloud metadata (169.254.169.254)
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
  if (a >= 224) return true; // multicast/reserved (224.0.0.0+)
  return false;
}

function isPrivateOrReservedIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true; // loopback
  if (normalized === "::") return true;
  if (normalized.startsWith("fe80")) return true; // link-local
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // unique local (fc00::/7)
  if (normalized.startsWith("::ffff:")) {
    // IPv4-mapped IPv6 address — validate the embedded IPv4 address too.
    const ipv4Part = normalized.split(":").pop();
    if (ipv4Part && isIP(ipv4Part) === 4) return isPrivateOrReservedIPv4(ipv4Part);
  }
  return false;
}

function isPrivateOrReservedIP(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateOrReservedIPv4(ip);
  if (version === 6) return isPrivateOrReservedIPv6(ip);
  return true; // not a recognizable IP — treat as unsafe
}

const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "metadata.google.internal"]);

function validateUrlFormat(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new ParserError("INVALID_URL", "That doesn't look like a valid response sheet URL. Please check the link and try again.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ParserError("INVALID_URL", "Only http:// and https:// links are supported.");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
  }

  return parsed;
}

async function resolveAndValidateHost(hostname: string): Promise<string> {
  // If the hostname is already a literal IP, validate it directly.
  if (isIP(hostname)) {
    if (isPrivateOrReservedIP(hostname)) {
      throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
    }
    return hostname;
  }

  let resolved: { address: string };
  try {
    resolved = await dnsLookup(hostname, { family: 0 });
  } catch {
    throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
  }

  if (isPrivateOrReservedIP(resolved.address)) {
    throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
  }

  return resolved.address;
}

interface RawFetchResponse {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

function fetchOnce(targetUrl: URL, pinnedIp: string, signal: AbortSignal): Promise<RawFetchResponse> {
  return new Promise((resolve, reject) => {
    const transport = targetUrl.protocol === "https:" ? https : http;

    const req = transport.request(
      {
        // Connect directly to the pre-validated IP (prevents DNS rebinding),
        // while still sending the correct Host header / TLS SNI.
        host: pinnedIp,
        port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
        path: `${targetUrl.pathname}${targetUrl.search}`,
        method: "GET",
        headers: {
          Host: targetUrl.hostname,
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
        },
        servername: targetUrl.protocol === "https:" ? targetUrl.hostname : undefined,
        signal,
      },
      (res) => {
        let totalBytes = 0;
        const chunks: Buffer[] = [];

        res.on("data", (chunk: Buffer) => {
          totalBytes += chunk.length;
          if (totalBytes > MAX_RESPONSE_BYTES) {
            res.destroy();
            reject(new ParserError("RESPONSE_TOO_LARGE", "That response sheet page is larger than we can safely process."));
            return;
          }
          chunks.push(chunk);
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf-8"),
          });
        });

        res.on("error", (err) => reject(err));
      }
    );

    req.on("error", (err: NodeJS.ErrnoException) => {
      if (err.name === "AbortError") {
        reject(new ParserError("REQUEST_TIMEOUT", "The response sheet took too long to load. Please try again in a moment."));
      } else {
        reject(new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL."));
      }
    });

    req.end();
  });
}

/**
 * Safely fetches a student-submitted response-sheet URL, following
 * redirects manually so each hop can be independently validated.
 */
export async function safeFetchResponseSheet(rawUrl: string): Promise<SafeFetchResult> {
  let currentUrl = validateUrlFormat(rawUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
      const pinnedIp = await resolveAndValidateHost(currentUrl.hostname);
      const response = await fetchOnce(currentUrl, pinnedIp, controller.signal);

      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        currentUrl = new URL(response.headers.location, currentUrl);
        if (currentUrl.protocol !== "http:" && currentUrl.protocol !== "https:") {
          throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
        }
        if (BLOCKED_HOSTNAMES.has(currentUrl.hostname.toLowerCase())) {
          throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
        }
        continue;
      }

      if (response.statusCode === 404 || response.statusCode === 410) {
        throw new ParserError("EXPIRED_RESPONSE_SHEET", "This response sheet link appears to have expired or is no longer available.");
      }
      if (response.statusCode === 401 || response.statusCode === 403) {
        throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
      }
      if (response.statusCode >= 400) {
        throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
      }

      const contentType = (response.headers["content-type"] as string | undefined) ?? null;
      if (contentType && !/text\/html|application\/xhtml/i.test(contentType)) {
        throw new ParserError("UNEXPECTED_CONTENT_TYPE", "That link didn't return a response sheet page we can read.");
      }

      if (!response.body || response.body.trim().length === 0) {
        throw new ParserError("EMPTY_RESPONSE", "The response sheet page returned no content. Please check the link and try again.");
      }

      return { html: response.body, finalUrl: currentUrl.toString(), contentType };
    }

    throw new ParserError("ACCESS_DENIED", "We couldn't access that link. Please make sure it's a public response sheet URL.");
  } finally {
    clearTimeout(timeout);
  }
}

// Exported for unit testing without performing real network/DNS calls.
export function isPrivateOrReservedIPAddress(ip: string): boolean {
  return isPrivateOrReservedIP(ip);
}

export function validateResponseSheetUrlFormat(rawUrl: string): URL {
  return validateUrlFormat(rawUrl);
}
