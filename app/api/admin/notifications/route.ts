import { NextResponse } from "next/server";

export async function GET() {
    // Return mock notifications or empty array
    return NextResponse.json([
        {
            id: 1,
            title: "Welcome to NexaMart",
            message: "System fully operational.",
            read: false,
            createdAt: new Date().toISOString(),
        }
    ]);
}
