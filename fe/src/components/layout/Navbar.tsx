"use client";

import Image from "next/image";
import { Bell, PanelLeft, PanelLeftClose } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Navbar = ({ sidebarCollapsed, onToggleSidebar }: NavbarProps) => {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/auth");
  };

  const initials = user?.displayName?.slice(0, 2).toUpperCase() || "U";

  return (
    <nav className="navbar">
      <div className="navbar-actions">
        <button
          onClick={onToggleSidebar}
          className="text-gray-300-hover"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <Image
          src="/logo.png"
          alt="Logo"
          width={28}
          height={28}
          className="navbar-logo"
        />
      </div>

      <div className="navbar-actions">
        <button className="text-gray-300-hover">
          <Bell className="w-5 h-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-red-500 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
