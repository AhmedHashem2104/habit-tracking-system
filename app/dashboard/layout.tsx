"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart3, Calendar, Home, LogOut, Menu, Plus, Settings, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 text-lg font-semibold ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
                <span>Home</span>
              </Link>
              <Link
                href="/dashboard/habits"
                className={`flex items-center gap-2 ${
                  pathname === "/dashboard/habits" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Habits</span>
              </Link>
              <Link
                href="/dashboard/calendar"
                className={`flex items-center gap-2 ${
                  pathname === "/dashboard/calendar" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Calendar</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-2 ${
                  pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-primary">Smart Habit Tracker</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <Link
            href="/dashboard"
            className={`text-sm font-medium ${
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            Home
          </Link>
          <Link
            href="/dashboard/habits"
            className={`text-sm font-medium ${
              pathname === "/dashboard/habits" ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            Habits
          </Link>
          <Link
            href="/dashboard/calendar"
            className={`text-sm font-medium ${
              pathname === "/dashboard/calendar" ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            Calendar
          </Link>
          <Link
            href="/dashboard/settings"
            className={`text-sm font-medium ${
              pathname === "/dashboard/settings" ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            Settings
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/habits/new">
              <Plus className="h-5 w-5" />
              <span className="sr-only">New Habit</span>
            </Link>
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.picture} alt={user?.name || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
