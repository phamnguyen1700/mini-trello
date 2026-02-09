"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableCardProps {
  id: string;
  children: React.ReactNode;
}

export const SortableCard = ({ id, children }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, data: { type: "card" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    alignSelf: "flex-start",
    height: "auto",
    flex: "0 0 auto",
  };

  return (
    <div
      ref={setNodeRef}
      className="board-column-wrapper"
      style={style}
      onPointerDownCapture={(event) => {
        const target = event.target as Element | null;
        if (target?.closest?.("[data-no-dnd]")) {
          event.stopPropagation();
        }
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

