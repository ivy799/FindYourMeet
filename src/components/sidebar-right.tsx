import type * as React from "react"
import { Sidebar, SidebarContent, SidebarSeparator } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Copy, User2 } from "lucide-react"

interface sideBarRightProps extends React.ComponentProps<typeof Sidebar> {
  roomCode?: number
  ownerName?: string
}

export function SidebarRight({ roomCode, ownerName, ...props }: sideBarRightProps) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l bg-sidebar text-sidebar-foreground lg:flex"
      {...props}
    >
      <SidebarContent className="relative gap-4 p-4">
        {/* Decorative gradient header glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-sidebar-primary/10 to-transparent"
        />

        {/* Owner / Host section */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-sidebar-accent/30">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <User2 className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">Host</div>
              <div className="truncate text-lg font-semibold">{ownerName}</div>
            </div>
          </div>
        </div>

        {/* Room code with copy action */}
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
              className="size-9 rounded-md border border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80"
              aria-label="Copy room code"
              title="Copy room code"
            >
              <Copy className="size-4" />
              <span className="sr-only">Copy room code</span>
            </Button>
          </div>
        </div>

        <SidebarSeparator className="mx-0" />
      </SidebarContent>
    </Sidebar>
  )
}
