import { db } from '@/config/firebase';
import { IUserDocument, mapUserFromDoc } from '@/models/user.model';
import { User } from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'users';

export const UserRepo = {
  async findByEmail(email: string): Promise<User | null> {
    const snap = await db
      .collection(COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const doc = snap.docs[0];
    return mapUserFromDoc(doc.id, doc.data() as IUserDocument);
  },

  async create(email: string): Promise<User> {
    const displayName = email.split('@')[0];
    const now = Timestamp.now();

    const data: IUserDocument = {
      email,
      displayName,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection(COLLECTION).add(data);
    return mapUserFromDoc(ref.id, data);
  },

  async findByGithubId(githubId: string): Promise<User | null> {
    const snap = await db
      .collection(COLLECTION)
      .where('githubId', '==', githubId)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const doc = snap.docs[0];
    return mapUserFromDoc(doc.id, doc.data() as IUserDocument);
  },

  async updateWithGitHub(
    userId: string,
    data: { githubId: string; avatarUrl?: string; displayName?: string },
  ): Promise<User> {
    const updateData: Partial<IUserDocument> & { updatedAt: Timestamp } = {
      githubId: data.githubId,
      updatedAt: Timestamp.now(),
    };

    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;
    if (data.displayName) updateData.displayName = data.displayName;

    await db.collection(COLLECTION).doc(userId).update(updateData);

    const doc = await db.collection(COLLECTION).doc(userId).get();
    return mapUserFromDoc(doc.id, doc.data() as IUserDocument);
  },

  async findById(userId: string): Promise<User | null> {
    const doc = await db.collection(COLLECTION).doc(userId).get();

    if (!doc.exists) return null;

    return mapUserFromDoc(doc.id, doc.data() as IUserDocument);
  },
};
