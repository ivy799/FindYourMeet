import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { Copy } from "lucide-react"

interface sideBarRightProps extends React.ComponentProps<typeof Sidebar>{
  roomCode?: number;
  ownerName?: string;
}

export function SidebarRight({roomCode, ownerName,...props }: sideBarRightProps) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarContent>
        <div className="text-lg font-semibold">{ownerName}</div>
        <div className="flex justify-around">
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {roomCode}
          </p>
          <Button variant="secondary" size="icon" className="size-8">
            <Copy />
          </Button>
        </div>
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
    </Sidebar>
  )
}
