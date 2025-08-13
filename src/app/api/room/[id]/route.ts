import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const roomDetail = await prisma.room.findFirst({
      where: { id: roomId },
      include: {
        owner: true,
        room_user: {
          include: {
            user: true
          }
        }
      }
    });

    if (!roomDetail) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(roomDetail);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    const { id } = await params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId }
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roomId = parseInt(id);

    await prisma.room_user.deleteMany({
      where: {
        room_id: roomId
      }
    });

    const deleteRoom = await prisma.room.delete({
      where: {
        id: roomId
      }
    })
    return NextResponse.json(deleteRoom)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}