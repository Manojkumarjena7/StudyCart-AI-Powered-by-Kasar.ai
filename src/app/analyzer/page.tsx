import type { Metadata } from "next";
import { AnalyzerForm } from "@/components/analyzer/analyzer-form";
import { brandConfig } from "@/config/brand";

export const metadata: Metadata = {
  title: `Analyzer — ${brandConfig.productName}`,
};

export default function AnalyzerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">
          Analyze My Result
        </h1>
        <p className="mt-2 text-text-secondary">
          {brandConfig.tagline}
        </p>
      </div>
      <AnalyzerForm />
    </div>
  );
}
