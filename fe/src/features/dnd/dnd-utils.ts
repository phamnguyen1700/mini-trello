"use client";

import type { DragEvent } from "react";
import type { DragPayload } from "@/features/dnd/types";

const CARD_DATA_TYPE = "application/x-mini-trello-card";
const TASK_DATA_TYPE = "application/x-mini-trello-task";

export const setCardDragPayload = (
  event: DragEvent<HTMLElement>,
  payload: DragPayload,
) => {
  event.dataTransfer.setData(CARD_DATA_TYPE, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = "move";
};

export const getCardDragPayload = (
  event: DragEvent<HTMLElement>,
): DragPayload | null => {
  const raw =
    event.dataTransfer.getData(CARD_DATA_TYPE) ||
    event.dataTransfer.getData("application/json");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as DragPayload;
  } catch {
    return null;
  }
};

export const setTaskDragPayload = (
  event: DragEvent<HTMLElement>,
  payload: { taskId: string; fromCardId: string },
) => {
  event.dataTransfer.setData(TASK_DATA_TYPE, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = "move";
};

export const getTaskDragPayload = (
  event: DragEvent<HTMLElement>,
): { taskId: string; fromCardId: string } | null => {
  const raw =
    event.dataTransfer.getData(TASK_DATA_TYPE) ||
    event.dataTransfer.getData("application/json");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as { taskId: string; fromCardId: string };
  } catch {
    return null;
  }
};

export const isTaskDragEvent = (event: DragEvent<HTMLElement>) => {
  return event.dataTransfer.types.includes(TASK_DATA_TYPE);
};

export const getTaskPayloadOrNull = (
  event: DragEvent<HTMLElement>,
): { taskId: string; fromCardId: string } | null => {
  if (!isTaskDragEvent(event)) return null;
  return getTaskDragPayload(event);
};

