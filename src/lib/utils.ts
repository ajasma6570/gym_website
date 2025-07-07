import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PlanHistory, Plan, PaymentDetailsResponse, Member } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSequentialId(lastId: number): number {
  lastId++;
  return lastId;
}

/**
 * Helper function to check if a list of plans contains both membership and personal training plans
 */
function checkBothPlanTypes(plans: (PlanHistory & { plan: Plan })[]): boolean {
  if (!plans || plans.length === 0) {
    return false;
  }

  const hasMembership = plans.some(
    (plan: PlanHistory & { plan: Plan }) => plan.plan.type === "membership_plan"
  );

  const hasPersonalTraining = plans.some(
    (plan: PlanHistory & { plan: Plan }) => plan.plan.type === "personal_training"
  );

  return hasMembership && hasPersonalTraining;
}

/**
 * Check if user has both future membership and personal training plans
 * This is used to disable the Pay Now button when both plan types have future plans
 */
export function hasBothFuturePlans(paymentDetails?: PaymentDetailsResponse): boolean {
  if (!paymentDetails?.futurePlans) {
    return false;
  }

  return checkBothPlanTypes(paymentDetails.futurePlans);
}

/**
 * Check if member has both future membership and personal training plans based on Member data
 * This version works with the Member interface used in the UserTable
 */
export function memberHasBothFuturePlans(member: Member): boolean {
  if (!member.planHistories || member.planHistories.length === 0) {
    return false;
  }

  const today = new Date();

  // Filter future plans (plans that start after today)
  const futurePlans = member.planHistories.filter((planHistory: PlanHistory & { plan: Plan }) => {
    return new Date(planHistory.startDate) > today;
  });

  return checkBothPlanTypes(futurePlans);
}

