import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks - Get all tasks
export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                deletedAt: null, // Only get non-deleted tasks
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("GET tasks error:", error);
        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error: unknown) {
        console.error("POST task error:", error);

        // Handle Prisma unique constraint violation
        if (error && typeof error === 'object' && 'code' in error &&
            error.code === 'P2002' &&
            'meta' in error &&
            error.meta &&
            typeof error.meta === 'object' &&
            'target' in error.meta &&
            Array.isArray(error.meta.target) &&
            error.meta.target.includes('title')) {
            return NextResponse.json(
                { error: "A task with this title already exists" },
                { status: 409 } // Conflict status code
            );
        }

        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}
