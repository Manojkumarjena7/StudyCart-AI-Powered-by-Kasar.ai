import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { footerExploreNav, footerCommunityLinks, footerLegalNav } from "@/config/navigation";
import { brandConfig } from "@/config/brand";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan-light">
                <GraduationCap className="h-4.5 w-4.5 text-white" />
              </span>
              <span className="font-semibold text-text-primary">{brandConfig.productShortName}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-secondary">
              Building smarter digital solutions for students.
            </p>
            <p className="mt-2 text-xs text-text-secondary">
              {brandConfig.endorsementText} · {brandConfig.location.display}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {footerExploreNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring rounded text-sm text-text-secondary transition-colors hover:text-brand-cyan-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">Community</h4>
            <ul className="mt-4 space-y-2.5">
              {footerCommunityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={brandConfig.socialLinks[link.key]}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring rounded text-sm text-text-secondary transition-colors hover:text-brand-cyan-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">Legal</h4>
            <ul className="mt-4 space-y-2.5">
              {footerLegalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="focus-ring rounded text-sm text-text-secondary transition-colors hover:text-brand-cyan-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border-subtle pt-6 text-xs text-text-secondary">
          © {brandConfig.copyrightYear} {brandConfig.productShortName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
