import Link from "next/link";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";

interface ComingSoonProps {
  moduleName: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({ moduleName, description, icon: Icon = Sparkles }: ComingSoonProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-bg-card">
        <Icon className="h-7 w-7 text-brand-cyan-light" />
      </div>
      <Badge variant="trending">COMING SOON</Badge>
      <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">{moduleName}</h1>
      <p className="text-balance text-text-secondary">{description}</p>
      <Link href="/">
        <Button variant="secondary">Back to Home</Button>
      </Link>
    </div>
  );
}
