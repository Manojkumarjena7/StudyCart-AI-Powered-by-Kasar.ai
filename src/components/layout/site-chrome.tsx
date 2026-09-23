"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SupportFab } from "@/components/shared/support-fab";

/** Route prefixes that are a dedicated application workspace, not a marketing
 * page — the global site chrome (Navbar/Footer/SupportFab) would fight the
 * "professional SaaS app" feel a workspace needs (no normal website footer, no
 * marketing nav). Each such workspace renders its own minimal, purpose-specific
 * header instead — see resume-workspace-header.tsx for the Resume Builder's.
 * See docs/RESUME-ENHANCEMENT.md §Resume Builder — Phase 5b. */
const WORKSPACE_ROUTE_PREFIXES = ["/resume/build"];

function isWorkspaceRoute(pathname: string): boolean {
  return WORKSPACE_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Wraps the app's global chrome so a small set of full-screen workspace routes
 * can opt out of it without a second root layout (route groups with separate
 * root layouts would be a much larger, riskier restructuring of every existing
 * route for one screen's benefit). Every other route's Navbar/Footer/SupportFab
 * behavior is unchanged.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorkspace = isWorkspaceRoute(pathname ?? "");

  if (isWorkspace) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <SupportFab />
    </>
  );
}
