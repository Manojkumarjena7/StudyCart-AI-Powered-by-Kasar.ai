import { Briefcase } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";
import { brandConfig } from "@/config/brand";

export default function JobsComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Government & Private Job Listings"
      description={`Curated, exam-relevant job listings from government and private sources are coming to the ${brandConfig.productShortName} platform.`}
      icon={Briefcase}
    />
  );
}
