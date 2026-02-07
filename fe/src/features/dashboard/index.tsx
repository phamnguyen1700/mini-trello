"use client";

import { useState } from "react";
import { BoardCard } from "./components/BoardCard";
import { CreateBoardCard } from "./components/CreateBoardCard";
import { CreateBoardDialog } from "./components/CreateBoardDialog";
import { useBoards, useCreateBoard, useDeleteBoard } from "@/hooks/dashboard";

export const DashboardFeature = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useBoards();
  const { mutate: createBoard, isPending: isCreating } = useCreateBoard();
  const { mutate: deleteBoard, isPending: isDeleting } = useDeleteBoard();

  const boards = data?.data ?? [];

  const handleCreate = (name: string, description: string) => {
    createBoard(
      { name, description },
      {
        onSuccess: () => setDialogOpen(false),
      },
    );
  };

  if (isLoading) {
    return <p className="text-gray-400">Loading boards...</p>;
  }

  return (
    <>
      <h2 className="dashboard-title">YOUR WORKSPACES</h2>

      <div className="board-grid">
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            id={board.id}
            name={board.name}
            description={board.description}
            onDelete={(id) => deleteBoard(id)}
            isDeleting={isDeleting}
          />
        ))}

        <CreateBoardCard onClick={() => !isDeleting && setDialogOpen(true)} />
      </div>

      <CreateBoardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        isCreating={isCreating}
      />
    </>
  );
};
