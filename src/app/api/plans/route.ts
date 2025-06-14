// app/api/plan/route.ts
import { NextResponse } from 'next/server';


const plans = [
    {
        id: "1",
        name: "1 month plan",
        duration: 30,
        amount: "1000",
        status: "active",
    },
    {
        id: "2",
        name: "3 month plan",
        duration: 90,
        amount: "2500",
        status: "active",
    },
];

export async function GET() {
    return NextResponse.json(plans);
}


export async function POST(request: Request) {
    const newPlan = await request.json();
    newPlan.id = Math.random().toString(36).substring(2, 10);
    plans.push(newPlan);
    return NextResponse.json(newPlan, { status: 201 });
}

export async function PUT(request: Request) {
    const updatedPlan = await request.json();
    const index = plans.findIndex(plan => plan.id === updatedPlan.id);
    if (index !== -1) {
        plans[index] = updatedPlan;
        return NextResponse.json(updatedPlan);
    }
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const index = plans.findIndex(plan => plan.id === id);
    if (index !== -1) {
        plans.splice(index, 1);
        return NextResponse.json({ message: 'Plan deleted successfully' });
    }
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
}