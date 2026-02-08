"use client";

import { useCallback } from "react";
import type { Card } from "../../../../shared/types";
import { getCardDragPayload } from "./dnd-utils";

interface UseCardDndParams {
  orderedCards: Card[];
  setOrderedCards: (cards: Card[]) => void;
  onMoveCard: (params: { cardId: string; index: number }) => void;
}

export const useCardDnd = ({
  orderedCards,
  setOrderedCards,
  onMoveCard,
}: UseCardDndParams) => {
  const reorderCards = useCallback(
    (cardId: string, toIndex: number) => {
      const currentIndex = orderedCards.findIndex((card) => card.id === cardId);
      if (currentIndex === -1) return orderedCards;
      const next = [...orderedCards];
      const [moved] = next.splice(currentIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    },
    [orderedCards],
  );

  const handleCardDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleCardDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
      event.preventDefault();
      const payload = getCardDragPayload(event);
      if (!payload?.cardId) return;

      const next = reorderCards(payload.cardId, targetIndex);
      setOrderedCards(next);
      onMoveCard({ cardId: payload.cardId, index: targetIndex });
    },
    [onMoveCard, reorderCards, setOrderedCards],
  );

  const handleCardDropAtEnd = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const payload = getCardDragPayload(event);
      if (!payload?.cardId) return;

      const next = reorderCards(payload.cardId, orderedCards.length);
      setOrderedCards(next);
      onMoveCard({ cardId: payload.cardId, index: orderedCards.length });
    },
    [onMoveCard, orderedCards.length, reorderCards, setOrderedCards],
  );

  return {
    handleCardDragOver,
    handleCardDrop,
    handleCardDropAtEnd,
  };
};

