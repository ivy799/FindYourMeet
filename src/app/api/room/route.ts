import { auth } from "@clerk/nextjs/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Room creation request body:", body);

    const { owner_id, name, code, status } = body;

    if (!owner_id || !name || !code) {
      return NextResponse.json({
        error: "Missing required fields",
        received: { owner_id, name, code, status }
      }, { status: 400 });
    }

    const newRoom = await prisma.room.create({
      data: {
        owner_id: parseInt(owner_id),
        name,
        code: parseInt(code),
        status
      }
    });

    console.log("Room created successfully:", newRoom);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Failed to create new room:", error);
    return NextResponse.json({
      error: "Failed to create new room",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allRoom = await prisma.room.findMany({
      where: { owner_id: user.id }
    });

    return NextResponse.json(allRoom);

  } catch (error) {
    return NextResponse.json({ error: "Failed to get rooms" }, { status: 500 });
  }
}