import { BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function BooksComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Books & Study Materials"
      description="A curated library of books and study materials for competitive exam preparation is on its way."
      icon={BookOpen}
    />
  );
}
