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
  SidebarRail,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import { useState, useMemo } from "react"

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
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search the users.."
              className="pl-9 h-9 rounded-lg bg-muted/40 border-muted/50 focus-visible:ring-2 focus-visible:ring-muted-foreground/20"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <span className="text-xs">✕</span>
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 px-1">
              <p className="text-xs text-muted-foreground">
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
                      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded">
                        {part}
                      </mark>
                    ) : part
                  )
                }

                return (
                  <SidebarMenuItem key={ru.user.id}>
                    <SidebarMenuButton
                      size="sm"
                      className={`gap-3 h-9 ${searchQuery && index === 0 ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
                      asChild={false}
                    >
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
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="truncate text-sm font-medium">
                            {searchQuery
                              ? highlightText(ru.user.name || "Username", searchQuery)
                              : (ru.user.name || "Username")
                            }
                          </span>
                          {searchQuery && ru.user.email && ru.user.email.toLowerCase().includes(searchQuery.toLowerCase()) && (
                            <span className="truncate text-xs text-muted-foreground">
                              {highlightText(ru.user.email, searchQuery)}
                            </span>
                          )}
                        </div>
                        {searchQuery && index === 0 && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
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
                <SidebarMenuButton size="sm" disabled className="text-muted-foreground gap-2 h-9">
                  <Inbox className="h-4 w-4" aria-hidden="true" />
                  <span>{searchQuery ? "No matching users" : "No users"}</span>
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
