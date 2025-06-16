import { prisma } from "@/lib/prisma";

export async function getPlanById(planId: number) {
  return prisma.plan.findUnique({ where: { id: planId } });
}
