import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await params;
    const roomCode = parseInt(code);

    if (isNaN(roomCode)) {
      return NextResponse.json({ error: "Invalid room code" }, { status: 400 });
    }

    const roomByCode = await prisma.room.findUnique({
      where: { code: roomCode },
      include: {
        room_user: {
          include: {
            user: true
          }
        },
        owner: true
      }
    });

    if (!roomByCode) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(roomByCode);

  } catch {
    return NextResponse.json({ error: "Failed to get room" }, { status: 500 });
  }
}