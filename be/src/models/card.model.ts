import { Card, CardStatus } from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

export type ICardDocument = {
  boardId: string;
  name: string;
  description?: string;

  status: CardStatus;
  position: number;

  memberIds: string[];
  tasksCount: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export const mapCardFromDoc = (id: string, data: ICardDocument): Card => ({
  id,
  boardId: data.boardId,
  name: data.name,
  description: data.description,
  status: data.status,
  position: data.position,
  tasks_count: data.tasksCount,
  list_member: data.memberIds,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
});
