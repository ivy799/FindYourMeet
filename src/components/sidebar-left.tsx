"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  User,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarInput
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "User",
      url: "#",
      icon: User,
    },
  ],
}

interface roomUser {
  id: number
  room_id: number
  user: {
    clerk_user_id: string | null
    created_at: string
    email: string
    id: number
    image_url: string
    name: string
    role_id: number
    updated_at: string
  }
  user_id: number
}

interface sideBarLeftProps extends React.ComponentProps<typeof Sidebar> {
  roomUser?: roomUser[];
}

export function SidebarLeft({ roomUser, ...props }: sideBarLeftProps) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="mt-20">
          <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Users
          </h3>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2">
          <SidebarInput placeholder="Search the users.." />
        </div>
        {roomUser && roomUser.length > 0 ? (
          roomUser.map((ru) => (
            <Card className="w-full max-w-sm mb-2" key={ru.user.id}>
              <CardHeader>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={ru.user.image_url} />
                  <AvatarFallback className="rounded-lg">
                    {ru.user.name
                      ? ru.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "CN"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{ru.user.name || "Username"}</CardTitle>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <CardTitle>No users</CardTitle>
            </CardHeader>
          </Card>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
