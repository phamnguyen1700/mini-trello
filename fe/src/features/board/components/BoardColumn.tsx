"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Clipboard, Trash2, Pencil } from "lucide-react";
import { Card } from "../../../../../shared/types/card.types";
import { useCreateTask, useDeleteTask, useUpdateTask } from "@/hooks/board";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SortableTask } from "@/features/dnd/SortableTask";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../../../../../shared/types/task.types";

interface BoardColumnProps {
  card: Card;
  tasks: Task[];
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
}

export const BoardColumn = ({ card, tasks, onDelete, onEdit }: BoardColumnProps) => {
  const createTaskMutation = useCreateTask(card.boardId, card.id);
  const deleteTaskMutation = useDeleteTask(card.boardId, card.id);
  const updateTaskMutation = useUpdateTask(card.boardId, card.id);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [orderedTasks, setOrderedTasks] = useState(tasks);

  const tasksSignature = useMemo(() => {
    return tasks
      .map((task) => `${task.id}:${task.position}:${task.title}`)
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

  const handleUpdateTask = (data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
  }) => {
    if (!editTask) return;
    updateTaskMutation.mutate(
      {
        taskId: editTask.id,
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
        },
      },
      {
        onSuccess: () => setEditTask(null),
      },
    );
  };

  const { setNodeRef } = useDroppable({
    id: `card-${card.id}-tasks`,
    data: { type: "task-container", cardId: card.id },
  });

  return (
    <div className="board-column">
      <div className="board-column-header">
        <span>{card.name}</span>
        <div className="card-actions">
          <button
            type="button"
            className="text-muted-hover"
            data-no-dnd
            onClick={() => onEdit(card.id)}
            aria-label="Edit card"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="text-muted-hover"
            data-no-dnd
            onClick={() => onDelete(card.id)}
            aria-label="Delete card"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={setNodeRef} className="space-y-2 min-h-6">
        {orderedTasks.map((task) => (
          <SortableTask key={task.id} id={`task-${task.id}`} cardId={card.id}>
            <div className="flex items-center justify-between rounded-md bg-black/40 px-3 py-2 text-sm">
              <span className="text-light">
                {task.title || "Untitled task"}
              </span>
            <div className="task-actions flex items-center gap-2">
              <button
                type="button"
                className="text-muted-hover"
                data-no-dnd
                onClick={() => setEditTask(task)}
                aria-label="Edit task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="text-muted-hover"
                data-no-dnd
                onClick={() => setDeleteTaskId(task.id)}
                aria-label="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            </div>
          </SortableTask>
        ))}
      </div>

      <div
        className="board-add-card"
        data-no-dnd
        onClick={() => setCreateOpen(true)}
      >
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
      <CreateTaskDialog
        open={Boolean(editTask)}
        onClose={() => setEditTask(null)}
        onCreate={handleUpdateTask}
        initialValues={{
          title: editTask?.title,
          description: editTask?.description,
          priority: editTask?.priority,
        }}
        titleText="Update task"
        isCreating={updateTaskMutation.isPending}
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
