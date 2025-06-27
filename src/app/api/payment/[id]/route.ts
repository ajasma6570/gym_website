import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { PaymentMethod } from "@prisma/client";

interface PaymentBody {
  planId: number;
  personalTrainingPlanId?: number;
  paymentStart: string;
  amount: number;
  paymentMethod?: PaymentMethod;
}


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const memberId = parseInt(id);
  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  const today = new Date();

  try {
    const currentPlans = await prisma.planHistory.findMany({
      where: {
        memberId,
        startDate: { lte: today },
        dueDate: { gte: today },
      },
      include: { plan: true },
      orderBy: { startDate: "asc" },
    });

    const futurePlans = await prisma.planHistory.findMany({
      where: {
        memberId,
        startDate: { gt: today },
      },
      include: { plan: true },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({
      currentPlans,
      futurePlans,
    });
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plan history" },
      { status: 500 }
    );
  }
}



interface PaymentBody {
  planId: number;
  personalTrainingPlanId?: number;
  paymentStart: string; // ISO format
  amount: number;
  paymentMethod?: PaymentMethod;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memberId = parseInt(id);
  if (isNaN(memberId)) {
    return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
  }

  const body = (await req.json()) as PaymentBody;

  try {
    const {
      planId,
      personalTrainingPlanId,
      paymentStart,
      amount,
      paymentMethod,
    } = body;

    const startDate = new Date(paymentStart);

    // 1. Fetch current active membership plan (if any)
    const currentActive = await prisma.planHistory.findFirst({
      where: {
        memberId,
        plan: { type: "membership_plan" },
        startDate: { lte: new Date() },
        dueDate: { gte: new Date() },
      },
      orderBy: { dueDate: "desc" },
    });

    // 2. Fetch selected plan
    const membershipPlan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!membershipPlan) {
      return NextResponse.json({ error: "Membership plan not found" }, { status: 400 });
    }

    // 3. Check if startDate overlaps with current plan
    if (currentActive && startDate <= currentActive.dueDate) {
      return NextResponse.json(
        {
          error: `Current plan is active until ${currentActive.dueDate.toDateString()}. Please choose a start date after that.`,
        },
        { status: 400 }
      );
    }

    const dueDate = addDays(startDate, membershipPlan.duration);

    // 4. Create membership plan history
    const membershipPlanHistory = await prisma.planHistory.create({
      data: {
        memberId,
        planId,
        startDate,
        dueDate,
      },
    });

    // 5. Update activePlanId ONLY if there is no current active
    if (!currentActive || currentActive.dueDate < new Date()) {
      await prisma.member.update({
        where: { id: memberId },
        data: {
          activePlanId: membershipPlanHistory.id,
        },
      });
    }

    // 6. Handle optional personal training plan
    if (personalTrainingPlanId) {
      const personalPlan = await prisma.plan.findUnique({
        where: { id: personalTrainingPlanId },
      });

      if (!personalPlan) {
        return NextResponse.json({ error: "Personal training plan not found" }, { status: 400 });
      }

      const personalDueDate = addDays(startDate, personalPlan.duration);

      await prisma.planHistory.create({
        data: {
          memberId,
          planId: personalTrainingPlanId,
          startDate,
          dueDate: personalDueDate,
        },
      });
    }

    // 7. Record the payment
    const payment = await prisma.payment.create({
      data: {
        memberId,
        amount,
        date: new Date(),
        paymentMethod,
      },
    });

    return NextResponse.json(
      {
        message: "Plan scheduled successfully",
        activeImmediately: !currentActive || currentActive.dueDate < new Date(),
        planStart: startDate,
        planDue: dueDate,
        payment,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/payment/[memberId] failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
