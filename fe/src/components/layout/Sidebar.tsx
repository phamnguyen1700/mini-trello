"use client";

import { LayoutDashboard, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className={`sidebar-item ${pathname === "/dashboard" ? "active" : ""}`}
        onClick={() => router.push("/dashboard")}
      >
        <LayoutDashboard className="w-4 h-4" />
        Boards
      </div>
    </aside>
  );
};
