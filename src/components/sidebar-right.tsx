'use client'

import type * as React from "react"
import { Sidebar, SidebarContent, SidebarSeparator, SidebarHeader } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Copy, Check, MapPin, Clock, Star } from "lucide-react"
import { Avatar, AvatarImage } from "./ui/avatar"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import type { POI } from "@/hooks/use-poi"
import { FourSquare } from "react-loading-indicators";


interface sideBarRightProps extends React.ComponentProps<typeof Sidebar> {
  roomCode?: number
  ownerName?: string
  ownerImage?: string
  pois?: POI[]
  poisLoading?: boolean
}

const POITypeIcons: Record<string, { icon: string; color: string }> = {
  'restaurant': { icon: '🍽️', color: '#ff6b6b' },
  'cafe': { icon: '☕', color: '#feca57' },
  'bar': { icon: '🍺', color: '#ff9ff3' },
  'fast_food': { icon: '🍔', color: '#ff7675' },
  'hotel': { icon: '🏨', color: '#74b9ff' },
  'mall': { icon: '🏬', color: '#a29bfe' },
  'supermarket': { icon: '🛒', color: '#fd79a8' },
  'park': { icon: '🌳', color: '#00b894' },
  'cinema': { icon: '🎬', color: '#e17055' },
  'museum': { icon: '🏛️', color: '#fdcb6e' },
  'office': { icon: '🏢', color: '#636e72' },
  'other': { icon: '📍', color: '#636e72' }
}

export function SidebarRight({ roomCode, ownerName, ownerImage, pois = [], poisLoading = false, ...props }: sideBarRightProps) {

  const [isCopied, setIsCopied] = useState(false)

  const handleCopyRoomCode = async () => {
    if (!roomCode) {
      console.log("no code to copy")
      return
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(roomCode.toString())
        console.log('Room code copied to clipboard:', roomCode)
      }
      else {
        const textArea = document.createElement('textarea')
        textArea.value = roomCode.toString()
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)

        if (!successful) {
          throw new Error('Failed to copy using fallback method')
        }

        console.log('Room code copied to clipboard (fallback):', roomCode)
      }

      setIsCopied(true)
      toast.success("Room Code Copied")

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy room code:', error)
    }
  }

  const groupedPOIs = pois.reduce((acc, poi) => {
    const category = poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || poi.tags.office || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(poi)
    return acc
  }, {} as Record<string, POI[]>)

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Unknown distance'
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      'restaurant': 'Restaurants',
      'cafe': 'Cafes',
      'bar': 'Bars & Pubs',
      'fast_food': 'Fast Food',
      'hotel': 'Hotels',
      'mall': 'Shopping Centers',
      'supermarket': 'Supermarkets',
      'park': 'Parks',
      'cinema': 'Entertainment',
      'museum': 'Museums',
      'office': 'Offices',
      'other': 'Other Places'
    }
    return names[category] || category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l bg-sidebar text-sidebar-foreground lg:flex"
      {...props}
    >
      <SidebarHeader className="p-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-sidebar-primary/10 to-transparent"
        />

        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-sidebar-accent/30">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <Avatar>
                <AvatarImage
                  src={ownerImage}
                  className="object-cover"
                />
              </Avatar>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">Host</div>
              <div className="truncate text-lg font-semibold">{ownerName}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sidebar-border bg-background/70 p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
                Room Code
              </span>
              <code className="max-w-[10rem] truncate rounded-md bg-muted px-2 py-1 font-mono text-sm text-foreground/90">
                {roomCode}
              </code>
            </div>
            <Button
              variant="secondary"
              size="icon"
              className={`size-9 rounded-md border transition-all duration-200 ${isCopied
                ? 'border-green-300 bg-green-100 text-green-700 hover:bg-green-200 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80'
                }`}
              onClick={handleCopyRoomCode}
              disabled={!roomCode}
              aria-label={isCopied ? "Room code copied!" : "Copy room code"}
              title={isCopied ? "Room code copied!" : "Copy room code"}
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              <span className="sr-only">
                {isCopied ? "Room code copied to clipboard" : "Copy room code"}
              </span>
            </Button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-3">
            <MapPin className="size-4 text-sidebar-foreground/60" />
            <h3 className="text-sm font-semibold text-sidebar-foreground">
              Nearby Places
            </h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              {poisLoading ? "Loading..." : `${pois.length} places`}
            </Badge>
          </div>

          {poisLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-sidebar-foreground/20 border-t-sidebar-foreground"></div>
            </div>
          ) : pois.length === 0 ? (
            <div className="text-center p-8 text-sidebar-foreground/60 text-sm">
              <FourSquare
                size="small"
                color="currentColor"
                text=""
                textColor=""
                style={{ color: "var(--foreground)" }}
              />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4">
                {Object.entries(groupedPOIs).map(([category, categoryPOIs]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-lg">{POITypeIcons[category]?.icon || '📍'}</span>
                      <h4 className="text-xs font-medium text-sidebar-foreground/80 uppercase tracking-wider">
                        {getCategoryDisplayName(category)}
                      </h4>
                      <Badge
                        variant="outline"
                        className="ml-auto text-xs"
                        style={{ borderColor: POITypeIcons[category]?.color || '#636e72' }}
                      >
                        {categoryPOIs.length}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      {categoryPOIs.slice(0, 5).map((poi) => (
                        <div
                          key={poi.id}
                          className="rounded-lg border border-sidebar-border bg-background/40 p-2 hover:bg-background/60 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-foreground truncate">
                                {poi.name || 'Unknown Place'}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="size-3 text-sidebar-foreground/40" />
                                <span className="text-xs text-sidebar-foreground/60">
                                  {formatDistance((poi as any).distance)}
                                </span>
                              </div>
                            </div>
                            <div
                              className="size-3 rounded-full border border-white shadow-sm flex-shrink-0"
                              style={{ backgroundColor: POITypeIcons[category]?.color || '#636e72' }}
                            />
                          </div>
                        </div>
                      ))}

                      {categoryPOIs.length > 5 && (
                        <div className="text-xs text-sidebar-foreground/60 text-center p-2">
                          +{categoryPOIs.length - 5} more places
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
