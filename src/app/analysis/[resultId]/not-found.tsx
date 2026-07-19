import { SearchX } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function AnalysisNotFound() {
  return (
    <ComingSoon
      moduleName="Analysis Not Found"
      description="We couldn't find this result. It may have expired, or the link may be incorrect. Try analyzing your answer key again."
      icon={SearchX}
    />
  );
}
