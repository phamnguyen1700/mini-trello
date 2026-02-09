import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type {
  Card,
  CreateCardDto,
  MoveCardDto,
  UpdateCardDto,
} from "../../../../shared/types";
import { cardService } from "@/services/card";
import { type Column, type ColumnId } from "@/features/dnd/types";
import { taskService } from "@/services/task";
import type {
  AssignTaskDto,
  CreateTaskDto as CreateTaskInput,
  MoveTaskDto,
  UpdateTaskDto,
} from "../../../../shared/types";

export const useBoardCards = (boardId: string) => {
  return useQuery({
    queryKey: ["cards", boardId],
    queryFn: () => cardService.getAllByBoard(boardId),
    enabled: !!boardId,
  });
};

export const useMoveCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      boardId,
      id,
      data,
    }: {
      boardId: string;
      id: string;
      data: MoveCardDto;
    }) => cardService.move({ boardId, id, data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.boardId],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to move card",
      );
    },
  });
};

export const useCreateCard = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCardDto) =>
      cardService.create({ boardId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create card",
      );
    },
  });
};

export const useCard = (boardId: string, cardId: string) => {
  return useQuery({
    queryKey: ["card", boardId, cardId],
    queryFn: () => cardService.getById({ boardId, id: cardId }),
    enabled: !!boardId && !!cardId,
  });
};

export const useUpdateCard = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardDto }) =>
      cardService.update({ boardId, id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update card",
      );
    },
  });
};

export const useDeleteCard = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cardService.delete({ boardId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete card",
      );
    },
  });
};

export const useTasks = (boardId: string, cardId: string) => {
  return useQuery({
    queryKey: ["tasks", boardId, cardId],
    queryFn: () => taskService.getAllByCard({ boardId, cardId }),
    enabled: !!boardId && !!cardId,
  });
};

export const useCreateTask = (boardId: string, cardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) =>
      taskService.create({ boardId, cardId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId, cardId] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task",
      );
    },
  });
};

export const useTask = (boardId: string, cardId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", boardId, cardId, taskId],
    queryFn: () => taskService.getById({ boardId, cardId, taskId }),
    enabled: !!boardId && !!cardId && !!taskId,
  });
};

export const useUpdateTask = (boardId: string, cardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskDto;
    }) => taskService.update({ boardId, cardId, taskId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId, cardId] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update task",
      );
    },
  });
};

export const useDeleteTask = (boardId: string, cardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      taskService.delete({ boardId, cardId, taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId, cardId] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete task",
      );
    },
  });
};

export const useAssignTask = (boardId: string, cardId: string) => {
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: AssignTaskDto;
    }) => taskService.assign({ boardId, cardId, taskId, data }),
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign task",
      );
    },
  });
};

export const useMoveTask = (boardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fromCardId,
      taskId,
      data,
    }: {
      fromCardId: string;
      taskId: string;
      data: MoveTaskDto;
    }) =>
      taskService.move({
        boardId,
        cardId: fromCardId,
        taskId,
        data,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, variables.fromCardId],
      });
      if (variables.data.toCardId !== variables.fromCardId) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", boardId, variables.data.toCardId],
        });
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to move task",
      );
    },
  });
};

export const useBoardDnd = (cards: Card[] | undefined) => {
  const buildColumns = (input: Card[]): Column[] => {
    const map = new Map<ColumnId, { title: string; cardIds: string[] }>();

    input.forEach((card) => {
      const existing = map.get(card.status);
      if (!existing) {
        map.set(card.status, {
          title: card.status.replace("_", " "),
          cardIds: [card.id],
        });
      } else {
        existing.cardIds.push(card.id);
      }
    });

    return Array.from(map.entries())
      .map(([id, value]) => ({
        id,
        title: value.title,
        cardIds: value.cardIds,
      }))
      .filter((column) => column.cardIds.length > 0);
  };

  const [columns, setColumns] = useState<Column[]>(
    () => buildColumns(cards ?? []),
  );

  const cardsSignature = useMemo(() => {
    if (!cards) return "";
    return cards
      .map((card) => `${card.id}:${card.status}:${card.position}`)
      .sort()
      .join("|");
  }, [cards]);

  const lastSignatureRef = useRef<string>("");

  useEffect(() => {
    if (!cardsSignature) return;
    if (lastSignatureRef.current === cardsSignature) return;
    lastSignatureRef.current = cardsSignature;
    setColumns(buildColumns(cards ?? []));
  }, [cardsSignature, cards]);

  const cardsById = useMemo(
    () => new Map((cards ?? []).map((card) => [card.id, card])),
    [cards],
  );

  const getInsertIndex = (
    cardId: string,
    fromColumnId: ColumnId,
    toColumnId: ColumnId,
    toIndex: number,
  ) => {
    const source = columns.find((c) => c.id === fromColumnId);
    const target = columns.find((c) => c.id === toColumnId);
    if (!source || !target) return toIndex;

    const sourceCards = [...source.cardIds];
    const targetCards =
      fromColumnId === toColumnId ? sourceCards : [...target.cardIds];

    const fromIndex = sourceCards.indexOf(cardId);
    if (fromIndex === -1) return toIndex;

    let insertIndex = Math.max(0, Math.min(toIndex, targetCards.length));
    if (fromColumnId === toColumnId && fromIndex < insertIndex) {
      insertIndex -= 1;
    }

    return insertIndex;
  };

  const moveCard = (
    cardId: string,
    fromColumnId: ColumnId,
    toColumnId: ColumnId,
    toIndex: number,
  ) => {
    setColumns((prev) => {
      const source = prev.find((c) => c.id === fromColumnId);
      const target = prev.find((c) => c.id === toColumnId);
      if (!source || !target) return prev;

      const sourceCards = [...source.cardIds];
      const targetCards =
        fromColumnId === toColumnId ? sourceCards : [...target.cardIds];

      const fromIndex = sourceCards.indexOf(cardId);
      if (fromIndex === -1) return prev;

      sourceCards.splice(fromIndex, 1);

      const insertIndex = getInsertIndex(
        cardId,
        fromColumnId,
        toColumnId,
        toIndex,
      );

      targetCards.splice(insertIndex, 0, cardId);

      return prev.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, cardIds: sourceCards };
        }
        if (col.id === toColumnId) {
          return { ...col, cardIds: targetCards };
        }
        return col;
      });
    });
  };

  return {
    columns,
    cardsById,
    getInsertIndex,
    moveCard,
  };
};

