import { db } from '@/config/firebase';
import { Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'verification-codes';

export const AuthRepo = {
  async createCode(email: string, code: string, ttlMinutes = 1): Promise<void> {
    await db.collection(COLLECTION).add({
      email,
      code,
      isUsed: false,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(
        new Date(Date.now() + ttlMinutes * 60 * 1000),
      ),
    });
  },

  async verifyCode(email: string, code: string): Promise<boolean> {
    const snap = await db
      .collection(COLLECTION)
      .where('email', '==', email)
      .where('code', '==', code)
      .where('isUsed', '==', false)
      .limit(1)
      .get();

    if (snap.empty) return false;

    const doc = snap.docs[0];
    const data = doc.data();

    if (data.expiresAt.toDate() < new Date()) return false;

    await doc.ref.update({
      isUsed: true,
      usedAt: Timestamp.now(),
    });

    return true;
  },
};
