import { ShieldCheck } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function PrivacyPage() {
  return (
    <ComingSoon
      moduleName="Privacy Policy"
      description="Our full privacy policy is being finalized. In short: we never permanently store your uploaded PDFs or response-sheet URLs, and only minimal, anonymized results are used for community ranking."
      icon={ShieldCheck}
    />
  );
}
