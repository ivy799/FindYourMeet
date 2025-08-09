import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const joinedRoom = await prisma.room_user.findMany({
      where: { user_id: user.id },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            code: true,
            status: true,
            created_at: true
          }
        }
      }
    })

    if (!joinedRoom) {
      throw new Error
    }

    return NextResponse.json(joinedRoom)

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}