import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const {
      name,
      gender,
      phone,
      age,
      height,
      weight,
      joiningDate,
    } = body;

    // Basic shape validation (not using Zod)
    if (!name || !gender || !phone || !age || !height || !weight || !joiningDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingMember = await prisma.member.findUnique({
      where: { phone },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Member already exists" }, { status: 400 });
    }

    const member = await prisma.member.create({
      data: {
        name,
        gender,
        phone,
        age,
        height,
        weight,
        joiningDate: new Date(joiningDate),
        status: false,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err) {
    console.error("POST /api/member error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        activePlan: {
          include: {
            plan: true,
          },
        },
        planHistories: {
          include: {
            plan: true,
          },
        },
        payments: true,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("GET /api/member error:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}