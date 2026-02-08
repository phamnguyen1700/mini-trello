"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardColumn } from "./components/BoardColumn";
import { AddListButton } from "./components/AddListButton";
import { mockCards, mockColumns } from "@/components/layout/Sidebar";
import { useBoard } from "@/hooks/dashboard";

interface BoardFeatureProps {
  boardId: string;
}

export const BoardFeature = ({ boardId }: BoardFeatureProps) => {
  const { data, isLoading } = useBoard(boardId);
  const board = data?.data;

  if (isLoading) {
    return <p className="text-gray-400 p-6">Loading board...</p>;
  }

  if (!board) {
    return <p className="text-gray-400 p-6">Board not found</p>;
  }

  return (
    <div>
      <div className="board-header">
        <h1 className="text-white text-lg font-semibold ml-6">{board.name}</h1>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite member
        </Button>
      </div>

      <div className="board-columns">
        {mockColumns.map((column, index) => {
          const cards = column.cardIds
            .map((cardId) => mockCards.find((c) => c.id === cardId))
            .filter(Boolean) as typeof mockCards;

          return (
            <BoardColumn
              key={column.id}
              title={column.title}
              cards={cards}
              showMenu={index === mockColumns.length - 1}
            />
          );
        })}

        <AddListButton />
      </div>
    </div>
  );
};
