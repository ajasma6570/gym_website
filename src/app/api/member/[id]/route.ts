import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStatusFromPlanDuration } from "@/lib/calculateStatus";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json();
  const numericId = parseInt(params.id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  const existingMember = await prisma.member.findUnique({ where: { id: numericId } });
  if (!existingMember) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const planId = parseInt(data.activePlan);
  if (isNaN(planId)) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 400 });
  }

  const paymentStartDate = data.paymentStart ? new Date(data.paymentStart) : new Date();
  const { isActive } = getStatusFromPlanDuration(paymentStartDate, plan.duration);

  const updated = await prisma.member.update({
    where: { id: numericId },
    data: {
      ...data,
      paymentStart: paymentStartDate,
      planId,
      status: isActive,
    },
  });

  return NextResponse.json(updated);
}


// export async function DELETE(
//   request: NextRequest,
//   { params }: RouteParams
// ) {
//   const { id } = params;
  
//   try {
//     await prisma.payment.deleteMany({ where: { memberId: id } });
//     await prisma.member.delete({ where: { id } });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("DELETE error:", error);
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }