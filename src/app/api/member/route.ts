// app/api/member/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { name, age, weight, height, contactNo, planId, initialPayment } = await req.json();

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 400 });

  const member = await prisma.member.create({
    data: {
      name,
      age,
      weight,
      height,
      contactNo,
      planId,
      paymentStatus: !!initialPayment,
      payments: initialPayment
        ? {
            create: {
              amount: initialPayment,
            },
          }
        : undefined,
    },
  });

  return NextResponse.json(member, { status: 201 });
}

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: { plan: true, payments: true },
    });

    const today = new Date();

    const withStatus = members.map((m) => {
      const expiryDate = new Date(m.joiningDate);
      expiryDate.setDate(expiryDate.getDate() + m.plan.duration);

      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceExpiry = -daysLeft; // if expired, daysLeft will be negative

      let statusLabel = "Active";
      let color = "green";

      if (daysLeft === 0) {
        statusLabel = "Expires Today";
        color = "orange";
      } else if (daysLeft < 0 && daysSinceExpiry <= 5) {
        statusLabel = "Payment Pending - 5 Days";
        color = "orange";
      } else if (daysSinceExpiry > 5 && daysSinceExpiry <= 10) {
        statusLabel = "Follow-up Needed - 10 Days";
        color = "orange";
      } else if (daysSinceExpiry > 10) {
        statusLabel = "Critical - No Payment";
        color = "red";
      }

      return {
        ...m,
        expiryDate,
        daysLeft,
        statusLabel,
        color,
      };
    });

    return NextResponse.json(withStatus);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
