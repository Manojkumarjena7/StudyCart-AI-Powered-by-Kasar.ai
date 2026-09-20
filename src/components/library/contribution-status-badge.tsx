import { Badge } from "@/components/shared/ui/badge";
import type { ContributionStatus } from "@/lib/library/types";

const STATUS_VARIANT: Record<ContributionStatus, "warning" | "success" | "error"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

const STATUS_LABEL: Record<ContributionStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function ContributionStatusBadge({ status }: { status: ContributionStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
