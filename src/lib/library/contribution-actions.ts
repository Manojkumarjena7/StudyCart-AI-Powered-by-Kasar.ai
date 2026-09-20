"use server";

import { revalidatePath } from "next/cache";
import { getContributionRepository, type SubmitContributionInput, type SubmitContributionResult } from "@/lib/library/contribution-repository";

/**
 * Server Actions for the Library Contribution MVP — the only way client components
 * touch contribution storage (never directly). Mirrors the existing
 * src/features/analyzer/submitAnalysis.ts pattern: a plain "use server" async
 * function, called directly from a client component inside startTransition, with a
 * File passed as a normal argument.
 */

export async function submitContributionAction(input: SubmitContributionInput): Promise<SubmitContributionResult> {
  const result = await getContributionRepository().submitContribution(input);
  if (result.ok) {
    revalidatePath("/library/contributions");
  }
  return result;
}

export async function approveContributionAction(id: string) {
  const updated = await getContributionRepository().approveContribution(id);
  revalidatePath("/library/contributions");
  revalidatePath("/library/materials");
  return updated;
}

export async function rejectContributionAction(id: string, reason?: string) {
  const updated = await getContributionRepository().rejectContribution(id, reason);
  revalidatePath("/library/contributions");
  revalidatePath("/library/materials");
  return updated;
}
