import { User } from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

export type IUserDocument = {
  email: string;
  displayName: string;
  avatarUrl?: string;
  githubId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export const mapUserFromDoc = (id: string, data: IUserDocument): User => ({
  id,
  email: data.email,
  displayName: data.displayName,
  avatarUrl: data.avatarUrl,
  githubId: data.githubId,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
});
