import { db } from '@/config/firebase';
import { IBoardDocument, mapBoardFromDoc } from '@/models/board.model';
import { Board, CreateBoardDto, UpdateBoardDto } from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'boards';

export const BoardRepo = {
  async create(dto: CreateBoardDto, ownerId: string): Promise<Board> {
    const now = Timestamp.now();

    const data: IBoardDocument = {
      name: dto.name,
      description: dto.description,
      ownerId,
      memberIds: [ownerId],
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection(COLLECTION).add(data);
    return mapBoardFromDoc(ref.id, data);
  },

  async findAllByUserId(userId: string): Promise<Board[]> {
    const snap = await db
      .collection(COLLECTION)
      .where('memberIds', 'array-contains', userId)
      .get();

    return snap.docs.map((doc) =>
      mapBoardFromDoc(doc.id, doc.data() as IBoardDocument),
    );
  },

  async findById(boardId: string): Promise<Board | null> {
    const doc = await db.collection(COLLECTION).doc(boardId).get();

    if (!doc.exists) return null;

    return mapBoardFromDoc(doc.id, doc.data() as IBoardDocument);
  },

  async update(boardId: string, dto: UpdateBoardDto): Promise<Board> {
    const updateData: Partial<IBoardDocument> & { updatedAt: Timestamp } = {
      updatedAt: Timestamp.now(),
    };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;

    await db.collection(COLLECTION).doc(boardId).update(updateData);

    const doc = await db.collection(COLLECTION).doc(boardId).get();
    return mapBoardFromDoc(doc.id, doc.data() as IBoardDocument);
  },

  async delete(boardId: string): Promise<void> {
    await db.collection(COLLECTION).doc(boardId).delete();
  },
};
