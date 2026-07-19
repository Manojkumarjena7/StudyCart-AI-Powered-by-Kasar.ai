"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

interface PageNavProps {
  /** Shown as a "back" action — uses browser history so back navigation feels natural. */
  showBrowserBack?: boolean;
  /** Optional explicit "back to X" link, e.g. back to the result from detailed analysis. */
  backHref?: string;
  backLabel?: string;
}

export function PageNav({ showBrowserBack = true, backHref, backLabel }: PageNavProps) {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {showBrowserBack && (
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}
      {backHref && (
        <Link href={backHref}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            {backLabel ?? "Back"}
          </Button>
        </Link>
      )}
      <Link href="/analyzer">
        <Button variant="ghost" size="sm">
          <RotateCcw className="h-4 w-4" />
          Analyze Another Result
        </Button>
      </Link>
      <Link href="/">
        <Button variant="ghost" size="sm">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>
    </div>
  );
}
