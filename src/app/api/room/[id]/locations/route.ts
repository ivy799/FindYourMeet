import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const roomId = parseInt(id);

        if (isNaN(roomId)) {
            return NextResponse.json(
                { error: "Invalid room ID" },
                { status: 400 }
            );
        }

        const userAddressAll = await prisma.room.findMany({
            where: {
                id: roomId
            },
            select: {
                room_user: {
                    select: {
                        user: {
                            select: {
                                user_detail: {
                                    select: {
                                        address: true,
                                        lat: true,
                                        long: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const userLocations: { numLat: number; numLot: number; address?: string }[] = [];

        userAddressAll.forEach(room => {
            room.room_user.forEach(ru => {
                const userDetail = ru.user?.user_detail?.[0];
                const lat = userDetail?.lat;
                const long = userDetail?.long;
                const address = userDetail?.address;
                
                if (lat && long) {
                    const numLat = parseFloat(lat);
                    const numLot = parseFloat(long);
                    
                    if (!isNaN(numLat) && !isNaN(numLot)) {
                        userLocations.push({ 
                            numLat, 
                            numLot,
                            address: address || undefined
                        });
                    }
                }
            });
        });

        return NextResponse.json(userLocations);

    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}