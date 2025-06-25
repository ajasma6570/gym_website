import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await params;
  const id = parseInt(result.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await params;
  const id = parseInt(result.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

  const body = await req.json();

  const existingPlan = await prisma.plan.findFirst({
    where: {
      name: body.name,
      id: { not: id }, // Exclude the current plan being updated
    },
  });

  if (existingPlan) {
    return NextResponse.json(
      { error: "Plan with this name already exists" },
      { status: 400 }
    );
  }

  try {

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("PUT plan failed:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = await params;
  const id = parseInt(result.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
  }

  try {
    const deletedPlan = await prisma.plan.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Plan deleted successfully", plan: deletedPlan });
  } catch (error) {
    console.error("DELETE plan failed:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
