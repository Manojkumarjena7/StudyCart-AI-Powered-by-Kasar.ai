import Link from "next/link";
import Image from "next/image";
import { footerCommunityLinks, footerLegalNav } from "@/config/navigation";
import { platformPillars } from "@/config/platform";
import { brandConfig } from "@/config/brand";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/brand/logo/kasartech-symbol.svg"
                alt={brandConfig.siteName}
                width={28}
                height={26}
                className="h-8 w-auto"
              />
              <span className="font-semibold text-text-primary">{brandConfig.siteName}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-secondary">
              {brandConfig.tagline}
            </p>
            <p className="mt-2 text-xs text-text-secondary">{brandConfig.location.display}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="focus-ring rounded text-sm text-text-secondary transition-colors hover:text-brand-cyan-light"
                >
                  Home
                </Link>
              </li>
              {platformPillars
                .filter((pillar) => pillar.domain !== "interview-support")
                .map((pillar) => (
                  <li key={pillar.id}>
                    <Link
                      href={pillar.href}
                      className="focus-ring rounded text-sm text-text-secondary transition-colors hover:text-brand-cyan-light"
                    >
                      {pillar.title}
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
          © {brandConfig.copyrightYear} {brandConfig.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
