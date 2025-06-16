import { prisma } from "@/lib/prisma";
import { getStatusFromPlanDuration } from "./getMemberStatus";

export async function createNewMember(data: any, plan: any) {
  const paymentStartDate = data.paymentStart ? new Date(data.paymentStart) : new Date();
  const { isActive, expiryDate } = getStatusFromPlanDuration(paymentStartDate, plan.duration);

  return prisma.member.create({
    data: {
      name: data.name,
      gender: data.gender,
      phone: data.phone,
      age: data.age,
      height: data.height,
      weight: data.weight,
      joiningDate: new Date(data.joiningDate),
      status: isActive,
      activePlan: plan.name,
      paymentStart: paymentStartDate,
      dueDate: data.dueDate ? new Date(data.dueDate) : expiryDate,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      planId: data.planId,
      payments: data.initialPayment
        ? {
            create: {
              amount: data.initialPayment,
            },
          }
        : undefined,
    },
  });
}
