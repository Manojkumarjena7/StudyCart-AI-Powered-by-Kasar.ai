import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function TermsPage() {
  return (
    <ComingSoon
      moduleName="Terms of Service"
      description="Our full terms of service are being finalized and will be published here shortly."
      icon={FileText}
    />
  );
}
