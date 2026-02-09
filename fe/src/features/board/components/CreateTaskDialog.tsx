"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
  }) => void;
  initialValues?: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
  };
  titleText?: string;
  isCreating?: boolean;
}

export const CreateTaskDialog = ({
  open,
  onClose,
  onCreate,
  initialValues,
  titleText = "Create a new task",
  isCreating,
}: CreateTaskDialogProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialValues?.priority ?? "medium",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  useEffect(() => {
    if (!open) return;
    setTitle(initialValues?.title ?? "");
    setDescription(initialValues?.description ?? "");
    setPriority(initialValues?.priority ?? "medium");
  }, [open, initialValues]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-no-dnd onPointerDown={(event) => event.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isCreating}
            required
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isCreating}
            rows={3}
          />
          <div className="space-y-2">
            <label className="text-sm text-muted">Priority</label>
            <select
              className="w-full rounded-md border border-slate-700 bg-transparent p-2 text-sm"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              disabled={isCreating}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !title.trim()}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

