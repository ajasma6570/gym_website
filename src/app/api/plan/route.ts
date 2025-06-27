import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all plans
export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isDeleted: false },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

// POST: Create a new plan

export async function POST(request: Request) {
  const body = await request.json();
  const { name, duration, amount, type, status } = body;

  try {
    const existingPlan = await prisma.plan.findFirst({
      where: { name },
    });

    if (existingPlan) {
      return NextResponse.json(
        { error: "Plan with this name already exists" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        duration,
        amount,
        type,
        status,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Failed to create plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}