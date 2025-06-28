import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        activePlan: {
          include: {
            plan: true,
          },
        },
        payments: true,
        planHistories: {
          include: {
            plan: true,
          },
          orderBy: {
            startDate: "desc",
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("GET /api/member/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }
  const data = await request.json();
  try {
    const existingMember = await prisma.member.findUnique({
      where: { id: numericId },
    });
    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const joiningDate = new Date(data.joiningDate);

    const updated = await prisma.member.update({
      where: { id: numericId },
      data: {
        ...data,
        joiningDate,
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

    // Use transaction to ensure all deletions happen together
    const result = await prisma.$transaction(async (tx) => {
      // First, delete all plan histories for this member
      await tx.planHistory.deleteMany({
        where: { memberId: memberId },
      });

      // Then, delete all payments for this member
      await tx.payment.deleteMany({
        where: { memberId: memberId },
      });

      // Finally, delete the member
      const deletedMember = await tx.member.delete({
        where: { id: memberId },
      });

      return deletedMember;
    });

    return NextResponse.json({ success: true, member: result });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

