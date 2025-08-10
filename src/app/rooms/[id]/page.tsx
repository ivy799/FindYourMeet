import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarRight } from "@/components/sidebar-right"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import MapComponent from "@/components/map"

const prisma = new PrismaClient();

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    
    let roomDetails = null;
    let userLocations: { numLat: number; numLot: number }[] = [];

    try {
        const { userId } = await auth();

        if (!userId) {
            console.log("No user ID found");
            return;
        }

        const user = await prisma.user.findUnique({
            where: { clerk_user_id: userId }
        });

        if (!user) {
            console.log("User not found in database");
            return;
        }

        const roomId = parseInt(id);

        if (isNaN(roomId)) {
            console.log("Invalid room ID");
            return;
        }

        roomDetails = await prisma.room.findFirst({
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

        const userAdressAll = await prisma.room.findMany({
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

        userAdressAll.forEach(room => {
            room.room_user.forEach(ru => {
                const lat = ru.user?.user_detail?.[0]?.lat;
                const long = ru.user?.user_detail?.[0]?.long;
                
                if (lat && long) {
                    const numLat = parseFloat(lat);
                    const numLot = parseFloat(long);
                    
                    if (!isNaN(numLat) && !isNaN(numLot)) {
                        userLocations.push({ numLat, numLot });
                    }
                }
            });
        });

        console.log("Valid user locations:", userLocations);

    } catch (error) {
        console.error("Page Error:", error);
    }
    const safeRoomUser = roomDetails?.room_user?.map((ru: any) => ({
        ...ru,
        user: {
            ...ru.user,
            created_at: ru.user.created_at instanceof Date ? ru.user.created_at.toISOString() : ru.user.created_at,
            updated_at: ru.user.updated_at instanceof Date ? ru.user.updated_at.toISOString() : ru.user.updated_at,
        }
    }));

    console.log(roomDetails?.room_user)

    return (
        <SidebarProvider>
            <SidebarLeft roomUser={safeRoomUser} />
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1">
                                        {roomDetails?.name || "Find Your Ideal Place"}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="bg-muted/50 mx-auto h-[100vh] w-full max-w-3xl rounded-xl p-4">
                        <MapComponent locations={userLocations} />
                    </div>
                </div>
            </SidebarInset>
            <SidebarRight roomCode={roomDetails?.code ?? undefined} ownerName={roomDetails?.owner?.name ?? undefined} ownerImage={roomDetails?.owner.image_url ?? ""} />
        </SidebarProvider>
    )
}
