import type { DragEvent } from "react";
import { Card } from "../../../../../shared/types/card.types";
import type { ColumnId } from "@/features/dnd/types";
import {
  getCardDragPayload,
  setCardDragPayload,
} from "@/features/dnd/dnd-utils";

interface CardItemProps {
  card: Card;
  columnId: ColumnId;
  index: number;
  onCardDrop: (
    cardId: string,
    fromColumnId: ColumnId,
    toColumnId: ColumnId,
    toIndex: number,
  ) => void;
}

export const CardItem = ({
  card,
  columnId,
  index,
  onCardDrop,
}: CardItemProps) => {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    setCardDragPayload(event, { cardId: card.id, fromColumnId: columnId });
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const payload = getCardDragPayload(event);
    if (!payload) return;
    if (!payload.fromColumnId) return;
    onCardDrop(payload.cardId, payload.fromColumnId, columnId, index);
  };

  return (
    <div
      className="board-card-item"
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {card.name}
    </div>
  );
};
