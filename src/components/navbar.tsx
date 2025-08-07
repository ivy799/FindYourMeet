"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    navigationMenuTriggerStyle,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import * as React from "react"
import Link from "next/link"
import { ModeToggle } from '@/components/mode-toggle'
import { Menu } from 'lucide-react'

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)

    const closeSheet = () => setIsOpen(false)

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 h-16 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-border transition-all duration-100">
            <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8z" />
                    </svg>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">FindYourMeet</span>
            </div>

            <div className="hidden lg:block">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="/"
                                            >
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    FindYourMeet
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Find and book perfect meeting spaces for your team.
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/rooms" title="Browse Rooms">
                                        Explore available meeting rooms and spaces.
                                    </ListItem>
                                    <ListItem href="/booking" title="Book Now">
                                        Reserve your ideal meeting space instantly.
                                    </ListItem>
                                    <ListItem href="/help" title="Help Center">
                                        Get support and find answers to your questions.
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/about">About</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/pricing">Pricing</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/service">Service</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="hidden md:flex items-center space-x-2">
                <ModeToggle />
                <SignedOut>
                    <SignInButton>
                        <Button variant="ghost" size="sm">Sign In</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button size="sm">Sign Up</Button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            <div className="flex md:hidden items-center space-x-2">
                <ModeToggle />
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="lg:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px]">
                        <VisuallyHidden>
                            <SheetTitle>Navigation Menu</SheetTitle>
                        </VisuallyHidden>
                        <div className="flex flex-col space-y-4 mt-6">
                            <div className="flex flex-col space-y-3 p-5">
                                <Link 
                                    href="/" 
                                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    onClick={closeSheet}
                                >
                                    Home
                                </Link>
                                <Link 
                                    href="/about" 
                                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    onClick={closeSheet}
                                >
                                    About
                                </Link>
                                <Link 
                                    href="/pricing" 
                                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    onClick={closeSheet}
                                >
                                    Pricing
                                </Link>
                                <Link 
                                    href="/service" 
                                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    onClick={closeSheet}
                                >
                                    Service
                                </Link>
                            </div>

                            <div className="border-t pt-4 mt-6 p-5">
                                <SignedOut>
                                    <div className="flex flex-col space-y-2">
                                        <SignInButton>
                                            <Button variant="outline" className="w-full" onClick={closeSheet}>
                                                Sign In
                                            </Button>
                                        </SignInButton>
                                        <SignUpButton>
                                            <Button className="w-full" onClick={closeSheet}>
                                                Sign Up
                                            </Button>
                                        </SignUpButton>
                                    </div>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex items-center space-x-2">
                                        <UserButton />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Account</span>
                                    </div>
                                </SignedIn>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link 
                    href={href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
