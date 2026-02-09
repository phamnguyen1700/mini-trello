import { db } from '@/config/firebase';
import { ICardDocument, mapCardFromDoc } from '@/models/card.model';
import {
  Card,
  CardStatus,
  CreateCardDto,
  UpdateCardDto,
} from '@shared/types';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'cards';

export const CardRepo = {
  async create(
    boardId: string,
    dto: CreateCardDto,
    creatorId: string,
  ): Promise<Card> {
    const now = Timestamp.now();

    const existingCards = await db
      .collection(COLLECTION)
      .where('boardId', '==', boardId)
      .where('status', '==', 'backlog')
      .get();

    const maxPosition = existingCards.empty
      ? 0
      : existingCards.docs.reduce((max, doc) => {
          const position = (doc.data() as ICardDocument).position;
          return Math.max(max, position);
        }, 0);

    const data: ICardDocument = {
      boardId,
      name: dto.name,
      status: 'backlog',
      position: maxPosition + 1,
      memberIds: [creatorId],
      tasksCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    const ref = await db.collection(COLLECTION).add(data);
    return mapCardFromDoc(ref.id, data);
  },

  async findAllByBoard(boardId: string): Promise<Card[]> {
    const snap = await db
      .collection(COLLECTION)
      .where('boardId', '==', boardId)
      .get();

    return snap.docs.map((doc) =>
      mapCardFromDoc(doc.id, doc.data() as ICardDocument),
    );
  },

  async findById(cardId: string): Promise<Card | null> {
    const doc = await db.collection(COLLECTION).doc(cardId).get();
    if (!doc.exists) return null;

    return mapCardFromDoc(doc.id, doc.data() as ICardDocument);
  },

  async findByBoardAndUser(boardId: string, userId: string): Promise<Card[]> {
    const snap = await db
      .collection(COLLECTION)
      .where('boardId', '==', boardId)
      .where('memberIds', 'array-contains', userId)
      .get();

    return snap.docs.map((doc) =>
      mapCardFromDoc(doc.id, doc.data() as ICardDocument),
    );
  },

  async update(cardId: string, dto: UpdateCardDto): Promise<Card> {
    const updateData: Partial<ICardDocument> & { updatedAt: Timestamp } = {
      updatedAt: Timestamp.now(),
    };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;

    await db.collection(COLLECTION).doc(cardId).update(updateData);
    const doc = await db.collection(COLLECTION).doc(cardId).get();

    return mapCardFromDoc(doc.id, doc.data() as ICardDocument);
  },

  async move(
    cardId: string,
    dto: { status?: CardStatus; position: number },
  ): Promise<Card> {
    const updateData: Partial<ICardDocument> & { updatedAt: Timestamp } = {
      position: dto.position,
      updatedAt: Timestamp.now(),
    };
    if (dto.status !== undefined) updateData.status = dto.status;

    await db.collection(COLLECTION).doc(cardId).update(updateData);

    const doc = await db.collection(COLLECTION).doc(cardId).get();
    return mapCardFromDoc(doc.id, doc.data() as ICardDocument);
  },

  async delete(cardId: string): Promise<void> {
    await db.collection(COLLECTION).doc(cardId).delete();
  },

  async adjustTasksCount(cardId: string, delta: number): Promise<void> {
    await db
      .collection(COLLECTION)
      .doc(cardId)
      .update({ tasksCount: FieldValue.increment(delta) });
  },

  async addMember(cardId: string, memberId: string): Promise<void> {
    await db
      .collection(COLLECTION)
      .doc(cardId)
      .update({ memberIds: FieldValue.arrayUnion(memberId) });
  },
};
