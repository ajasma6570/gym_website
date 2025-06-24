import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, context: Context) {
  const id = context.params.id;

  try {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET plan failed:", error);
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Context) {
  const params = await context.params;
  const id = parseInt(params.id);

  console.log("PUT request for plan ID:", id);


  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

  const { name, duration, amount, status } = await req.json();

  try {
    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: { name, duration, amount, status },
    });
    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("PUT plan failed:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const params = await context.params;
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

  try {
    await prisma.plan.delete({ where: { id } });
    return NextResponse.json({ message: "Plan deleted" });
  } catch (error) {
    console.error("DELETE plan failed:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
