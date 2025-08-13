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
import { ModernLogo } from "./ui/modern-logo";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)

    const closeSheet = () => setIsOpen(false)

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 h-16 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-border transition-all duration-100">
            <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-center h-8 w-8 bg-gray-50 dark:bg-gray-800 rounded">
                        <ModernLogo className="h-6 w-6" />
                    </div>
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
                                                className="relative flex h-full w-full select-none flex-col justify-end rounded-md overflow-hidden p-6 no-underline outline-none focus:shadow-md group"
                                                href="/"
                                            >
                                                <div className="absolute inset-0 bg-white dark:bg-black">
                                                    <div className="absolute inset-0 opacity-10 dark:opacity-20">
                                                        <svg width="100%" height="100%" className="absolute inset-0">
                                                            <defs>
                                                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                                                </pattern>
                                                            </defs>
                                                            <rect width="100%" height="100%" fill="url(#grid)" className="text-black dark:text-white" />
                                                        </svg>
                                                    </div>

                                                    <div className="absolute inset-0">
                                                        <div className="absolute top-4 right-4 w-8 h-8 border border-black/20 dark:border-white/20 rounded-full animate-pulse" />

                                                        <div
                                                            className="absolute top-12 left-8 w-4 h-4 bg-black/10 dark:bg-white/10 rotate-45 animate-bounce"
                                                            style={{ animationDuration: "3s" }}
                                                        />

                                                        <div
                                                            className="absolute bottom-16 right-8 w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-black/20 dark:border-b-white/20 animate-pulse"
                                                            style={{ animationDelay: "1s" }}
                                                        />

                                                        <div
                                                            className="absolute bottom-8 left-4 w-6 h-6 border-2 border-black/15 dark:border-white/15 rounded-full animate-spin"
                                                            style={{ animationDuration: "8s" }}
                                                        />

                                                        <div
                                                            className="absolute top-1/2 right-2 w-2 h-8 bg-black/10 dark:bg-white/10 animate-pulse"
                                                            style={{ animationDelay: "2s" }}
                                                        />
                                                    </div>

                                                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                                                        <svg width="100%" height="100%" className="absolute inset-0">
                                                            <line
                                                                x1="0"
                                                                y1="0"
                                                                x2="100%"
                                                                y2="100%"
                                                                stroke="currentColor"
                                                                strokeWidth="1"
                                                                className="text-black dark:text-white"
                                                            />
                                                            <line
                                                                x1="0"
                                                                y1="50%"
                                                                x2="50%"
                                                                y2="0"
                                                                stroke="currentColor"
                                                                strokeWidth="0.5"
                                                                className="text-black dark:text-white"
                                                            />
                                                            <line
                                                                x1="50%"
                                                                y1="100%"
                                                                x2="100%"
                                                                y2="50%"
                                                                stroke="currentColor"
                                                                strokeWidth="0.5"
                                                                className="text-black dark:text-white"
                                                            />
                                                        </svg>
                                                    </div>

                                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5" />
                                                </div>

                                                <div className="relative z-10">
                                                    <div className="mb-2 mt-4 text-lg font-medium text-black dark:text-white">FindYourMeet</div>
                                                    <p className="text-sm leading-tight text-black/70 dark:text-white/70">
                                                        Find and book perfect meeting spaces for your team.
                                                    </p>
                                                </div>

                                                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/rooms" title="Browse Rooms">
                                        Create and Explore available rooms.
                                    </ListItem>
                                    <ListItem href="/#faq" title="Help Center">
                                        Get support and find answers to your questions.
                                    </ListItem>
                                    <ListItem href="/#pricing" title="Contact">
                                        Reach out to us for partnership, feedback, or any inquiries. We're here to help!
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href={{ pathname: "/", hash: "about" }}>About</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href={{ pathname: "/", hash: "pricing" }}>Pricing</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href={{ pathname: "/", hash: "service" }}>Service</Link>
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
