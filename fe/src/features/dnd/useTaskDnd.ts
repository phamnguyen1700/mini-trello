"use client";

import { useCallback } from "react";
import type { Task } from "../../../../shared/types";
import { getTaskPayloadOrNull, isTaskDragEvent } from "./dnd-utils";

interface UseTaskDndParams {
  cardId: string;
  orderedTasks: Task[];
  setOrderedTasks: (tasks: Task[]) => void;
  onMoveTask: (params: {
    fromCardId: string;
    taskId: string;
    toCardId: string;
    index: number;
  }) => void;
}

export const useTaskDnd = ({
  cardId,
  orderedTasks,
  setOrderedTasks,
  onMoveTask,
}: UseTaskDndParams) => {
  const reorderTasks = useCallback(
    (taskId: string, toIndex: number) => {
      const currentIndex = orderedTasks.findIndex((task) => task.id === taskId);
      if (currentIndex === -1) return orderedTasks;
      const next = [...orderedTasks];
      const [moved] = next.splice(currentIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    },
    [orderedTasks],
  );

  const handleTaskDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!isTaskDragEvent(event)) return;
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const handleTaskDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
      const payload = getTaskPayloadOrNull(event);
      if (!payload) return;
      event.preventDefault();
      event.stopPropagation();

      const next = reorderTasks(payload.taskId, targetIndex);
      setOrderedTasks(next);

      onMoveTask({
        fromCardId: payload.fromCardId,
        taskId: payload.taskId,
        toCardId: cardId,
        index: targetIndex,
      });
    },
    [cardId, onMoveTask, reorderTasks, setOrderedTasks],
  );

  const handleTaskDropAtEnd = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const payload = getTaskPayloadOrNull(event);
      if (!payload) return;
      event.preventDefault();
      event.stopPropagation();

      const next = reorderTasks(payload.taskId, orderedTasks.length);
      setOrderedTasks(next);

      onMoveTask({
        fromCardId: payload.fromCardId,
        taskId: payload.taskId,
        toCardId: cardId,
        index: orderedTasks.length,
      });
    },
    [cardId, onMoveTask, orderedTasks.length, reorderTasks, setOrderedTasks],
  );

  return {
    handleTaskDragOver,
    handleTaskDrop,
    handleTaskDropAtEnd,
  };
};

