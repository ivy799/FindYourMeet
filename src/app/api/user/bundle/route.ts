import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { clerk_user_id: userId },
      include: {
        user_detail: true,
        owned_rooms: {
          where: { status: true },
          include: {
            room_user: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            },
            _count: {
              select: {
                room_user: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        },
        room_user: {
          include: {
            room: {
              include: {
                room_user: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true
                      }
                    }
                  }
                },
                _count: {
                  select: {
                    room_user: true
                  }
                }
              }
            }
          },
          orderBy: {
            id: 'desc'
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = {
      user: {
        id: userData.id,
        clerk_user_id: userData.clerk_user_id,
        email: userData.email,
        name: userData.name,
        image_url: userData.image_url,
        role_id: userData.role_id
      },
      userDetails: userData.user_detail[0] || null,
      ownedRooms: userData.owned_rooms,
      joinedRooms: userData.room_user
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching user data bundle:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
