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
import { Card } from "../../../../shared/types/card.types";
import { Board } from "../../../../shared/types/board.types";
import { User } from "../../../../shared/types/user.types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export const mockMembers: User[] = [
  {
    id: "1",
    email: "user1@test.com",
    displayName: "User 1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "user2@test.com",
    displayName: "User 2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "user3@test.com",
    displayName: "User 3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    email: "user4@test.com",
    displayName: "User 4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockCards: Card[] = [
  {
    id: "1",
    boardId: "board-1",
    name: "Project planning",
    tasks_count: 3,
    list_member: ["1", "2"],
    createdAt: new Date(),
  },
  {
    id: "2",
    boardId: "board-1",
    name: "Kickoff meeting",
    tasks_count: 1,
    list_member: ["1"],
    createdAt: new Date(),
  },
  {
    id: "3",
    boardId: "board-1",
    name: "Kickoff meeting",
    description: "Review outcomes",
    tasks_count: 2,
    list_member: ["2", "3"],
    createdAt: new Date(),
  },
];

export const mockBoard: Board = {
  id: "board-1",
  name: "My Trello board",
  ownerId: "1",
  memberIds: ["1", "2", "3", "4"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export type ColumnId = "todo" | "doing" | "done";

export interface Column {
  id: ColumnId;
  title: string;
  cardIds: string[];
}

export const mockColumns: Column[] = [
  { id: "todo", title: "To do", cardIds: ["1", "2"] },
  { id: "doing", title: "Doing", cardIds: [] },
  { id: "done", title: "Done", cardIds: ["3"] },
];

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

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
            <CollapsibleTrigger className="sidebar-board-item active w-full">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-sm flex-1 text-left">{mockBoard.name}</span>
              <ChevronDown className="w-3 h-3 transition-transform duration-200 [[data-state=closed]>&]:-rotate-90" />
            </CollapsibleTrigger>

            <CollapsibleContent>
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
