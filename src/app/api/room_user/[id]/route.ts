import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


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
            owner_id: true,
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    const { id } = await params
    const roomId = parseInt(id)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId }
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deleteRoomById = await prisma.room_user.delete({
      where: {
        room_id_user_id: {
          room_id: roomId,
          user_id: user.id
        }
      },
    })

    return NextResponse.json(deleteRoomById)
  } catch (error) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}