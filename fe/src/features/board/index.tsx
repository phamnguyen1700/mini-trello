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
  useMoveTask,
  useUpdateCard,
} from "@/hooks/board";
import { SortableCard } from "@/features/dnd/SortableCard";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueries } from "@tanstack/react-query";
import { taskService } from "@/services/task";
import type { Task } from "../../../../shared/types";

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
  const updateCardMutation = useUpdateCard(boardId);
  const moveTaskMutation = useMoveTask(boardId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editTarget, setEditTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [orderedCards, setOrderedCards] = useState(cards);
  const [orderedTasksByCard, setOrderedTasksByCard] = useState<
    Record<string, Task[]>
  >({});
  const [isDraggingTask, setIsDraggingTask] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const cardsSignature = useMemo(() => {
    return cards
      .map((card) => `${card.id}:${card.position}:${card.name}`)
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

  const tasksQueries = useQueries({
    queries: orderedCards.map((card) => ({
      queryKey: ["tasks", boardId, card.id],
      queryFn: () => taskService.getAllByCard({ boardId, cardId: card.id }),
      enabled: !!boardId && !!card.id,
    })),
  });

  const tasksByCard = useMemo(() => {
    const result: Record<string, Task[]> = {};
    orderedCards.forEach((card, index) => {
      result[card.id] = tasksQueries[index]?.data?.data ?? [];
    });
    return result;
  }, [orderedCards, tasksQueries]);

  const tasksSignature = useMemo(() => {
    return orderedCards
      .map((card) => {
        const tasks = tasksByCard[card.id] ?? [];
        const signature = tasks
          .map((task) => `${task.id}:${task.position}:${task.title}`)
          .sort()
          .join(",");
        return `${card.id}:${signature}`;
      })
      .join("|");
  }, [orderedCards, tasksByCard]);

  const lastTasksSignatureRef = useRef<string>("");

  useEffect(() => {
    if (isDraggingTask) return;
    if (!tasksSignature) {
      if (lastTasksSignatureRef.current !== "") {
        lastTasksSignatureRef.current = "";
        setOrderedTasksByCard({});
      }
      return;
    }
    if (lastTasksSignatureRef.current === tasksSignature) return;
    lastTasksSignatureRef.current = tasksSignature;
    setOrderedTasksByCard(tasksByCard);
  }, [isDraggingTask, tasksByCard, tasksSignature]);

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

  const handleEditCard = (cardId: string) => {
    const card = cards.find((item) => item.id === cardId);
    if (!card) return;
    setEditTarget({ id: cardId, name: card.name });
  };

  const confirmDeleteCard = () => {
    if (!deleteTarget) return;
    deleteCardMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const confirmEditCard = () => {
    if (!editTarget) return;
    updateCardMutation.mutate(
      {
        id: editTarget.id,
        data: { name: editTarget.name },
      },
      {
        onSuccess: () => setEditTarget(null),
      },
    );
  };

  const activeTaskRef = useRef<{
    taskId: string;
    originalCardId: string;
    currentCardId: string;
  } | null>(null);

  const findTaskContainer = (taskId: string) => {
    return Object.keys(orderedTasksByCard).find((cardId) =>
      orderedTasksByCard[cardId]?.some((task) => task.id === taskId),
    );
  };

  const handleDragStart = (event: { active: any }) => {
    const activeData = event.active.data?.current;
    if (activeData?.type === "task") {
      const taskId = (event.active.id as string).replace("task-", "");
      activeTaskRef.current = {
        taskId,
        originalCardId: activeData.cardId as string,
        currentCardId: activeData.cardId as string,
      };
      setIsDraggingTask(true);
    }
  };

  const handleDragOver = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data?.current;
    if (activeData?.type !== "task") return;

    const activeTaskId = (active.id as string).replace("task-", "");
    const overData = over.data?.current;

    const fromCardId =
      activeTaskRef.current?.currentCardId || (activeData.cardId as string);
    const toCardId =
      overData?.cardId ||
      (over.id as string).replace("card-", "").replace("-tasks", "");

    if (!toCardId) return;
    if (fromCardId === toCardId && active.id === over.id) return;

    setOrderedTasksByCard((prev) => {
      const fromTasks = [...(prev[fromCardId] ?? [])];
      const toTasks = [...(prev[toCardId] ?? [])];
      const activeIndex = fromTasks.findIndex((t) => t.id === activeTaskId);
      if (activeIndex === -1) return prev;

      const next = { ...prev };
      const [moved] = fromTasks.splice(activeIndex, 1);

      if (toTasks.some((task) => task.id === activeTaskId)) {
        return prev;
      }

      if (overData?.type === "task") {
        const overTaskId = (over.id as string).replace("task-", "");
        const overIndex = toTasks.findIndex((t) => t.id === overTaskId);
        toTasks.splice(overIndex === -1 ? toTasks.length : overIndex, 0, moved);
      } else {
        toTasks.push(moved);
      }

      next[fromCardId] = [...fromTasks];
      next[toCardId] = [...toTasks];
      if (activeTaskRef.current) {
        activeTaskRef.current.currentCardId = toCardId;
      }
      return next;
    });
  };

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!over) {
      setIsDraggingTask(false);
      return;
    }

    const activeData = active.data?.current;

    if (activeData?.type === "card") {
      const activeId = (active.id as string).replace("card-", "");
      const overId = (over.id as string).replace("card-", "");
      const oldIndex = orderedCards.findIndex((card) => card.id === activeId);
      const newIndex = orderedCards.findIndex((card) => card.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      const next = arrayMove(orderedCards, oldIndex, newIndex);
      setOrderedCards(next);
      moveCardMutation.mutate({
        boardId,
        id: activeId,
        data: { index: newIndex },
      });
      return;
    }

    if (activeData?.type === "task") {
      const taskId = (active.id as string).replace("task-", "");
      const currentCardId = findTaskContainer(taskId);
      const fromCardId = activeTaskRef.current?.originalCardId;
      if (!currentCardId || !fromCardId) return;

      const targetTasks = orderedTasksByCard[currentCardId] ?? [];
      const index = targetTasks.findIndex((task) => task.id === taskId);
      if (index === -1) return;

      moveTaskMutation.mutate({
        fromCardId,
        taskId,
        data: { toCardId: currentCardId, index },
      });
      activeTaskRef.current = null;
      setIsDraggingTask(false);
    }
  };

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

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedCards.map((card) => `card-${card.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="board-columns">
            {orderedCards.map((card) => {
              const tasks = orderedTasksByCard[card.id] ?? [];
              return (
                <SortableCard key={card.id} id={`card-${card.id}`}>
                  <SortableContext
                    items={tasks.map((task) => `task-${task.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <BoardColumn
                      card={card}
                      tasks={tasks}
                      onDelete={handleDeleteCard}
                      onEdit={handleEditCard}
                    />
                  </SortableContext>
                </SortableCard>
              );
            })}

            <AddListButton onClick={handleAddCard} />
          </div>
        </SortableContext>
      </DndContext>
      <CreateCardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateCard}
        isCreating={createCardMutation.isPending}
      />
      <CreateCardDialog
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        onCreate={(name, description) => {
          if (!editTarget) return;
          updateCardMutation.mutate(
            {
              id: editTarget.id,
              data: {
                name,
                description: description || undefined,
              },
            },
            {
              onSuccess: () => setEditTarget(null),
            },
          );
        }}
        initialValues={{
          name: editTarget?.name,
          description: "",
        }}
        titleText="Update card"
        isCreating={updateCardMutation.isPending}
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
