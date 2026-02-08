"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardColumn } from "./components/BoardColumn";
import { AddListButton } from "./components/AddListButton";
import { CreateCardDialog } from "./components/CreateCardDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useBoard } from "@/hooks/dashboard";
import {
  useBoardCards,
  useCreateCard,
  useDeleteCard,
  useMoveCard,
} from "@/hooks/board";
import { setCardDragPayload } from "@/features/dnd/dnd-utils";
import { useCardDnd } from "@/features/dnd/useCardDnd";

interface BoardFeatureProps {
  boardId: string;
}

export const BoardFeature = ({ boardId }: BoardFeatureProps) => {
  const { data, isLoading } = useBoard(boardId);
  const board = data?.data;
  const { data: cardsData, isLoading: cardsLoading } = useBoardCards(boardId);
  const cards = cardsData?.data ?? [];
  const createCardMutation = useCreateCard(boardId);
  const deleteCardMutation = useDeleteCard(boardId);
  const moveCardMutation = useMoveCard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [orderedCards, setOrderedCards] = useState(cards);

  const cardsSignature = useMemo(() => {
    return cards
      .map((card) => `${card.id}:${card.position}`)
      .sort()
      .join("|");
  }, [cards]);

  const lastSignatureRef = useRef<string>("");

  useEffect(() => {
    if (!cardsSignature) {
      if (lastSignatureRef.current !== "") {
        lastSignatureRef.current = "";
        setOrderedCards([]);
      }
      return;
    }
    if (lastSignatureRef.current === cardsSignature) return;
    lastSignatureRef.current = cardsSignature;
    setOrderedCards(cards);
  }, [cards, cardsSignature]);

  const handleAddCard = () => {
    setDialogOpen(true);
  };

  const handleCreateCard = (name: string, description: string) => {
    createCardMutation.mutate(
      { name, description: description || undefined },
      {
        onSuccess: () => setDialogOpen(false),
      },
    );
  };

  const handleDeleteCard = (cardId: string) => {
    const card = cards.find((item) => item.id === cardId);
    if (!card) return;
    setDeleteTarget({ id: cardId, name: card.name });
  };

  const confirmDeleteCard = () => {
    if (!deleteTarget) return;
    deleteCardMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleCardDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    cardId: string,
  ) => {
    setCardDragPayload(event, { cardId, fromColumnId: "backlog" });
  };

  const { handleCardDragOver, handleCardDrop, handleCardDropAtEnd } =
    useCardDnd({
      orderedCards,
      setOrderedCards,
      onMoveCard: ({ cardId, index }) =>
        moveCardMutation.mutate({
          boardId,
          id: cardId,
          data: { index },
        }),
    });

  if (isLoading || cardsLoading) {
    return <p className="text-muted p-6">Loading board...</p>;
  }

  if (!board) {
    return <p className="text-muted p-6">Board not found</p>;
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
        {orderedCards.map((card, index) => {
          return (
            <div
              key={card.id}
              draggable
              onDragStart={(event) => handleCardDragStart(event, card.id)}
              onDragOver={handleCardDragOver}
              onDrop={(event) => handleCardDrop(event, index)}
            >
              <BoardColumn card={card} onDelete={handleDeleteCard} />
            </div>
          );
        })}

        <div onDragOver={handleCardDragOver} onDrop={handleCardDropAtEnd}>
          <AddListButton onClick={handleAddCard} />
        </div>
      </div>
      <CreateCardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateCard}
        isCreating={createCardMutation.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete card?"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"?`
            : undefined
        }
        confirmText="Delete"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteCard}
        isLoading={deleteCardMutation.isPending}
      />
    </div>
  );
};
