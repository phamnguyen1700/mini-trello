"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Clipboard, Trash2 } from "lucide-react";
import { Card } from "../../../../../shared/types/card.types";
import { useCreateTask, useDeleteTask, useMoveTask, useTasks } from "@/hooks/board";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { setTaskDragPayload } from "@/features/dnd/dnd-utils";
import { useTaskDnd } from "@/features/dnd/useTaskDnd";

interface BoardColumnProps {
  card: Card;
  onDelete: (cardId: string) => void;
}

export const BoardColumn = ({ card, onDelete }: BoardColumnProps) => {
  const { data: tasksData } = useTasks(card.boardId, card.id);
  const tasks = tasksData?.data ?? [];
  const createTaskMutation = useCreateTask(card.boardId, card.id);
  const deleteTaskMutation = useDeleteTask(card.boardId, card.id);
  const moveTaskMutation = useMoveTask(card.boardId);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [orderedTasks, setOrderedTasks] = useState(tasks);

  const tasksSignature = useMemo(() => {
    return tasks
      .map((task) => `${task.id}:${task.position}`)
      .sort()
      .join("|");
  }, [tasks]);

  const lastSignatureRef = useRef<string>("");

  useEffect(() => {
    if (!tasksSignature) {
      if (lastSignatureRef.current !== "") {
        lastSignatureRef.current = "";
        setOrderedTasks([]);
      }
      return;
    }
    if (lastSignatureRef.current === tasksSignature) return;
    lastSignatureRef.current = tasksSignature;
    setOrderedTasks(tasks);
  }, [tasks, tasksSignature]);

  const handleCreateTask = (data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
  }) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const confirmDeleteTask = () => {
    if (!deleteTaskId) return;
    deleteTaskMutation.mutate(deleteTaskId, {
      onSuccess: () => setDeleteTaskId(null),
    });
  };

  const { handleTaskDragOver, handleTaskDrop, handleTaskDropAtEnd } =
    useTaskDnd({
      cardId: card.id,
      orderedTasks,
      setOrderedTasks,
      onMoveTask: ({ fromCardId, taskId, toCardId, index }) => {
        moveTaskMutation.mutate({
          fromCardId,
          taskId,
          data: { toCardId, index },
        });
      },
    });

  return (
    <div
      className="board-column"
      onDragOver={handleTaskDragOver}
      onDrop={handleTaskDropAtEnd}
    >
      <div className="board-column-header">
        <span>{card.name}</span>
        <button
          type="button"
          className="text-muted-hover"
          onClick={() => onDelete(card.id)}
          aria-label="Delete card"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div
        className="space-y-2 min-h-6"
        onDragOver={handleTaskDragOver}
        onDrop={handleTaskDropAtEnd}
      >
        {orderedTasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-md bg-black/40 px-3 py-2 text-sm"
            draggable
            onDragStart={(event) =>
              setTaskDragPayload(event, {
                taskId: task.id,
                fromCardId: card.id,
              })
            }
            onDragOver={handleTaskDragOver}
            onDrop={(event) => handleTaskDrop(event, index)}
          >
            <span className="text-light">
              {task.title || "Untitled task"}
            </span>
            <button
              type="button"
              className="text-muted-hover"
              onClick={() => setDeleteTaskId(task.id)}
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="board-add-card" onClick={() => setCreateOpen(true)}>
        <Plus className="w-4 h-4" />
        <span>Add a task</span>
        <Clipboard className="w-3.5 h-3.5 ml-auto" />
      </div>

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateTask}
        isCreating={createTaskMutation.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTaskId)}
        title="Delete task?"
        confirmText="Delete"
        onClose={() => setDeleteTaskId(null)}
        onConfirm={confirmDeleteTask}
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
};
