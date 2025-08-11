'use client'

import * as React from "react"
import { Edit } from "lucide-react"

import { Calendar } from "./ui/calendar"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
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
import { useState, useEffect } from "react"
import { BlinkBlur } from "react-loading-indicators";
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const [address, setAddress] = useState<string | undefined>()
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const router = useRouter()

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {

        const addUserDetail = await fetch('/api/user_detail', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const userDetail = await addUserDetail.json()
        if (!userDetail) {
          throw Error
        }

        setAddress(userDetail.address)
      } catch (error) {

      }
    };
    fetchUserDetail();
  }, [])

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

    } catch (error) {
      console.log("error adding address")
    }
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-4 pt-8 border-b-0">
        <div className="mt-12">
          <h3
            className="scroll-m-20 pb-2 text-lg font-bold tracking-tight first:mt-0
             bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent "
          >
            Address Details
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="p-2 gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs px-0 h-auto font-normal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-1">
          <div className="rounded-xl border border-sidebar-border bg-background/80 p-4 shadow transition-colors hover:bg-background/90 flex flex-col items-center justify-between">
            <div className="flex items-center gap-3">
            </div>
            <Dialog>
              <div className="flex flex-row items-center w-full justify-between">
                <span className="text-base font-medium text-foreground break-words max-w-[140px]">
                  {address || <BlinkBlur
                    size="small"
                    color="currentColor"
                    text=""
                    textColor=""
                    speedPlus={2}
                    style={{ color: "var(--foreground)" }} />}
                </span>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 rounded-full border border-input bg-transparent hover:bg-muted transition-colors"
                    aria-label="Edit address"
                  >
                    <Edit className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] bg-background border border-sidebar-border rounded-xl shadow-xl">
                  <form
                    action="submit"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const inputAddress = formData.get("address") as string;
                      await addAddress(inputAddress);
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">Edit Address</DialogTitle>
                      <DialogDescription className="text-sm text-muted-foreground">
                        Update your address below and click save.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 grid gap-3">
                      <Label htmlFor="address-1" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="address-1"
                        name="address"
                        placeholder="Enter your address"
                        className="h-10 bg-background border border-input rounded-md px-3 text-foreground"
                        defaultValue={address}
                        autoComplete="off"
                      />
                    </div>
                    <DialogFooter className="mt-6 flex gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="w-24">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="w-32 shadow-sm">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm p-2 mt-3"
                captionLayout="dropdown"
              />
            </Dialog>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
