// app/api/plan/route.ts
import { NextResponse } from 'next/server';

let plans = [
    {
        id: "1",
        name: "1 month plan",
        days: 30,
        amount: "1000",
        status: "active",
    },
    {
        id: "2",
        name: "3 month plan",
        days: 90,
        amount: "2500",
        status: "active",
    },
];

export async function GET() {
    return NextResponse.json(plans);
}


export async function POST(request: Request) {
    const newUser = await request.json();
    newUser.id = Math.random().toString(36).substring(2, 10);
    plans.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
}