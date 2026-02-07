"use client";

interface CreateBoardCardProps {
  onClick: () => void;
}

export const CreateBoardCard = ({ onClick }: CreateBoardCardProps) => {
  return (
    <div className="create-board-card" onClick={onClick}>
      <span className="create-board-text">+ Create a new board</span>
    </div>
  );
};
