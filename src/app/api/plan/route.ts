import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all plans
export async function GET() {
  try {
    const plans = await prisma.plan.findMany();
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch plans ",error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

// POST: Create a new plan
export async function POST(request: Request) {
  try {
    const { name, duration, price } = await request.json();

    const plan = await prisma.plan.create({
      data: { name, duration, price },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Failed to create plan",error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
