import { Board } from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

export type IBoardDocument = {
  name: string;
  description?: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export const mapBoardFromDoc = (id: string, data: IBoardDocument): Board => ({
  id,
  name: data.name,
  description: data.description,
  ownerId: data.ownerId,
  memberIds: data.memberIds,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
});
