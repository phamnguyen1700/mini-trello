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
    const data = doc.data() as {
      email: string;
      code: string;
      isUsed: boolean;
      createdAt: Timestamp;
      expiresAt: Timestamp;
    };

    if (data.expiresAt.toDate() < new Date()) return false;

    await doc.ref.update({
      isUsed: true,
      usedAt: Timestamp.now(),
    });

    return true;
  },

  async createTempCode(
    userId: string,
    token: string,
    ttlSeconds = 30,
  ): Promise<string> {
    const code = Math.random().toString(36).substring(2, 15);

    await db.collection('temp-codes').add({
      code,
      userId,
      token,
      isUsed: false,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + ttlSeconds * 1000)),
    });

    return code;
  },

  async verifyTempCode(
    code: string,
  ): Promise<{ userId: string; token: string } | null> {
    const snap = await db
      .collection('temp-codes')
      .where('code', '==', code)
      .where('isUsed', '==', false)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const doc = snap.docs[0];
    const data = doc.data() as {
      code: string;
      userId: string;
      token: string;
      isUsed: boolean;
      expiresAt: Timestamp;
    };

    if (data.expiresAt.toDate() < new Date()) return null;

    await doc.ref.update({
      isUsed: true,
      usedAt: Timestamp.now(),
    });

    return { userId: data.userId, token: data.token };
  },
};
