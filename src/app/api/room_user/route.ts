import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { room_id, user_id } = body;

    if (!room_id || !user_id) {
      return NextResponse.json({
        error: "Missing required fields",
        received: { room_id, user_id }
      }, { status: 400 });
    }

    const newRoomUser = await prisma.room_user.create({
      data: {
        room_id: parseInt(room_id),
        user_id: parseInt(user_id)
      }
    });

    return NextResponse.json(newRoomUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create new room_user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}