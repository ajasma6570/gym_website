import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/[id] - Get task by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const taskId = parseInt(params.id);

        if (isNaN(taskId)) {
            return NextResponse.json(
                { error: "Invalid task ID" },
                { status: 400 }
            );
        }

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null, // Only get non-deleted tasks
            },
        });

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("GET task by ID error:", error);
        return NextResponse.json(
            { error: "Failed to fetch task" },
            { status: 500 }
        );
    }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const taskId = parseInt(params.id);

        if (isNaN(taskId)) {
            return NextResponse.json(
                { error: "Invalid task ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, description, isComplete } = body;

        // Check if task exists and is not deleted
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
            },
        });

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(isComplete !== undefined && { isComplete }),
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("PUT task error:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}

// DELETE /api/tasks/[id] - Soft delete task
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const taskId = parseInt(params.id);

        if (isNaN(taskId)) {
            return NextResponse.json(
                { error: "Invalid task ID" },
                { status: 400 }
            );
        }

        // Check if task exists and is not already deleted
        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
            },
        });

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        // Soft delete by setting deletedAt timestamp
        const deletedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                deletedAt: new Date(),
            },
        });

        return NextResponse.json({
            message: "Task deleted successfully",
            task: deletedTask,
        });
    } catch (error) {
        console.error("DELETE task error:", error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
}
