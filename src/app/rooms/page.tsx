'use client'

import { AppSidebar } from "@/components/app-sidebar"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useUser } from "@clerk/nextjs"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronRightIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"


export default function Page() {
  const { user } = useUser()
  const [rooms, setRoom] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState([])

  useEffect(() => {
    const fetchUserAndRooms = async () => {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndRooms();
  }, [])

  useEffect(() => {
    const fetchJoinedRoom = async () => {
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
      } catch (error) {

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

    } catch (error) {
      console.error('Error creating room:', error);
    }
  }

  const joinRoom = async (roomCode: number) => {
    if (!user) {
      console.error('User not authenticated or name is empty');
      return;
    }

    try {
      // getting user
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


      // getting room by code
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
      console.log(fixRoom)


      // create new user_room data
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


    } catch (error) {

    }
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
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Rooms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-1">
            <div className="bg-muted/50 aspect-[32/9] rounded-xl flex items-center justify-center">
              <div className="flex h-5 items-center space-x-4 text-sm">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      Make Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get("name") as string;
                        await makeRoom(name);
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Room Details</DialogTitle>
                        <DialogDescription>
                          Masukkan detail room kamu
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="name-1">Name</Label>
                          <Input
                            id="name-1"
                            placeholder="Room Name"
                            required
                            name="name"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">
                          Create Room
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Separator orientation="vertical" />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Join Room</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const roomCodeStr = formData.get("roomCode") as string;
                        const roomCode = Number(roomCodeStr);
                        console.log(roomCode)
                        await joinRoom(roomCode);
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Enter Room Code</DialogTitle>
                      </DialogHeader>
                      <div className="p-10 flex justify-center">
                        <InputOTP maxLength={5} name="roomCode">
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Join Room</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>My Rooms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {rooms && rooms.length > 0 ? (
              rooms.map((room: any) => (
                <Card className="w-full max-w-sm" key={room.id}>
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                    <CardDescription>Kode: {room.code}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex-col gap-2">
                    <Link href={`/rooms/${room.id}`}>
                      <Button type="button" className="w-full">
                        See Detail <ChevronRightIcon />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No rooms found.
              </div>
            )}
          </div>
        </div>

        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Joined Rooms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {joinedRoom && joinedRoom.length > 0 ? (
              joinedRoom.map((joinedRoom: any) => (
                <Card className="w-full max-w-sm" key={joinedRoom.room.id}>
                  <CardHeader>
                    <CardTitle>{joinedRoom.room.name}</CardTitle>
                    <CardDescription>Kode: {joinedRoom.room.code}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex-col gap-2">
                    <Link href={`/rooms/${joinedRoom.room.id}`}>
                      <Button type="button" className="w-full">
                        See Detail <ChevronRightIcon />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No rooms found.
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

