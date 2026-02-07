"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface BoardCardProps {
  id: string;
  name: string;
  description?: string;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const BoardCard = ({
  id,
  name,
  description,
  onDelete,
  isDeleting,
}: BoardCardProps) => {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="board-card" onClick={() => router.push(`/boards/${id}`)}>
      <div className="board-card-header">
        <h3 className="board-card-title">{name}</h3>
        <button
          onClick={handleDelete}
          className="board-card-delete"
          disabled={isDeleting}
        >
          <Trash2 className={`w-4 h-4 ${isDeleting ? "animate-spin" : ""}`} />
        </button>
      </div>
      {description && <p className="board-card-desc">{description}</p>}
    </div>
  );
};
