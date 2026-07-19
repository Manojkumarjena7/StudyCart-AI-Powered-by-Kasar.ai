import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { brandConfig } from "@/config/brand";

export function BrandStory() {
  return (
    <section className="bg-bg-secondary/50 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">
          Built from a real exam-prep problem
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          Students often need multiple websites and tools just to calculate their score and
          understand a response sheet. {brandConfig.productName} started as a way to simplify
          that — one place to get a clear, accurate picture of your performance.
        </p>
        <Link href="/about" className="mt-6 inline-block">
          <Button variant="outline">
            Read our story
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
