// app/api/member/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getStatusFromPlanDuration } from "@/lib/calculateStatus";


export async function POST(req: Request) {
  const {
    name,
    gender,
    phone,
    age,
    height,
    weight,
    joiningDate,
    activePlan,
    paymentStart,
    dueDate,
    createdAt,
    updatedAt,
    initialPayment,
  } = await req.json();

  const planId = parseInt(activePlan);

  if (isNaN(planId)) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 400 });
  }

  const paymentStartDate = paymentStart ? new Date(paymentStart) : new Date();

  const { isActive, expiryDate } = getStatusFromPlanDuration(paymentStartDate, plan.duration);

  const member = await prisma.member.create({
    data: {
      name,
      gender,
      phone,
      age,
      height,
      weight,
      joiningDate: new Date(joiningDate),
      status: isActive,
      activePlan,
      paymentStart: paymentStartDate,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      planId,
      payments: initialPayment
        ? {
            create: {
              amount: initialPayment,
            },
          }
        : undefined,
    },
  });

  return NextResponse.json(member, { status: 201 });
}





export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        plan: true,
        payments: true,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
