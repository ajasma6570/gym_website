import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStatusFromPlanDuration } from "@/lib/member/getMemberStatus";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const updated = await prisma.member.update({
      where: { id: numericId },
      data: {
        ...data,
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
  { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memberId = parseInt(id);
  try {

    if (isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const updated = await prisma.member.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Soft delete failed" }, { status: 500 });
  }
}

//get User by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  try {
    const member = await prisma.member.findUnique({
      where: { id: numericId },
      include: {
        plan: true,
        payments: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}
