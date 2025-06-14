import { NextRequest, NextResponse } from "next/server";
const users = [
    {
        id: "user001",
        name: "Arun Kumar",
        gender: "male",
        phone: 9847123456,
        age: 28,
        height: 170,
        weight: 72,
        joiningDate: new Date("2025-06-01"),
        status: "active",
        activePlan: "plan001",
        paymentStart: new Date("2025-06-14"),
        dueDate: new Date("2025-07-20"),
        createdAt: new Date("2024-07-01T09:00:00"),
        updatedAt: new Date("2024-07-01T09:00:00"),
    },
    {
        id: "user002",
        name: "Nimisha P",
        gender: "female",
        phone: 9633109876,
        age: 25,
        height: 160,
        weight: 60,
        joiningDate: new Date("2025-06-01"),
        status: "active",
        activePlan: "plan002",
        paymentStart: new Date("2025-06-01"),
        dueDate: new Date("2025-06-07"),
        createdAt: new Date("2024-06-15T10:00:00"),
        updatedAt: new Date("2024-06-15T10:00:00"),
    },
    {
        id: "user003",
        name: "Rahul Raj",
        gender: "male",
        phone: 9745012345,
        age: 32,
        height: 175,
        weight: 80,
        joiningDate: new Date("2024-05-10"),
        status: "inactive",
        activePlan: "plan003",
        paymentStart: new Date("2024-05-10"),
        dueDate: new Date("2024-06-10"),
        createdAt: new Date("2024-05-10T11:00:00"),
        updatedAt: new Date("2024-06-11T11:00:00"),
    },
    {
        id: "user004",
        name: "Divya Nair",
        gender: "female",
        phone: 9995552233,
        age: 29,
        height: 162,
        weight: 64,
        joiningDate: new Date("2025-06-05"),
        status: "active",
        activePlan: "plan001",
        paymentStart: new Date("2025-06-05"),
        dueDate: new Date("2025-09-10"),
        createdAt: new Date("2024-03-01T08:30:00"),
        updatedAt: new Date("2024-06-01T08:30:00"),
    },
    {
        id: "user005",
        name: "Shyam S",
        gender: "male",
        phone: 8078009090,
        age: 35,
        height: 178,
        weight: 85,
        joiningDate: new Date("2024-02-25"),
        status: "inactive",
        activePlan: "plan002",
        paymentStart: new Date("2024-04-25"),
        dueDate: new Date("2024-07-01"),
        createdAt: new Date("2024-02-25T12:15:00"),
        updatedAt: new Date("2024-05-26T12:15:00"),
    },
];
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = users.find((u) => u.id === id);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}
