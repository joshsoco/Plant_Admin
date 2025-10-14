"use client"
import React, { useState } from "react"
import {
  Settings ,
  Bell,
  ChevronsUpDown,
  Palette ,
  LogOut,
  UserRoundPen ,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ProfileDialog } from "@/components/ProfileDialog";
import { ThemeDisplayDialog } from "@/components/ThemeDisplayDialog";
import { AdminSettingsDialog } from '@/components/AdminSettingsDialog';
import { NotificationDialog } from '@/components/NotificationsDialog';
import { useAuth } from "@/features/auth/context/AuthContext"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); 
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); 

  // New displayName logic
  const displayName =
    user?.name?.trim() ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "") ||
    user?.email?.split("@")[0] ||
    "Admin";

  const generateInitials = (firstName?: string, lastName?: string, fallbackName?: string): string => {
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    
    if (fallbackName) {
      const nameParts = fallbackName.trim().split(" ");
      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      }
      const firstPart = nameParts[0];
      const lastPart = nameParts[nameParts.length - 1];
      return (firstPart.charAt(0) + lastPart.charAt(0)).toUpperCase();
    }
    
    return "?";
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">?</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Guest</span>
              <span className="truncate text-xs">Not logged in</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {generateInitials(user.firstName, user.lastName, displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {generateInitials(user.firstName, user.lastName, displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                <UserRoundPen />
                My Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setSettingsOpen(true)}
                className="cursor-pointer">
                <Settings  />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setThemeDialogOpen(true)}
                className="cursor-pointer"
              >
                <Palette  />
                Theme & Display
              </DropdownMenuItem>
              <DropdownMenuItem
              onClick={() => setNotificationsOpen(true)}
              className="cursor-pointer">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut/>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <AdminSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <NotificationDialog open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <ThemeDisplayDialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen} />
    </SidebarMenu>
  )
}
