'use client'

import type * as React from "react"
import { Sidebar, SidebarContent, SidebarSeparator } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { Avatar, AvatarImage } from "./ui/avatar"
import { useState } from "react"
import { toast } from "sonner"

interface sideBarRightProps extends React.ComponentProps<typeof Sidebar> {
  roomCode?: number
  ownerName?: string
  ownerImage?: string
}

export function SidebarRight({ roomCode, ownerName, ownerImage, ...props }: sideBarRightProps) {

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

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l bg-sidebar text-sidebar-foreground lg:flex"
      {...props}
    >
      <SidebarContent className="relative gap-4 p-4">
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

        <SidebarSeparator className="mx-0" />
      </SidebarContent>
    </Sidebar>
  )
}
