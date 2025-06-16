import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStatusFromPlanDuration } from "@/lib/calculateStatus";

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  const data = await request.json();

  try {
    const planId = parseInt(data.activePlan);
    if (isNaN(planId)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 400 });
    }

    // Convert dates
    const paymentStartDate = new Date(data.paymentStart);
    const joiningDate = new Date(data.joiningDate);
    const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;

    const { isActive } = getStatusFromPlanDuration(paymentStartDate, plan.duration);

    // Remove `id` from data
    const { id: _, ...cleanData } = data;

    const updated = await prisma.member.update({
      where: { id: numericId },
      data: {
        ...cleanData,
        paymentStart: paymentStartDate,
        joiningDate,
        dueDate,
        planId,
        status: isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  const memberId = parseInt(id);
  try {
    
    await prisma.payment.updateMany({
      where: { memberId: memberId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Soft delete the member
    const updated = await prisma.member.update({
      where: { id: memberId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Soft delete failed" }, { status: 500 });
  }
}
