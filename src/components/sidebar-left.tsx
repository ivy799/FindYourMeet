"use client"

import * as React from "react"
import {
  Inbox,
  Search,
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
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

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

  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const filteredAndSortedUser = useMemo(() => {
    if (!roomUser || roomUser.length === 0) return []

    if (!searchQuery.trim()) {
      return [...roomUser].sort((a, b) =>
        (a.user.name || "").toLowerCase().localeCompare((b.user.name || "").toLowerCase())
      )
    }

    const query = searchQuery.toLowerCase().trim()

    const matchedUser = roomUser?.filter(ru => {
      const name = (ru.user.name || "").toLowerCase()
      return name.includes(query)
    })

    return matchedUser.sort((a, b) => {
      const nameA = (a.user.name || "").toLowerCase()
      const nameB = (b.user.name || "").toLowerCase()

      const aExactMatch = nameA === query
      const bExactMatch = nameB === query
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1

      const aStartsWith = nameA.startsWith(query)
      const bStartsWith = nameB.startsWith(query)
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1

      return nameA.localeCompare(nameB)
    })

  }, [roomUser, searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handleBackToRooms = () => {
    router.push('/rooms')
  }

  return (
    <Sidebar
      className="border-r-0 bg-white/80 dark:bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60 shadow-lg"
      {...props}
    >
      <SidebarHeader className="px-4 pt-8 border-b-0">
        <div className="mt-12">
          <h3
            className="scroll-m-20 pb-2 text-lg font-bold tracking-tight first:mt-0
             bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent "
          >
            Users Details
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToRooms}
            className="p-2 gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs px-0 h-auto font-normal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to rooms
          </Button>
        </div>
      </SidebarHeader>
      <div className="p-2 flex-1 flex flex-col h-full">
        <SidebarContent className="gap-0 rounded-xl border border-sidebar-border bg-background/70 p-1 shadow-sm">
          <div className="p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/40 dark:text-white/40"
                aria-hidden="true"
              />
              <SidebarInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search the users.."
                className="pl-9 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <span className="text-xs">✕</span>
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 px-1">
                <p className="text-xs text-black/60 dark:text-white/60">
                  {filteredAndSortedUser.length === 0
                    ? `No users found for "${searchQuery}"`
                    : `${filteredAndSortedUser.length} user(s) found for "${searchQuery}"`
                  }
                </p>
              </div>
            )}
          </div>

          <div className="px-2.5 pb-2">
            <SidebarMenu>
              {filteredAndSortedUser.length > 0 ? (
                filteredAndSortedUser.map((ru, index) => {
                  const highlightText = (text: string, query: string) => {
                    if (!query.trim()) return text

                    const regex = new RegExp(`(${query})`, 'gi')
                    const parts = text.split(regex)

                    return parts.map((part, i) =>
                      regex.test(part) ? (
                        <mark key={i} className="bg-black/10 dark:bg-white/20 px-0.5 rounded">
                          {part}
                        </mark>
                      ) : part
                    )
                  }

                  return (
                    <SidebarMenuItem key={ru.user.id}>
                      <SidebarMenuButton
                        size="sm"
                        className={`gap-3 h-11 rounded-xl transition-all duration-150 hover:bg-black/10 dark:hover:bg-white/10 ${searchQuery && index === 0 ? 'ring-2 ring-black/20 dark:ring-white/20 bg-black/5 dark:bg-white/5' : ''}`}
                        asChild={false}
                      >
                        <>
                          <Avatar className="h-8 w-8 ring-2 ring-black/10 dark:ring-white/10 bg-white dark:bg-black" aria-label="User avatar">
                            <AvatarImage
                              src={ru.user.image_url || "/placeholder.svg"}
                              alt={ru.user.name ? `${ru.user.name} avatar` : "User avatar"}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg text-[10px] font-medium bg-black/10 dark:bg-white/10 text-black dark:text-white">
                              {ru.user.name
                                ? ru.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                : "CN"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="truncate text-sm font-semibold text-black dark:text-white">
                              {searchQuery
                                ? highlightText(ru.user.name || "Username", searchQuery)
                                : (ru.user.name || "Username")
                              }
                            </span>
                            {searchQuery && ru.user.email && ru.user.email.toLowerCase().includes(searchQuery.toLowerCase()) && (
                              <span className="truncate text-xs text-black/60 dark:text-white/60">
                                {highlightText(ru.user.email, searchQuery)}
                              </span>
                            )}
                          </div>
                          {searchQuery && index === 0 && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs font-medium text-black dark:text-white">
                                Best match
                              </span>
                            </div>
                          )}
                        </>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton size="sm" disabled className="text-black/40 dark:text-white/40 gap-2 h-11 rounded-xl">
                    <Inbox className="h-4 w-4" aria-hidden="true" />
                    <span>{searchQuery ? "No matching users" : "No users"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  )
}
