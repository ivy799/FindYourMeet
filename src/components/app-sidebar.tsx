'use client'

import * as React from "react"
import { Edit } from "lucide-react"

import { DatePicker } from "@/components/date-picker"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
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
import { useUser } from "@clerk/nextjs"
import { useState } from "react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const [address, setAddress] = useState<string | undefined>()

  const addAddress = async (address: string) => {
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

      const userDetailData = {
        user_id: userData.id,
        address: address,
      };

      const addUserDetail = await fetch('/api/user_detail', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetailData)
      })

      const userDetail = await addUserDetail.json()
      if (!userDetail) {
        throw Error
      }

      setAddress(address)
    } catch (error) {
      console.log("error adding address")
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
      </SidebarHeader>
      <SidebarContent>
        <h3 className="scroll-m-20 text-sm font-semibold uppercase tracking-wider text-muted-foreground">My Address</h3>
        <div className="mt-3 rounded-lg border border-sidebar-border bg-background/60 p-3 shadow-sm transition-colors hover:bg-background/80">
          <div className="flex items-center gap-2">
            <h5 className="scroll-m-20 text-base font-semibold tracking-tight">{address}</h5>
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto rounded-full border-dashed px-2.5 shadow-none hover:bg-muted/60 bg-transparent"
                    aria-label="Edit address"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[480px]">
                  <form action="submit"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const inputAddress = formData.get("address") as string;
                      await addAddress(inputAddress);
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-lg">Edit Address</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Make changes to your address here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="address-1">Address</Label>
                        <Input id="address-1" name="address" placeholder="Enter your address here" className="h-10" />
                      </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-3">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" className="shadow-sm">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
