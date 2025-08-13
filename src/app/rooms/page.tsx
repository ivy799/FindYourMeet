'use client'

// Define types for the data structures
interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

interface Room {
  id: string;
  name: string;
  code: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  owner_id: string;
  owner: User;
  room_user: Array<{
    id: string;
    room_id: string;
    user_id: string;
    joined_at: Date;
    user: User;
  }>;
}

interface JoinedRoom {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: Date;
  room: Room;
}

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import { ChevronRightIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FourSquare } from "react-loading-indicators"
import { toast } from "sonner"



export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const [logedUser, setLogedUser] = useState<User | null>(null)
  const [rooms, setRoom] = useState<Room[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<JoinedRoom[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [isLoadingJoinedRooms, setIsLoadingJoinedRooms] = useState(true)
  const [isMakeRoomButtonLoading, setIsMakeRoomButtonLoading] = useState(false)
  const [isJoinRoomButtonLoading, setIsJoinRoomButtonLoading] = useState(false)
  const [isMakeRoomButtonLoadingInDialog, setIsMakeRoomButtonLoadingInDialog] = useState(false)
  const [isJoinRoomButtonLoadingInDialog, setIsJoinRoomButtonLoadingInDialog] = useState(false)


  const isLoading = isLoadingRooms || isLoadingJoinedRooms

  useEffect(() => {
    const fetchUserAndRooms = async () => {
      setIsLoadingRooms(true)
      try {
        const roomsRes = await fetch('/api/room', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!roomsRes.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const roomsData = await roomsRes.json();
        setRoom(roomsData);
      } catch {
        console.error("Error fetching data");
      } finally {
        setIsLoadingRooms(false)
      }
    };

    fetchUserAndRooms();
  }, [])

  useEffect(() => {
    const fetchJoinedRoom = async () => {
      setIsLoadingJoinedRooms(true)
      try {

        const userRes = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await userRes.json();

        const joinedRoom = await fetch(`/api/room_user/${userData.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const fixJoinedRoom = await joinedRoom.json()
        setJoinedRoom(fixJoinedRoom)
        setLogedUser(userData)
      } catch {
        console.log("error fetching data")
      } finally {
        setIsLoadingJoinedRooms(false)
      }
    }

    fetchJoinedRoom()
  }, [])

  const makeRoom = async (name: string) => {
    if (!user) {
      console.error('User not authenticated or name is empty');
      return;
    }

    try {
      const userRes = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        throw new Error(`Failed to get user: ${userRes.status} ${errorText}`);
      }

      const userData = await userRes.json();
      console.log("User data:", userData);

      console.log("Creating room...");
      const roomData = {
        name: name,
        code: Math.floor(10000 + Math.random() * 90000),
        status: true,
        owner_id: userData.id,
      };
      console.log("Room data to send:", roomData);

      const roomRes = await fetch("/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData)
      });

      if (!roomRes.ok) {
        const errorData = await roomRes.json();
        throw new Error(`Failed to create room: ${roomRes.status} ${JSON.stringify(errorData)}`);
      }

      const room = await roomRes.json();
      console.log("Room created:", room);

      console.log("Adding user to room...");
      const roomUserData = {
        room_id: room.id,
        user_id: userData.id
      };
      console.log("Room user data to send:", roomUserData);

      const roomUserRes = await fetch("/api/room_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomUserData)
      });

      if (!roomUserRes.ok) {
        const errorData = await roomUserRes.json();
        throw new Error(`Failed to add user to room: ${roomUserRes.status} ${JSON.stringify(errorData)}`);
      }

      const dataUserRoom = await roomUserRes.json();
      console.log("User added to room:", dataUserRoom);

      return room.id

    } catch {
      console.error('Error creating room');
    }
  }

  const joinRoom = async (roomCode: number) => {
    if (!user) {
      console.error('User not authenticated or name is empty');
      return;
    }

    try {
      const userRes = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!userRes.ok) {
        const errorText = await userRes.text();
        throw new Error(`Failed to get user: ${userRes.status} ${errorText}`);
      }
      const userData = await userRes.json();
      console.log("User data:", userData);



      const findRoom = await fetch(`/api/room/find/${roomCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!findRoom.ok) {
        throw new Error("no room")
      }
      const fixRoom = await findRoom.json()


      const isUserAlreadyInRoom = fixRoom.room_user.some((roomUser: { user_id: string }) => roomUser.user_id === userData.id);
      if (isUserAlreadyInRoom) {
        toast("You have already joined this room")
        setIsJoinRoomButtonLoadingInDialog(false)
        setIsJoinDialogOpen(false)
        return null
      }


      const userAndRoomDetail = {
        room_id: fixRoom.id,
        user_id: userData.id
      };
      const makeNewRoomUser = await fetch("/api/room_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userAndRoomDetail)
      })
      if (!makeNewRoomUser.ok) {
        throw new Error("Failed to join Room")
      }
      const newUserRoomFix = await makeNewRoomUser.json()
      console.log(newUserRoomFix)
      return fixRoom.id
    } catch {

    }
  }

  const checkAddress = async () => {
    if (!user) {
      console.error('User not authenticated or name is empty');
      return;
    }

    try {
      const checkUserAddress = await fetch('/api/user_detail', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const checkUserAddressRes = await checkUserAddress.json()

      if (!checkUserAddressRes || !checkUserAddressRes.address) {
        toast('Please set your address first before create or join a room!');
        setIsMakeRoomButtonLoading(false)
        setIsJoinRoomButtonLoading(false)
        return false;
      }

      return true
    } catch {
      return false
    }
  }

  const handleCreateRoomClick = async () => {
    const isAddressValid = await checkAddress()
    if (isAddressValid) {
      setIsCreateDialogOpen(true)
      setIsMakeRoomButtonLoading(false)
    }
  }

  const handleJoinRoomClick = async () => {
    const isAddressValid = await checkAddress()
    if (isAddressValid) {
      setIsJoinDialogOpen(true)
      setIsJoinRoomButtonLoading(false)
    }
  }

  const handleGoToRoom = (id: number) => {
    router.push(`/rooms/${id}`)
  }

  if (isLoading) {
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


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-lg font-semibold">Rooms</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <span className="block text-xs text-muted-foreground mt-1">Create and join rooms easily</span>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 p-4 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
          <div className="grid auto-rows-min gap-4 md:grid-cols-1">
            <div className="aspect-[32/9] rounded-xl border border-foreground/10 bg-muted/40 shadow-sm dark:bg-muted/30 flex items-center justify-center p-4 md:p-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Button
                  type="button"
                  disabled={isMakeRoomButtonLoading}
                  variant="outline"
                  aria-label="Open create room dialog"
                  className={`relative overflow-hidden transition-all duration-200 ease-out border-foreground/25 hover:border-foreground/50 focus-visible:ring-2 focus-visible:ring-foreground/40 active:scale-[0.98] data-[state=open]:ring-2 data-[state=open]:ring-foreground/40`}
                  onClick={() => {
                    setIsMakeRoomButtonLoading(true)
                    handleCreateRoomClick()
                  }}
                >
                  <span className="pointer-events-none">Make Room</span>
                  {isMakeRoomButtonLoading && (
                    <Loader2Icon className="animate-spin" />
                  )}
                </Button>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogContent className="sm:max-w-[425px] bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur border border-foreground/10 shadow-lg">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get("name") as string;
                        const room_id = await makeRoom(name);
                        setIsMakeRoomButtonLoadingInDialog(false)
                        setIsCreateDialogOpen(false);
                        handleGoToRoom(room_id)
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Room Details</DialogTitle>
                        <DialogDescription>
                          {'Masukkan detail room kamu'}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4">
                        <div className="grid gap-3 py-3">
                          <Input
                            id="name-1"
                            placeholder="Room Name"
                            required
                            name="name"
                            className="transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/30"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            type="button"
                            className="transition-transform active:scale-[0.98]"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="transition-all duration-200 ease-out hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/40 active:scale-[0.98]"
                          onClick={() => setIsMakeRoomButtonLoadingInDialog(true)}
                        >
                          Create Room
                          {isMakeRoomButtonLoadingInDialog && (
                            <Loader2Icon className="animate-spin" />
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center gap-2">
                  <span className="h-px flex-1 bg-foreground/10 dark:bg-foreground/20" />
                  <span className="text-xs font-semibold text-muted-foreground select-none">or</span>
                  <span className="h-px flex-1 bg-foreground/10 dark:bg-foreground/20" />
                </div>
                <Button
                  aria-label="Open join room dialog"
                  disabled={isJoinRoomButtonLoading}
                  className="transition-all duration-200 ease-out hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/40 active:scale-[0.98] border-foreground/25 hover:border-foreground/50 data-[state=open]:ring-2 data-[state=open]:ring-foreground/40"
                  onClick={() => {
                    setIsJoinRoomButtonLoading(true)
                    handleJoinRoomClick()
                  }}
                >
                  Join Room
                  {isJoinRoomButtonLoading && (
                    <Loader2Icon className="animate-spin" />
                  )}
                </Button>
                <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                  <DialogContent className="sm:max-w-[425px] bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur border border-foreground/10 shadow-lg">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const roomCodeStr = formData.get("roomCode") as string;
                        const roomCode = Number(roomCodeStr);
                        console.log(roomCode);
                        const roomId = await joinRoom(roomCode);
                        setIsJoinRoomButtonLoadingInDialog(false)
                        setIsJoinDialogOpen(false)
                        if (roomId !== null) {
                          handleGoToRoom(roomId)
                        }
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Enter Room Code</DialogTitle>
                      </DialogHeader>

                      <div className="p-6 md:p-10 flex justify-center">
                        <InputOTP
                          maxLength={5}
                          name="roomCode"
                          className="gap-2"
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot
                              index={0}
                              className="transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/30"
                            />
                            <InputOTPSlot
                              index={1}
                              className="transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/30"
                            />
                            <InputOTPSlot
                              index={2}
                              className="transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/30"
                            />
                            <InputOTPSlot
                              index={3}
                              className="transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/30"
                            />
                            <InputOTPSlot
                              index={4}
                              className="transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/30"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="transition-transform active:scale-[0.98]"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="transition-all duration-200 ease-out hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/40 active:scale-[0.98]"
                          onClick={() => setIsJoinRoomButtonLoadingInDialog(true)}
                        >
                          Join Room
                          {isJoinRoomButtonLoadingInDialog && (
                            <Loader2Icon className="animate-spin" />
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <div className="flex-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-lg font-semibold">My Rooms</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <span className="block text-xs text-muted-foreground mt-1">List of rooms you have created</span>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {rooms && rooms.length > 0 ? (
              rooms.map((room: Room) => (
                <Card
                  className="w-full max-w-sm transition-transform hover:scale-[1.03] hover:shadow-xl border border-foreground/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black group"
                  key={room.id}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 12h8M12 8v8" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{room.name}</CardTitle>
                        <CardDescription className="text-xs mt-1 text-muted-foreground">Kode: <span className="font-mono tracking-wider">{room.code}</span></CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex-col gap-2 pt-0">
                    <Link href={`/rooms/${room.id}`}>
                      <Button
                        type="button"
                        className="w-full flex items-center justify-between cursor-pointer"
                        variant="outline"
                        onMouseEnter={e => e.currentTarget.classList.add('ring-2', 'ring-primary')}
                        onMouseLeave={e => e.currentTarget.classList.remove('ring-2', 'ring-primary')}
                      >
                        <span>See Details</span>
                        <ChevronRightIcon className="ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center p-12 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-muted-foreground/60"
                    >
                      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                      <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                      <circle cx="12" cy="11" r="2" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-muted-foreground/20 flex items-center justify-center">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">No Created Rooms</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    You haven&apos;t create any rooms yet. Create a new room to get started.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/20"></div>
                  <span className="font-medium">Start exploring</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/20"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 12H8M12 8v8" />
              </svg>
            </div>
            <div className="flex-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-lg font-semibold">Joined Rooms</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <span className="block text-xs text-muted-foreground mt-1">List of rooms you have joined</span>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {joinedRoom && joinedRoom.length > 0 && logedUser ? (
              (() => {
                const filteredRooms = joinedRoom.filter((joinedRoom: JoinedRoom) => joinedRoom.room?.owner_id !== logedUser?.id);
                return filteredRooms.length > 0 ? (
                  filteredRooms.map((joinedRoom: JoinedRoom) => (
                    <Card
                      className="w-full max-w-sm transition-transform hover:scale-[1.03] hover:shadow-xl border border-foreground/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black group"
                      key={joinedRoom.room.id}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M8 12h8M12 8v8" />
                            </svg>
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                              {joinedRoom.room.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1 text-muted-foreground">
                              Kode: <span className="font-mono tracking-wider">{joinedRoom.room.code}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex-col gap-2 pt-0">
                        <Link href={`/rooms/${joinedRoom.room.id}`}>
                          <Button
                            type="button"
                            className="w-full flex items-center justify-between"
                            variant="outline"
                            onMouseEnter={e => e.currentTarget.classList.add('ring-2', 'ring-primary')}
                            onMouseLeave={e => e.currentTarget.classList.remove('ring-2', 'ring-primary')}
                          >
                            <span>See Detail</span>
                            <ChevronRightIcon className="ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center p-12 space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                        <svg
                          width="32"
                          height="32"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-muted-foreground/60"
                        >
                          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                          <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                          <circle cx="12" cy="11" r="2" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-muted-foreground/20 flex items-center justify-center">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">No Joined Rooms</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        You haven&apos;t joined any rooms yet. join an existing one to get started.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                      <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/20"></div>
                      <span className="font-medium">Start exploring</span>
                      <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/20"></div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center p-12 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-muted-foreground/60"
                    >
                      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                      <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                      <circle cx="12" cy="11" r="2" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-muted-foreground/20 flex items-center justify-center">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">No Joined Rooms</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    You haven&apos;t joined any rooms yet. join an existing one to get started.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/20"></div>
                  <span className="font-medium">Start exploring</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/20"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

