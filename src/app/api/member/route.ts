import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateMemberInput } from "@/lib/member/validateInput";
import { getPlanById } from "@/lib/member/getPlan";
import { checkDuplicateMember } from "@/lib/member/checkDuplicate";
import { getStatusFromPlanDuration } from "@/lib/member/getMemberStatus";
import { createNewMember } from "@/lib/member/createMember";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = validateMemberInput(body);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const parsedBody = result.parsedBody;

    const plan = await getPlanById(parsedBody.planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 400 });
    }

    const exists = await checkDuplicateMember(parsedBody.name, parsedBody.phone);
    if (exists) {
      return NextResponse.json(
        { error: "Member with the same name and phone already exists" },
        { status: 409 }
      );
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
      where: {
        isDeleted: false,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("GET /api/member error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
