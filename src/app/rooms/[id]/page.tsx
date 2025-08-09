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

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    console.log("Page: Received ID:", id); 

    let roomDetails = null;

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

        console.log(roomDetails)

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

    return (
        <SidebarProvider>
            <SidebarLeft roomUser={safeRoomUser}/>
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
                        {roomDetails ? (
                            <div>
                                <h1 className="text-2xl font-bold">{roomDetails.name}</h1>
                                <p>Room Code: {roomDetails.code}</p>
                                <p>Owner: {roomDetails.owner.name}</p>
                                <p>Members: {roomDetails.room_user.length}</p>
                            </div>
                        ) : (
                            <p>Room not found or loading...</p>
                        )}
                    </div>
                </div>
            </SidebarInset>
            <SidebarRight roomCode={roomDetails?.code ?? undefined} ownerName={roomDetails?.owner?.name ?? undefined}/>
        </SidebarProvider>
    )
}
