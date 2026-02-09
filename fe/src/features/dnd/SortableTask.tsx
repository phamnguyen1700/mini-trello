"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTaskProps {
  id: string;
  cardId: string;
  children: React.ReactNode;
}

export const SortableTask = ({ id, cardId, children }: SortableTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, data: { type: "task", cardId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
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

