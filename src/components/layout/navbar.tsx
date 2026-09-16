"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Send } from "lucide-react";
import { platformPillars } from "@/config/platform";
import { footerLegalNav } from "@/config/navigation";
import { brandConfig } from "@/config/brand";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { PillarIcon } from "@/components/shared/pillar-icon";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils/cn";
import { getInterviewManagementUrl } from "@/lib/utils/interview-management";
import { LayoutGroup, motion } from "framer-motion";

const interviewManagementUrl = getInterviewManagementUrl();

interface ResolvedNavItem {
  key: string;
  label: string;
  href: string;
  external: boolean;
  disabled: boolean;
  icon: string;
}

function useNavItems(): ResolvedNavItem[] {
  return platformPillars.map((pillar) => {
    if (pillar.domain === "interview-support") {
      return {
        key: pillar.id,
        label: pillar.navLabel,
        href: interviewManagementUrl ?? "#",
        external: true,
        disabled: !interviewManagementUrl,
        icon: pillar.icon,
      };
    }
    return {
      key: pillar.id,
      label: pillar.navLabel,
      href: pillar.href,
      external: Boolean(pillar.external),
      disabled: false,
      icon: pillar.icon,
    };
  });
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navItems = useNavItems();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-md">
          <Image
            src="/brand/logo/kasartech-symbol.svg"
            alt={brandConfig.siteName}
            width={28}
            height={26}
            className="h-8 w-auto"
            priority
          />
          <span className="hidden text-sm font-semibold text-text-primary sm:inline sm:text-base">
            {brandConfig.siteName}
          </span>
        </Link>

        <LayoutGroup>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = !item.external && pathname === item.href;

              const content = (
                <>
                  {active && (
                    <motion.div
                      layoutId="navbar-active-chip"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="absolute inset-0 -z-10 rounded-lg bg-brand-blue/10"
                    />
                  )}
                  <PillarIcon
                    name={item.icon}
                    className={cn(
                      "relative z-10 h-3.5 w-3.5 transition-colors duration-200",
                      active
                        ? "text-brand-blue"
                        : "text-text-secondary group-hover:text-text-primary"
                    )}
                  />
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      active
                        ? "font-semibold text-brand-blue"
                        : "text-text-secondary group-hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </span>
                  {item.disabled && (
                    <Badge variant="neutral" className="relative z-10 px-2 py-0.5 text-[10px]">
                      Soon
                    </Badge>
                  )}
                </>
              );

              const className = cn(
                "group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                item.disabled && "cursor-not-allowed opacity-50"
              );

              if (item.disabled) {
                return (
                  <span key={item.key} aria-disabled="true" title="Coming soon" className={className}>
                    {content}
                  </span>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={brandConfig.socialLinks.telegram}
            target="_blank"
            rel="noreferrer"
            aria-label="StudyCart on Telegram"
            title="Telegram"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-overlay-soft hover:text-text-primary"
          >
            <Send className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <Link href="/resume">
            <Button variant="gradient" size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            className="focus-ring rounded-lg p-2 text-text-primary"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border-subtle bg-bg-primary px-4 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.disabled ? (
                <span
                  key={item.key}
                  aria-disabled="true"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary opacity-50"
                >
                  <PillarIcon name={item.icon} className="h-4 w-4" />
                  {item.label}
                  <Badge variant="neutral" className="px-2 py-0.5 text-[10px]">
                    Soon
                  </Badge>
                </span>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
                >
                  <PillarIcon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            )}
            <div className="my-2 border-t border-border-subtle" />
            {footerLegalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={brandConfig.socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-overlay-soft hover:text-text-primary"
            >
              <Send className="h-4 w-4" /> Telegram
            </Link>
            <Link href="/resume" onClick={() => setOpen(false)} className="mt-2">
              <Button variant="gradient" className="w-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
