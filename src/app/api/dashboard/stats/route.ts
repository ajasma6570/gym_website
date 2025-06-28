import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Total members count
        const totalMembers = await prisma.member.count();

        // Active members (have current active plan and due date is in future)
        const activeMembers = await prisma.member.count({
            where: {
                activePlan: {
                    dueDate: {
                        gte: now
                    }
                }
            }
        });

        // Inactive members (no active plan or plan expired)
        const inactiveMembers = totalMembers - activeMembers;

        // Members expiring within 3 days
        const expiringIn3Days = await prisma.member.count({
            where: {
                activePlan: {
                    dueDate: {
                        gte: now,
                        lte: threeDaysFromNow
                    }
                }
            }
        });

        // Members expiring within 7 days
        const expiringIn7Days = await prisma.member.count({
            where: {
                activePlan: {
                    dueDate: {
                        gte: now,
                        lte: sevenDaysFromNow
                    }
                }
            }
        });

        // Personal training users
        const personalTrainingUsers = await prisma.member.count({
            where: {
                activePlan: {
                    plan: {
                        type: "personal_training"
                    },
                    dueDate: {
                        gte: now
                    }
                }
            }
        });

        const stats = {
            totalMembers,
            activeMembers,
            inactiveMembers,
            expiringIn3Days,
            expiringIn7Days,
            personalTrainingUsers
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard statistics" },
            { status: 500 }
        );
    }
}
