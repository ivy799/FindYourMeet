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
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
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
    <Sidebar
      className="border-r-0 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40"
      {...props}
    >
      <SidebarHeader className="px-4 pt-8">
        <div className="mt-12">
          <h3
            className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0
                       bg-gradient-to-r from-neutral-900 to-neutral-500/80 bg-clip-text text-transparent
                       dark:from-neutral-100 dark:to-neutral-300/70"
          >
            Users
          </h3>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <div className="p-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <SidebarInput
              placeholder="Search the users.."
              className="pl-9 h-9 rounded-lg bg-muted/40 border-muted/50 focus-visible:ring-2 focus-visible:ring-muted-foreground/20"
            />
          </div>
        </div>

        <div className="px-2.5 pb-2">
          <SidebarMenu>
            {roomUser && roomUser.length > 0 ? (
              roomUser.map((ru) => (
                <SidebarMenuItem key={ru.user.id}>
                  <SidebarMenuButton size="sm" className="gap-3 h-9" asChild={false}>
                    <>
                      <Avatar className="h-7 w-7 rounded-lg ring-1 ring-border" aria-label="User avatar">
                        <AvatarImage
                          src={ru.user.image_url || "/placeholder.svg"}
                          alt={ru.user.name ? `${ru.user.name} avatar` : "User avatar"}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-lg text-[10px] font-medium">
                          {ru.user.name
                            ? ru.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                            : "CN"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm font-medium">{ru.user.name || "Username"}</span>
                    </>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" disabled className="text-muted-foreground gap-2 h-9">
                  <Inbox className="h-4 w-4" aria-hidden="true" />
                  <span>No users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
