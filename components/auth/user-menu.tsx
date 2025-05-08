"use client"

import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
  const { user, logout, isLoading } = useAuth()

  // If no user, show login button
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Login</Link>
      </Button>
    )
  }

  // Get initials for avatar
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return user.username.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} disabled={isLoading} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
