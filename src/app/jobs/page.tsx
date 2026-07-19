import { Briefcase } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function JobsComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Government & Private Job Listings"
      description="Curated, exam-relevant job listings from government and private sources are coming to the KaSar Tech platform."
      icon={Briefcase}
    />
  );
}
