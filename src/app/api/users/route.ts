// app/api/users/route.ts
import { NextResponse } from 'next/server';

const users = [
    {
        id: "m5gr84i9",
        email: "ken99@example.com",
        name: "ken",
        age: 29,
        weight: 70,
        height: 175,
        joiningDate: "2023-01-15",
        phone: "123-456-7890",
    },
    {
        id: "3u1reuv4",
        email: "Abe45@example.com",
        name: "Abe",
        age: 34,
        weight: 80,
        height: 180,
        joiningDate: "2023-02-20",
        phone: "234-567-8901",
    },
    {
        id: "derv1ws0",
        email: "Monserrat44@example.com",
        name: "Monserrat",
        age: 28,
        weight: 65,
        height: 165,
        joiningDate: "2023-03-10",
        phone: "345-678-9012",
    },
    {
        id: "5kma53ae",
        email: "Silas22@example.com",
        name: "Silas",
        age: 31,
        weight: 75,
        height: 178,
        joiningDate: "2023-04-05",
        phone: "456-789-0123",
    },
    {
        id: "bhqecj4p",
        email: "carmella@example.com",
        name: "Carmella",
        age: 26,
        weight: 68,
        height: 172,
        joiningDate: "2023-05-12",
        phone: "567-890-1234",
    },
];


export async function GET() {
    return NextResponse.json(users);
}


export async function POST(request: Request) {
    const newUser = await request.json();
    newUser.id = Math.random().toString(36).substring(2, 10);
    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
}