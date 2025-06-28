import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { PaymentMethod } from "@prisma/client";

interface PaymentBody {
  planId?: number;
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

    // Split current plans by type for the UI
    const personalTrainingPlans = currentPlans.filter(
      plan => plan.plan.type === "personal_training"
    );

    return NextResponse.json({
      currentPlans,
      personalTrainingPlans,
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

    // Validate that at least one plan is selected
    if (!planId && !personalTrainingPlanId) {
      return NextResponse.json(
        { error: "At least one plan (membership or personal training) must be selected" },
        { status: 400 }
      );
    }

    const startDate = new Date(paymentStart);
    let membershipPlanHistory = null;
    let personalTrainingPlanHistory = null;

    // Handle membership plan if selected
    if (planId) {
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

      // 2. Fetch selected membership plan
      const membershipPlan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!membershipPlan) {
        return NextResponse.json({ error: "Membership plan not found" }, { status: 400 });
      }

      // 3. Check if startDate overlaps with current plan
      if (currentActive && startDate <= currentActive.dueDate) {
        return NextResponse.json(
          {
            error: `Current membership plan is active until ${currentActive.dueDate.toDateString()}. Please choose a start date after that.`,
          },
          { status: 400 }
        );
      }

      const membershipDueDate = addDays(startDate, membershipPlan.duration);

      // 4. Create membership plan history
      membershipPlanHistory = await prisma.planHistory.create({
        data: {
          memberId,
          planId,
          startDate,
          dueDate: membershipDueDate,
        },
      });

      // 5. Update activePlanId ONLY if there is no current active membership plan
      if (!currentActive || currentActive.dueDate < new Date()) {
        await prisma.member.update({
          where: { id: memberId },
          data: {
            activePlanId: membershipPlanHistory.id,
          },
        });
      }
    }

    // Handle personal training plan if selected
    if (personalTrainingPlanId) {
      // 1. Fetch current active personal training plans (if any)
      const currentActivePT = await prisma.planHistory.findFirst({
        where: {
          memberId,
          plan: { type: "personal_training" },
          startDate: { lte: new Date() },
          dueDate: { gte: new Date() },
        },
        orderBy: { dueDate: "desc" },
      });

      // 2. Fetch selected personal training plan
      const personalPlan = await prisma.plan.findUnique({
        where: { id: personalTrainingPlanId },
      });

      if (!personalPlan) {
        return NextResponse.json({ error: "Personal training plan not found" }, { status: 400 });
      }

      // 3. Check if startDate overlaps with current PT plan
      if (currentActivePT && startDate <= currentActivePT.dueDate) {
        return NextResponse.json(
          {
            error: `Current personal training plan is active until ${currentActivePT.dueDate.toDateString()}. Please choose a start date after that.`,
          },
          { status: 400 }
        );
      }

      const personalDueDate = addDays(startDate, personalPlan.duration);

      // 4. Create personal training plan history
      personalTrainingPlanHistory = await prisma.planHistory.create({
        data: {
          memberId,
          planId: personalTrainingPlanId,
          startDate,
          dueDate: personalDueDate,
        },
      });
    }

    // 6. Record the payment
    const payment = await prisma.payment.create({
      data: {
        memberId,
        amount,
        date: new Date(),
        paymentMethod: paymentMethod || "cash",
      },
    });

    return NextResponse.json(
      {
        message: "Payment processed successfully",
        activeImmediately: true,
        planStart: startDate,
        planDue: membershipPlanHistory?.dueDate || personalTrainingPlanHistory?.dueDate,
        payment,
        membershipPlan: membershipPlanHistory,
        personalTrainingPlan: personalTrainingPlanHistory,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/payment/[memberId] failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
