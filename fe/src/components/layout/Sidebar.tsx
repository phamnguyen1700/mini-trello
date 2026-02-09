"use client";

import {
  ChevronDown,
  LayoutDashboard,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Board } from "../../../../shared/types/board.types";
import { User } from "../../../../shared/types/user.types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useBoards } from "@/hooks/dashboard";

export const mockMembers: User[] = [
  {
    id: "1",
    email: "user1@test.com",
    displayName: "Mock User 1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "user2@test.com",
    displayName: "Mock User 2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "user3@test.com",
    displayName: "Mock User 3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    email: "user4@test.com",
    displayName: "Mock User 4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: boardsData } = useBoards();
  const boards = boardsData?.data ?? [];

  const isBoardDetail = pathname.startsWith("/boards/");

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className={`sidebar-item ${pathname === "/dashboard" ? "active" : ""}`}
        onClick={() => router.push("/dashboard")}
      >
        <LayoutDashboard className="w-4 h-4" />
        Boards
      </div>{" "}
      {isBoardDetail && (
        <>
          <div className="sidebar-section-title">
            <span>Your boards</span>
            <MoreHorizontal className="w-4 h-4 cursor-pointer" />
          </div>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="sidebar-board-item w-full">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-sm flex-1 text-left">Boards</span>
              <ChevronDown className="w-3 h-3 transition-transform duration-200 [[data-state=closed]>&]:-rotate-90" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              {boards.map((board: Board) => {
                const isActive = pathname === `/boards/${board.id}`;
                return (
                  <div
                    key={board.id}
                    className={`sidebar-board-item ${isActive ? "active" : ""}`}
                    onClick={() => router.push(`/boards/${board.id}`)}
                  >
                    <div className="w-3 h-3 rounded-sm bg-red-500" />
                    <span className="text-sm flex-1 text-left">{board.name}</span>
                  </div>
                );
              })}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="sidebar-members-label w-full">
                  <Users className="w-4 h-4" />
                  <span className="flex-1 text-left">Members</span>
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 [[data-state=closed]>&]:-rotate-90" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  {mockMembers.map((member) => (
                    <div key={member.id} className="sidebar-member-item">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-red-500 text-white text-[10px]">
                          {member.displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.displayName}</span>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </CollapsibleContent>
          </Collapsible>

          <div className="sidebar-close-section">
            <p className="text-xs text-muted mb-3">
              You can&apos;t find and reopen closed boards if close the board
            </p>
            <Button variant="destructive" className="w-full">
              Close
            </Button>
          </div>
        </>
      )}
    </aside>
  );
};
