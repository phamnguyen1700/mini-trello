import { Task, TaskStatus, TaskPriority } from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

export type ITaskDocument = {
  cardId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: Timestamp;
  position: number;
  assignedTo?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export const mapTaskFromDoc = (id: string, data: ITaskDocument): Task => ({
  id,
  cardId: data.cardId,
  title: data.title,
  description: data.description,
  priority: data.priority,
  status: data.status,
  deadline: data.deadline?.toDate(),
  position: data.position,
  assignedTo: data.assignedTo,
  createdBy: data.createdBy,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
});

