'use client'

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarHeader, SidebarInput } from "@/components/ui/sidebar"
import type { POI } from "@/hooks/use-poi"
import { Check, Clock, Copy, MapPin, Search } from "lucide-react"
import type * as React from "react"
import { useMemo, useState } from "react"
import { FourSquare } from "react-loading-indicators"
import { toast } from "sonner"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"


interface sideBarRightProps extends React.ComponentProps<typeof Sidebar> {
  roomCode?: number
  ownerName?: string
  ownerImage?: string
  pois?: POI[]
  poisLoading?: boolean
  onPOIClick?: (poiId: string) => void
  highlightedPOI?: string | null
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

export function SidebarRight({ 
  roomCode, 
  ownerName, 
  ownerImage, 
  pois = [], 
  poisLoading = false, 
  onPOIClick,
  highlightedPOI,
  ...props 
}: sideBarRightProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Helper functions defined before they are used
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

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Unknown distance'
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }

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

  // Filter out POIs with invalid or unknown names
  const validPois = pois.filter(poi => 
    poi.name && 
    poi.name.trim() !== '' && 
    poi.name.toLowerCase() !== 'unknown' &&
    poi.name.toLowerCase() !== 'unnamed'
  )

  // Filter and sort POIs based on search query
  const filteredAndSortedPOIs = useMemo(() => {
    if (!validPois || validPois.length === 0) return []

    if (!searchQuery.trim()) {
      return [...validPois].sort((a, b) => {
        // Sort by distance first, then by name
        const distanceA = a.distance || 0
        const distanceB = b.distance || 0
        if (distanceA !== distanceB) {
          return distanceA - distanceB
        }
        return (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase())
      })
    }

    const query = searchQuery.toLowerCase().trim()

    const matchedPOIs = validPois.filter(poi => {
      const name = (poi.name || "").toLowerCase()
      const category = poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || poi.tags.office || 'other'
      const categoryDisplayName = getCategoryDisplayName(category).toLowerCase()
      
      return name.includes(query) || categoryDisplayName.includes(query)
    })

    return matchedPOIs.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase()
      const nameB = (b.name || "").toLowerCase()

      // Exact name match gets highest priority
      const aExactMatch = nameA === query
      const bExactMatch = nameB === query
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1

      // Name starts with query gets second priority
      const aStartsWith = nameA.startsWith(query)
      const bStartsWith = nameB.startsWith(query)
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1

      // Then sort by distance
      const distanceA = a.distance || 0
      const distanceB = b.distance || 0
      if (distanceA !== distanceB) {
        return distanceA - distanceB
      }

      // Finally by name alphabetically
      return nameA.localeCompare(nameB)
    })
  }, [validPois, searchQuery])

  const groupedPOIs = filteredAndSortedPOIs.reduce((acc, poi) => {
    const category = poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || poi.tags.office || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(poi)
    return acc
  }, {} as Record<string, POI[]>)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const handlePOICardClick = (poiId: string) => {
    if (onPOIClick) {
      // Toggle highlight: if already highlighted, unhighlight it
      if (highlightedPOI === poiId) {
        onPOIClick('');
      } else {
        onPOIClick(poiId);
      }
    }
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
      <SidebarContent className="px-1 ">
        <div className="space-y-1">
          <div className="flex items-center gap-2 pt-3">
            <MapPin className="size-4 text-sidebar-foreground/60" />
            <h3 className="text-sm font-semibold text-sidebar-foreground">
              Nearby Places
            </h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              {poisLoading ? "Loading..." : `${filteredAndSortedPOIs.length} places`}
            </Badge>
          </div>

          <div className="relative mb-5">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sidebar-foreground/40"
              aria-hidden="true"
            />
            <SidebarInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search places..."
              className="pl-9 h-10 rounded-xl bg-sidebar-accent/20 border border-sidebar-border focus-visible:ring-2 focus-visible:ring-sidebar-primary/20 text-sidebar-foreground placeholder:text-sidebar-foreground/40"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
                aria-label="Clear search"
              >
                <span className="text-xs">✕</span>
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="px-1">
              <p className="text-xs text-sidebar-foreground/60">
                {filteredAndSortedPOIs.length === 0
                  ? `No places found for "${searchQuery}"`
                  : `${filteredAndSortedPOIs.length} place(s) found for "${searchQuery}"`
                }
              </p>
            </div>
          )}

          {poisLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-sidebar-foreground/20 border-t-sidebar-foreground"></div>
            </div>
          ) : filteredAndSortedPOIs.length === 0 ? (
            <div className="text-center p-8 text-sidebar-foreground/60 text-sm">
              <FourSquare
                size="small"
                color="currentColor"
                text=""
                textColor=""
                style={{ color: "var(--foreground)" }}
              />
              <p className="mt-2">
                {searchQuery ? `No places found for "${searchQuery}"` : "No named places found nearby"}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-3 pr-1">
                {Object.entries(groupedPOIs).map(([category, categoryPOIs]) => (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-base">{POITypeIcons[category]?.icon || '📍'}</span>
                      <h4 className="text-xs font-medium text-sidebar-foreground/80 uppercase tracking-wider flex-1 min-w-0">
                        <span className="truncate block">
                          {searchQuery 
                            ? highlightText(getCategoryDisplayName(category), searchQuery)
                            : getCategoryDisplayName(category)
                          }
                        </span>
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs flex-shrink-0 ${searchQuery && categoryPOIs.some(() => 
                          getCategoryDisplayName(category).toLowerCase().includes(searchQuery.toLowerCase())
                        ) ? 'ring-1 ring-yellow-400/50' : ''}`}
                        style={{ borderColor: POITypeIcons[category]?.color || '#636e72' }}
                      >
                        {categoryPOIs.length}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      {categoryPOIs.slice(0, searchQuery ? categoryPOIs.length : 5).map((poi, index) => {
                        const isHighlighted = highlightedPOI === poi.id;
                        
                        return (
                          <div
                            key={poi.id}
                            onClick={() => handlePOICardClick(poi.id)}
                            className={`rounded-lg border border-sidebar-border bg-background/40 p-2 hover:bg-background/60 transition-all duration-200 cursor-pointer ${
                              isHighlighted
                                ? 'ring-1 ring-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600'
                                : searchQuery && index === 0 && categoryPOIs === Object.values(groupedPOIs)[0]
                                ? 'ring-1 ring-sidebar-primary/30 bg-sidebar-primary/5'
                                : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm text-foreground leading-tight break-words">
                                  {searchQuery
                                    ? highlightText(poi.name || "Unknown Place", searchQuery)
                                    : (poi.name || "Unknown Place")
                                  }
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="size-3 text-sidebar-foreground/40 flex-shrink-0" />
                                  <span className="text-xs text-sidebar-foreground/60">
                                    {formatDistance(poi.distance)}
                                  </span>
                                </div>
                                {isHighlighted && (
                                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                    📍 Selected
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <div
                                  className={`size-2.5 rounded-full border border-white shadow-sm ${
                                    isHighlighted ? 'ring-1 ring-yellow-400' : ''
                                  }`}
                                  style={{ backgroundColor: POITypeIcons[category]?.color || '#636e72' }}
                                />
                                {searchQuery && index === 0 && categoryPOIs === Object.values(groupedPOIs)[0] && !isHighlighted && (
                                  <span className="inline-flex items-center rounded-full bg-sidebar-primary/10 px-1 py-0.5 text-xs font-medium text-sidebar-primary">
                                    Best
                                  </span>
                                )}
                                {isHighlighted && (
                                  <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-1 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {!searchQuery && categoryPOIs.length > 5 && (
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
