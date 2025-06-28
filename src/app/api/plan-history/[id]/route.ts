import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await params;
  const planHistoryId = parseInt(result.id);

  if (isNaN(planHistoryId)) {
    return NextResponse.json({ error: "Invalid plan history ID" }, { status: 400 });
  }

  try {
    // Check if the plan history exists
    const planHistory = await prisma.planHistory.findUnique({
      where: { id: planHistoryId },
      include: { plan: true }
    });

    if (!planHistory) {
      return NextResponse.json({ error: "Plan history not found" }, { status: 404 });
    }

    // Check if this is an active plan
    const today = new Date();
    const isActivePlan = new Date(planHistory.startDate) <= today && new Date(planHistory.dueDate) >= today;
    
    if (isActivePlan) {
      // If it's an active membership plan, we need to update the member's activePlanId
      if (planHistory.plan.type === "membership_plan") {
        await prisma.member.updateMany({
          where: { activePlanId: planHistoryId },
          data: { activePlanId: null }
        });
      }
    }

    // Use a transaction to delete plan history and create a refund payment entry
    const result = await prisma.$transaction(async (tx) => {
      // Create a negative payment entry to show the refund/deletion in payment history
      // This maintains audit trail instead of deleting the original payment
      const refundPayment = await tx.payment.create({
        data: {
          memberId: planHistory.memberId,
          amount: -planHistory.plan.amount, // Negative amount to show refund
          date: new Date(), // Current date for the refund
          paymentMethod: "refund", // Special payment method for refunds
        },
      });

      // Delete the plan history entry
      const deletedPlanHistory = await tx.planHistory.delete({
        where: { id: planHistoryId }
      });

      return { deletedPlanHistory, refundPayment };
    });

    return NextResponse.json({
      message: "Plan history deleted and refund payment created successfully",
      deletedPlanHistory: result.deletedPlanHistory,
      refundPayment: result.refundPayment,
    });
  } catch (error) {
    console.error("DELETE plan history failed:", error);
    return NextResponse.json(
      { error: "Failed to delete plan history" },
      { status: 500 }
    );
  }
}
