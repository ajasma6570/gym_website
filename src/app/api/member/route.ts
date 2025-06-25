import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateMemberInput } from "@/lib/member/validateInput";
import { getPlanById } from "@/lib/member/getPlan";
import { createNewMember } from "@/lib/member/createMember";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const result = validateMemberInput(body);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const parsedBody = result.parsedBody;

    const plan = await getPlanById(parsedBody.planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 400 });
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        phone: parsedBody.phone,
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Member with this phone number already exists" }, { status: 400 });
    }

    const member = await createNewMember(parsedBody, plan);
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
        plan: true,
        payments: true,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("GET /api/member error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
