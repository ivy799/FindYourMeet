'use client'

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
import { Button } from "@/components/ui/button"
import MapComponent from "@/components/map"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import type { POI } from "@/hooks/use-poi"
import { FourSquare } from "react-loading-indicators"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default function Page({ params }: PageProps) {
    const { user } = useUser()
    const router = useRouter()
    const [roomId, setRoomId] = useState<string>('')
    const [roomDetails, setRoomDetails] = useState<any>(null)
    const [userLocations, setUserLocations] = useState<{ numLat: number; numLot: number }[]>([])
    const [pois, setPois] = useState<POI[]>([])
    const [poisLoading, setPoisLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getRoomId = async () => {
            const resolvedParams = await params
            setRoomId(resolvedParams.id)
        }
        getRoomId()
    }, [params])

    useEffect(() => {
        if (!roomId || !user) return

        const fetchRoomData = async () => {
            try {
                setLoading(true)
                
                const roomResponse = await fetch(`/api/room/${roomId}`)
                if (!roomResponse.ok) throw new Error('Failed to fetch room')
                const room = await roomResponse.json()
                setRoomDetails(room)

                const locationsResponse = await fetch(`/api/room/${roomId}/locations`)
                if (locationsResponse.ok) {
                    const locations = await locationsResponse.json()
                    console.log('Fetched locations:', locations)
                    setUserLocations(locations)
                } else {
                    console.log('Failed to fetch locations, using mock data for testing')
                    setUserLocations([
                        { numLat: -6.2088, numLot: 106.8456 },
                        { numLat: -6.2000, numLot: 106.8400 }
                    ])
                }

            } catch (error) {
                console.error('Error fetching room data:', error)
                setUserLocations([
                    { numLat: -6.2088, numLot: 106.8456 },
                    { numLat: -6.2000, numLot: 106.8400 }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchRoomData()
    }, [roomId, user])

    const handlePOIsUpdate = (newPois: POI[]) => {
        console.log('POIs updated:', newPois.length)
        setPois(newPois)
        setPoisLoading(false)
    }

    useEffect(() => {
        if (userLocations.length > 0) {
            setPoisLoading(true)
        }
    }, [userLocations])

    const handleBackToRooms = () => {
        router.push('/rooms')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <FourSquare
                    color="currentColor"
                    size="medium"
                    text=""
                    textColor=""
                    style={{ color: "var(--foreground)" }}
                />
            </div>
        )
    }

    const safeRoomUser = roomDetails?.room_user?.map((ru: any) => ({
        ...ru,
        user: {
            ...ru.user,
            created_at: ru.user.created_at instanceof Date ? ru.user.created_at.toISOString() : ru.user.created_at,
            updated_at: ru.user.updated_at instanceof Date ? ru.user.updated_at.toISOString() : ru.user.updated_at,
        }
    })) || []

    return (
        <SidebarProvider>
            <SidebarLeft roomUser={safeRoomUser} />
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToRooms}
                            className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Rooms
                        </Button>
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
                    <div className="bg-muted/50 mx-auto h-[100vh] w-full max-w-3xl rounded-xl p-4 relative z-0">
                        <MapComponent 
                            locations={userLocations} 
                            onPOIsUpdate={handlePOIsUpdate}
                        />
                    </div>
                </div>
            </SidebarInset>
            <SidebarRight 
                roomCode={roomDetails?.code} 
                ownerName={roomDetails?.owner?.name} 
                ownerImage={roomDetails?.owner?.image_url}
                pois={pois}
                poisLoading={poisLoading}
            />
        </SidebarProvider>
    )
}
