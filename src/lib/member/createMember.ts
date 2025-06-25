import { prisma } from "@/lib/prisma";
import { getStatusFromPlanDuration } from "./getMemberStatus";

// Define proper types for the input data
interface CreateMemberData {
  name: string;
  gender: "male" | "female" | "other";
  phone: string;
  age: number;
  height: number;
  weight: number;
  joiningDate: string;
  paymentStart?: string;
  dueDate?: string;
  planId: number;
  initialPayment?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PlanData {
  id: number;
  name: string;
  duration: number;
  amount: number;
  status: string;
}

export async function createNewMember(data: CreateMemberData, plan: PlanData) {
  // Handle payment start date - default to joining date if not provided
  const paymentStartDate = data.paymentStart
    ? new Date(data.paymentStart)
    : new Date(data.joiningDate);

  // Calculate member status and expiry date based on plan duration
  const { isActive, expiryDate } = getStatusFromPlanDuration(paymentStartDate, plan.duration);

  // Prepare the member data for Prisma
  const memberData = {
    name: data.name,
    gender: data.gender,
    phone: data.phone,
    age: data.age,
    height: data.height,
    weight: data.weight,
    joiningDate: new Date(data.joiningDate),
    planId: data.planId,
    activePlan: plan.name, // Store plan name as string
    status: isActive, // Use boolean value as expected by database
    paymentStart: paymentStartDate,
    dueDate: data.dueDate ? new Date(data.dueDate) : expiryDate,
    // Don't set createdAt/updatedAt manually - let Prisma handle them
  };


  return prisma.member.create({
    data: memberData,
    include: {
      payments: true,
      plan: true,
    },
  });
}

