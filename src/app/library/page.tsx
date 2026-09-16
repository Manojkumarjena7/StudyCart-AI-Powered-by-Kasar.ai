import { BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function LibraryComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Learning Library"
      description="A curated library of automation, testing, AI, programming, and interview-prep content is on its way."
      icon={BookOpen}
    />
  );
}
