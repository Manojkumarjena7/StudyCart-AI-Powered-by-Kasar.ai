import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { brandConfig } from "@/config/brand";

export function AboutPreview() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold text-text-primary">About {brandConfig.productName}</h2>
          <p className="max-w-xl text-sm text-text-secondary">
            {brandConfig.productShortName} is {brandConfig.endorsementText}, a technology company
            based in {brandConfig.location.display}, building useful digital services for students.
          </p>
          <Link href="/about">
            <Button variant="secondary" size="sm">
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
