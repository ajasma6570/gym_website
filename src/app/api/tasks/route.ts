import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all tasks
export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tasks);
}

// CREATE a new task
export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: { title, description },
  });

  return NextResponse.json(task);
}

// UPDATE task

export async function PUT(req: NextRequest) {
  const { id, title, description, completed } = await req.json();

  const existing = await prisma.task.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { error: `Task with ID ${id} not found` },
      { status: 404 }
    );
  }

  const task = await prisma.task.update({
    where: { id },
    data: { title, description, completed },
  });

  return NextResponse.json(task);
}


// DELETE task
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
