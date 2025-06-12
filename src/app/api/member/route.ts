import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, age, weight, height, contactNo, payment } = await request.json();

  const member = await prisma.member.create({
    data: {
      name,
      age,
      weight,
      height,
      contactNo,
      payment,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
