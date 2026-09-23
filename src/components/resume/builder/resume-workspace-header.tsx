import Link from "next/link";
import Image from "next/image";
import { brandConfig } from "@/config/brand";

/**
 * The Resume Builder's own lightweight header — replaces the global site
 * Navbar on /resume/build (see site-chrome.tsx). A workspace needs to feel like
 * a dedicated application, not a marketing page with a full pillar nav, theme
 * toggle, and "Get Started" CTA competing for attention. See
 * docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b.
 */
export function ResumeWorkspaceHeader() {
  return (
    <header className="border-b border-border-subtle bg-bg-primary">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/resume" className="focus-ring flex items-center gap-2 rounded-md">
          <Image
            src="/brand/logo/kasartech-symbol.svg"
            alt={brandConfig.siteName}
            width={22}
            height={20}
            className="h-6 w-auto"
          />
          <span className="text-sm font-semibold text-text-primary">{brandConfig.siteName} Resume</span>
        </Link>
        <Link
          href="/resume"
          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:text-brand-cyan-light"
        >
          Exit to Resume home
        </Link>
      </div>
    </header>
  );
}
