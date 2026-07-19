import type { Metadata } from "next";
import { BookOpen, Briefcase, GraduationCap, LineChart, Users2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { brandConfig } from "@/config/brand";

export const metadata: Metadata = {
  title: `About — ${brandConfig.productName}`,
  description: `The story behind ${brandConfig.productName}, ${brandConfig.endorsementText}.`,
};

const futureServices = [
  { icon: BookOpen, label: "Books & Study Materials" },
  { icon: FileText, label: "Digital PDFs & Learning Resources" },
  { icon: GraduationCap, label: "Courses" },
  { icon: Users2, label: "Tuition & Coaching Discovery" },
  { icon: Briefcase, label: "Government & Private Job Information" },
  { icon: LineChart, label: "Useful Digital Student Services" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <Badge variant="trending">ABOUT</Badge>
        <h1 className="mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">
          Why {brandConfig.productName} exists
        </h1>
        <p className="mt-3 text-text-secondary">{brandConfig.endorsementText}</p>
      </div>

      <Card>
        <CardContent className="space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <p>
            {brandConfig.productName} was inspired by a real problem experienced during competitive
            exam preparation: after an exam, students often need to visit multiple websites and use
            multiple tools just to calculate their score, understand their response sheet, and make
            sense of their performance.
          </p>
          <p>
            Our goal is to make that process simpler — one place to paste a response-sheet link or
            upload a PDF, and get a clear, accurate breakdown of your score, accuracy, and
            subject-wise performance, without having to piece it together yourself.
          </p>
          <p>
            {brandConfig.productShortName} is the first product being built on this platform. It is
            being developed and improved step by step, starting with real response-sheet parsing
            rather than shortcuts.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-center text-lg font-semibold text-text-primary">
          What&apos;s next for the platform
        </h2>
        <p className="mb-6 text-center text-sm text-text-secondary">
          Beyond exam analysis, the long-term vision is a broader set of useful student services.
          None of these are live yet — they are shown here so you know what&apos;s coming.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {futureServices.map((service) => (
            <Card key={service.label} className="p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/10">
                  <service.icon className="h-4.5 w-4.5 text-brand-cyan-light" />
                </span>
                <span className="text-sm font-medium text-text-primary">{service.label}</span>
                <Badge variant="neutral" className="ml-auto shrink-0">
                  Coming Soon
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-1 text-center text-sm text-text-secondary">
          <p className="font-medium text-text-primary">{brandConfig.parentCompanyName}</p>
          <p>{brandConfig.location.display}</p>
        </CardContent>
      </Card>
    </div>
  );
}
